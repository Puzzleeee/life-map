import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import FacebookLogin from "react-facebook-login";

const App = () => {
  const [facebookID, setFacebookID] = useState("");
  const [isLoggedIn, setLogInStatus] = useState(false);
  const [userID, setUserID] = useState("");

  // useEffect(() => {
  //   console.log("rendering");
  //   (async () => {
  //     setFacebookID(axios.get("localhost:5000/").fb_key);
  //   })();
  // }, [facebookID]);

  const handleClick = () => {
    console.log("logging in");
  };

  const handleResponse = (response) => {
    console.log(response);
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
          appId="853609955129035"
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
