import React, { useState } from "react";
import styled from "styled-components";
import FacebookLogin from "react-facebook-login";
import constants from "./constants";

const App = () => {
  const [isLoggedIn, setLogInStatus] = useState(false);
  const [userID, setUserID] = useState("");


  const handleClick = () => {
    console.log("logging in");
  };

  const handleResponse = (response) => {
    setUserID(response.id);
    setLogInStatus(true);
  };

  return isLoggedIn ? (
    <h1>Welcome {userID}</h1>
  ) : (
    <Layout>
      <TitleContainer>
        <Title>LifeMap</Title>
      </TitleContainer>

      <BodyContainer>
        <p>Welcome to LifeMap.</p>
        <FacebookLogin
          appId={constants.fb_key}
          autoload={true}
          reauthenticate={true}
          authload={true}
          fields="name,email"
          onClick={handleClick}
          callback={handleResponse}
        />
      </BodyContainer>
    </Layout>
  );
};

export default App;

const Layout = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`;

const TitleContainer = styled.header`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const BodyContainer = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  align-items: center;
`;

const Title = styled.h1`
  font-family: sans-serif;
  color: blue;
`;
