import React from "react";
import styled from "styled-components";
import FacebookLogin from "react-facebook-login";

const App = () => {
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
          appId=""
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
