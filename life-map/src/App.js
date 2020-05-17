import React, { useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

const App = () => {
  let facebookID = undefined;

  useEffect(() => {
    (async () => {
      facebookID = axios.get();
    })();
  });

  const handleClick = () => {
    console.log("logging in");
  };

  const handleResponse = (response) => {
    console.log("got response");
    console.log(response);
  };

  return (
    <Layout>
      <TitleContainer>
        <Title>LifeMap</Title>
      </TitleContainer>

      <BodyContainer>
        <p>Welcome to LifeMap.</p>
        <FacebookLogin
          appId={facebookID}
          autoload={true}
          fields="name,email"
          onClick={handleClick}
          callback={handleResponse}
        />
      </BodyContainer>
    </Layout>
  );
};

export default App;

const CustomHeader = styled.h1`
  display: flex;
  color: black;
`
