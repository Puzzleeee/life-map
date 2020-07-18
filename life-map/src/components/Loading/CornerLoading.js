import React from "react";
import styled from "styled-components";
import CircularProgress from '@material-ui/core/CircularProgress'; 

const CornerLoading = () => {
  return (
    <LoadingContainer>
      <CircularProgress/>
    </LoadingContainer>
  );
}

export default CornerLoading;

const LoadingContainer = styled.div`
  position: fixed;
  z-index: 100;
  bottom: 0.5%;
  right: 0.5%;
`