import React from "react";
import styled from "styled-components";
import axios from "axios";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from '@material-ui/icons/Clear';
import useSocialButton from '../hooks/useSocialButton.js';

const config = {
  withCredentials: true,
  headers: {
    "content-type": "application/json",
  },
};

/**
 * @description Component to display a single user card in a list of followers/following users
 * @props {object} viewerInfo - the viewer's social info. Used to check relationship with the user displayed in this Card
 * @props {function} setViewerInfo - function to set viewerInfo state
 * @props {object} user - the user object to render
 * @props {function} changeProfile - a route handler to change the current user being displayed on
 * @props {boolean} isViewingOwn - Viewing own profile or other's profile
 * @props {string} type - Describing the role of the Card, either in the followers tab or following tab
 * the profile page
 */
const UserCard = ({ viewerInfo, setViewerInfo, user, changeProfile, isViewingOwn, type }) => {
  
  const [isFollowing, requestSent, handleButtonClick] = useSocialButton(viewerInfo, setViewerInfo, user);

  const removeFollower = (event) => {
    event.stopPropagation();
    const relationship = viewerInfo.followers.filter((relation) => relation.follower === user.id)[0];
    return axios.post(
      "/api/social/remove-follower-relationship",
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

  return (
    <CardContainer onClick={() => changeProfile(user.id)}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Avatar
          src={user?.profile_pic || ""}
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
