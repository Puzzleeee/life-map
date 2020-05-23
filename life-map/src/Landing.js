import React, { useState, useRef } from "react";
import styled from "styled-components";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import axios from "axios";
import Home from "./Home";
import mapImage from "./static/map.jpg";

const Landing = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userID, setUserID] = useState("");

  // DOM refs for scrolling
  const loginRef = React.useRef();
  const registerRef = React.useRef();

  const scrollToLogin = () => {
    loginRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const loginRedirect = (userID) => {
    setUserID(userID);
    setLoggedIn(true);
  };

  return (
    <Router>
      {isLoggedIn ? (
        <Redirect to="/home" />
      ) : (
        <Container>
          <HeroImage>
            <HeroContainer>
              <Title>Welcome to LifeMap</Title>
              <Button onClick={scrollToLogin}>Register / Login</Button>
            </HeroContainer>
          </HeroImage>
          <Login
            loginRef={loginRef}
            registerRef={registerRef}
            redirect={loginRedirect}
          />
          <Register registerRef={registerRef} redirect={loginRedirect} />
        </Container>
      )}

      {/* start of routes */}
      <Switch>
        <Route path="/home">
          <Home userID={userID} />
        </Route>
      </Switch>
      {/* end of routes */}
    </Router>
  );
};

const Login = ({ loginRef, registerRef, redirect }) => {
  const [emailInput, setEmail] = useState("");
  const [passwordInput, setPassword] = useState("");
  const [hasError, setError] = useState(false);

  /* helper for credential authentication with backend */
  const authCheck = async () => {
    const {
      data: { success },
    } = await axios.post("http://localhost:5000/login", {
      email: emailInput,
      password: passwordInput,
    });

    // for now, just return success status (without user data)
    return success;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (await authCheck()) {
      redirect(emailInput);
    } else {
      setError(true);
    }
  };

  const scrollToRegister = () => {
    registerRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <LoginContainer ref={loginRef}>
      <h2 style={{ marginBottom: "36px", fontWeight: "100" }}>Login</h2>
      <Form onSubmit={handleSubmit}>
        <Label>Email</Label>
        <TextInput
          type="text"
          placeholder="Email address"
          value={emailInput}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Label>Password</Label>
        <TextInput
          type="password"
          placeholder="Password"
          value={passwordInput}
          onChange={(e) => setPassword(e.target.value)}
        />
        <LoginFooter>
          <FormButton
            type="button"
            style={{ fontSize: "0.75em" }}
            onClick={scrollToRegister}
          >
            Don't have an account? Register here
          </FormButton>
          <p style={{ height: "24px", color: "red" }}>
            {hasError ? "Invalid credentials" : ""}
          </p>
          <FormButton type="submit">Log in</FormButton>
        </LoginFooter>
      </Form>
    </LoginContainer>
  );
};

const Register = ({ registerRef, redirect }) => {
  const [emailInput, setEmail] = useState("");
  const [nameInput, setName] = useState("");
  const [passwordInput, setPassword] = useState("");
  const [error, setError] = useState("");

  /* backend call to create account */
  const createAccount = async () => {
    const req = {
      name: nameInput,
      email: emailInput,
      password: passwordInput,
    };

    const response = await axios.post("http://localhost:5000/register", req);

    if (response.data.message ==='duplicate') {
      // email was taken
      setError("Email has been taken");
    } else if (!response.data.success) {
      // unknown exception
      setError("Something bad happened");
    } else {
      // succesful registration
      redirect(emailInput);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await createAccount();
  };

  return (
    <RegisterContainer ref={registerRef}>
      <h2 style={{ marginBottom: "36px", fontWeight: "100" }}>Register</h2>
      <Form onSubmit={handleSubmit}>
        <Label>Email</Label>
        <TextInput
          type="email"
          placeholder="Enter your email address"
          value={emailInput}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Label>Username</Label>
        <TextInput
          type="text"
          placeholder="Enter a username"
          value={nameInput}
          onChange={(e) => setName(e.target.value)}
        />
        <Label>Password</Label>
        <TextInput
          type="text"
          placeholder="Enter a password"
          value={passwordInput}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormButton type="submit" style={{ marginTop: "24px" }}>
          Register
        </FormButton>
        <p style={{ height: "24px", color: "red" }}>{error}</p>
      </Form>
    </RegisterContainer>
  );
};

export default Landing;

const Container = styled.div`
  width: 100%;
`;

const HeroImage = styled.div`
  height: 100vh;
  background-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.2),
      rgba(0, 0, 0, 0.1)
    ),
    url(${mapImage});
  background-position: 30% 50%;
  background-repeat: no-repeat;
  background-size: cover;
`;

const HeroContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h1`
  font-size: 2em;
  margin-top: 50px;
  letter-spacing: 2px;
  font-weight: 100;
`;

const Button = styled.button`
  border-radius: 16px;
  padding: 6px 36px;
  margin-bottom: 50px;
  cursor: pointer;

  text-align: center;
  font-size: 1.1em;
  font-weight: 300;
  letter-spacing: 2px;

  background-color: rgb(17, 82, 168);
  color: white;

  transition: all 0.1s ease;

  &:hover {
    background-color: rgba(17, 82, 168, 0.8);
  }
`;

const LoginContainer = styled.section`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(250, 249, 245, 1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 50%;
`;

const Label = styled.label`
  font-size: 1.1em;
  letter-spacing: 1px;
  margin-bottom: 12px;
`;

const TextInput = styled.input`
  margin-bottom: 18px;
  font-size: 1.1em;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid grey;
`;

const LoginFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FormButton = styled.button`
  font-size: 1.1em;
  padding: 8px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.1s ease;

  &:hover {
    background-color: #1152a8;
    color: white;
  }
`;

const RegisterContainer = styled.section`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgb(217, 126, 147, 0.1);
`;
