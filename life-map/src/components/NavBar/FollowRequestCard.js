import React, { forwardRef } from "react";
import styled from "styled-components";
import axios from "axios";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";

/**
 * @description UI component to show a single follow request as a card in a menu modal
 * @props {object} request - the request object
 * @props {function} UIhandler - a UI update handler to mutate UI state in the parent
 * that renders this component
 */
const FollowRequestCard = forwardRef(({ request, UIhandler }, ref) => {
  const { id, sender, recipient } = request;

  const handleAccept = (event) => {
    event.stopPropagation();
    const payload = { id, sender, recipient };
    axios
      .post("http://localhost:5000/social/accept-follow-request", payload)
      .then(() => {
        UIhandler(id, "hide");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDecline = (event) => {
    event.stopPropagation();
    const payload = { id, sender, recipient };
    axios
      .post("http://localhost:5000/social/decline-follow-request", payload)
      .then(() => {
        UIhandler(id, "hide");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <li ref={ref}>
      <Container>
        <Typography variant="body1">
          {request.name} wants to follow you
        </Typography>
        <ButtonContainer>
          <IconButton color="primary" onClick={(e) => handleAccept(e)}>
            <CheckIcon />
          </IconButton>
          <IconButton color="secondary" onClick={(e) => handleDecline(e)}>
            <ClearIcon />
          </IconButton>
        </ButtonContainer>
      </Container>
    </li>
  );
});

export default FollowRequestCard;

const Container = styled.div`
  width: 100%;
  padding-left: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  @media (min-width: 960px) {
    width: 350px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;
