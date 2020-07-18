import React from "react";
import styled from "styled-components";
import CircularProgress from '@material-ui/core/CircularProgress';

const LoadingIndicator = () => {
  return (
    <LoadingContainer>
      <CircularProgress/>
    </LoadingContainer>
  );
}

const LoadingContainer = styled.div`
  width: 100%;
  height: 94.5vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

export default LoadingIndicator;