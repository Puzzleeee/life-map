import React from "react";
import styled from "styled-components";
import axios from "axios";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";

const FollowRequestCard = ({ request, UIhandler }) => {
  const { id, sender, recipient } = request;

  const handleAccept = () => {
    const payload = { id, sender, recipient };
    axios
      .post("http://localhost:5000/social/accept-follow-request", payload)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDecline = () => {
    const payload = { id, sender, recipient };
    axios
      .post("http://localhost:5000/social/decline-follow-request", payload)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <li>
      <Container>
        <Typography variant="body1">
          {request.name} wants to follow you
        </Typography>
        <ButtonContainer>
          <IconButton color="primary" onClick={handleAccept}>
            <CheckIcon />
          </IconButton>
          <IconButton color="secondary" onClick={handleDecline}>
            <ClearIcon />
          </IconButton>
        </ButtonContainer>
      </Container>
    </li>
  );
};

export default FollowRequestCard;

const Container = styled.div`
  width: 350px;
  padding-left: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;
