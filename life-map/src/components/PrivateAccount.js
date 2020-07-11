import React from "react";
import styled from "styled-components";
import LockIcon from '@material-ui/icons/Lock';
import Typography from '@material-ui/core/Typography';

const PrivateAccount = () => {
  return (
    <Container>
      <LockIcon style={{ fontSize: "2.5rem" }}/>
      <Typography variant="h5" style={{ color: "rgba(0, 0, 0, 0.5)" }}>
        This account is private
      </Typography>
    </Container>
  )
}

export default PrivateAccount

const Container = styled.div`
  margin: 25px 25px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;