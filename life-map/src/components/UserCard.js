import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from '@material-ui/icons/Clear';

const config = {
  withCredentials: true,
  headers: {
    "content-type": "application/json",
  },
};

/**
 * @description Component to display a single user card in a list of followers/following users
 * @props {object} viewInfo - the viewer's info. Used to check if viewer's relationship with the user
 * @props {function} setViewerInfo - function to set viewerInfo state
 * @props {object} user - the user object to render
 * @props {function} changeProfile - a route handler to change the current user being displayed on
 * @props {boolean} isViewingOwn - Viewing own profile or other's profile
 * @props {string} type - Describing the role of the Card, either in the followers tab or following tab
 * the profile page
 */
const UserCard = ({ viewerInfo, setViewerInfo, user, changeProfile, isViewingOwn, type }) => {
  // go through array of follow relationships and check if followee is the user in this card
  const isFollowing = viewerInfo.following.some((followRelationship) => followRelationship.followee === user.id);
  
  // go through array of sent follow requests and check if recipient is the user in this card
  const requestSent = viewerInfo.sentRequests.some((request) => request.recipient === user.id);
  
  const removeFollower = (event) => {
    event.stopPropagation();
    const relationship = viewerInfo.followers.filter((relation) => relation.follower === user.id)[0];
    return axios.post(
      "/social/remove-follower-relationship",
      relationship,
      config
    ).then(() => {
      const new_followers = viewerInfo.followers.filter((relation) => relation.follower !== user.id);
      setViewerInfo({
        ...viewerInfo,
        followers: new_followers
      });
    })
  }

  const unfollow = () => {
    const relationship = viewerInfo.following.filter((relation) => relation.followee === user.id)[0];
    return axios.post(
      "/social/remove-follower-relationship",
      relationship,
      config
    ).then(() => {
      const new_following = viewerInfo.following.filter((relation) => relation.followee !== user.id);
      setViewerInfo({
        ...viewerInfo,
        following: new_following
      })
    })
  }

  const follow = () => {
    return axios
        .post(
          "/social/follow",
          { recipient: user.id },
          config
        )
        .then(({request_id}) => {
          // make a follow request object to avoid having to query endpoint again 
          const new_request = {
            id: request_id,
            sender: viewerInfo.id,
            recipient: user.id,
            date_time: new Date(),
          }
          const requests = viewerInfo.sentRequests.splice(0)
          requests.push(new_request);
          setViewerInfo({...viewerInfo, sentRequests: requests});
        })
  }

  const undoRequest = () => {
    const request = viewerInfo.sentRequests.filter(req => req.recipient === user.id)[0];
    return axios.post(
      "/social/decline-follow-request",
      request,
      config
    )
    .then(() => {
      const new_sent_requests = viewerInfo.sentRequests.filter(req => req.recipient !== user.id);
      setViewerInfo({
        ...viewerInfo,
        sentRequests: new_sent_requests
      })
    })
  }
  
  const handleButtonClick = (event) => {
    // don't propagate click event to parent listener (which changes profile page)
    event.stopPropagation();

    // handle unfollow action
    if (isFollowing) {
      unfollow().catch((err) => console.log(err));
    }

    // Not following and request not sent
    if (!isFollowing && !requestSent) {
      follow().catch((err) => console.log(err));
    }

    // Request sent but not accepted
    if (!isFollowing && requestSent) {
      undoRequest().catch((err) => console.log(err));
    }
  };

  return (
    <CardContainer onClick={() => changeProfile(user.id)}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Avatar
          src={user.profile_pic && ""}
          alt={user.name}
          style={{ marginRight: "16px" }}
        />
        <Typography variant="subtitle2">{user.name}</Typography>
      </div>
      {isViewingOwn && 
        <div>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={handleButtonClick}
          >
            {requestSent ? "Requested"
              : isFollowing ? "Following"
                  : "Follow"}
          </Button>
          {type === 'follower' && 
            <IconButton
              color="secondary"
              onClick={removeFollower}
            >
              <ClearIcon/>
            </IconButton>
          }
        </div>
      }
    </CardContainer>
  );
};

export default UserCard;

const CardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 24px;
  cursor: pointer;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
`;
