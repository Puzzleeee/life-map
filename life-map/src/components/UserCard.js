import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const config = {
  withCredentials: true,
  headers: {
    "content-type": "application/json",
  },
};

/**
 * @description Component to display a single user card in a list of followers/following users
 * @props {string} viewer - the viewer's ID. Used to check if the viewer follows the user or not.
 * @props {object} user - the user object to render
 * @props {function} changeProfile - a route handler to change the current user being displayed on
 * the profile page
 */
const UserCard = ({ viewerInfo, user, changeProfile }) => {
  const [isFollowing, setIsFollowing] = useState(
    // go through array of follow relationships and check if followee is the user in this card
    viewerInfo.following.some(
      (followRelationship) => followRelationship.followee === user.id
    )
  );

  const handleButtonClick = (event) => {
    // don't propagate click event to parent listener (which changes profile page)
    event.stopPropagation();

    if (!isFollowing) {
      axios
        .post(
          "http://localhost:5000/social/follow",
          { recipient: user.id },
          config
        )
        .then(() => setIsFollowing(true))
        .catch((error) => {
          console.error(error);
        });
    }

    // in future, handle unfollow action
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

      <Button
        size="small"
        variant="contained"
        color={isFollowing ? "secondary" : "primary"}
        onClick={handleButtonClick}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
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
