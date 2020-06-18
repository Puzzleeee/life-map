import React, { useState, useRef } from "react";
import styled from "styled-components";
import { makeStyles } from '@material-ui/core/styles';
import { Redirect } from "react-router-dom";
import axios from "axios";
import mapImage from "../static/coffee-image.jpg";
import loginImage from "../static/login-image.jpg";
import registerImage from "../static/cover-image.jpg";
import logo from "../static/logo.png"
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

// config required to make requests specific to the user that is logged in,
// include this when using axios so that back-end knows which user is logged in
const config = {
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};

const useStyles = makeStyles({
  root: {
    backgroundColor: 'rgba(247, 247, 247, 0.9)',
    height: '70%',
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInput: {
    marginBottom: '1rem',
  },
})


const Landing = () => {
  const classes = useStyles();
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userID, setUserID] = useState("");

  // DOM refs for scrolling
  const loginRef = useRef();
  const registerRef = useRef();

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
    <div>
      {isLoggedIn ? (
        <Redirect
          push
          to={{
            pathname: "/home",
            state: { userID: userID },
          }}
        />
      ) : (
        <Container>
          <HeroImage>
            <HeroContainer>
              <Title>
                <Logo src={logo}/>
              </Title>
              <Slogan>
                Enter some slogan here
              </Slogan>
              <BorderlessButton onClick={scrollToLogin} style={{ fontSize: "1.5rem" }}>Register / Login</BorderlessButton>
            </HeroContainer>
          </HeroImage>
          <Login
            loginRef={loginRef}
            registerRef={registerRef}
            redirect={loginRedirect}
          />
          <Register 
            loginRef={loginRef}
            registerRef={registerRef}
            redirect={loginRedirect}
          />
        </Container>
      )}
    </div>
  );
};

const Login = ({ loginRef, registerRef, redirect }) => {
  const classes = useStyles();
  const [emailInput, setEmail] = useState("");
  const [passwordInput, setPassword] = useState("");
  const [hasError, setError] = useState(false);

  /* helper for credential authentication with backend */
  const authCheck = async () => {
    const response = await axios.post(
      "http://localhost:5000/login",
      {
        email: emailInput,
        password: passwordInput,
      },
      config
    );
    return { success: response.data.success, name: response.data.user.name };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await authCheck();

    if (response.success) {
      redirect(response.name);
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
      <Card className={classes.root}>
        <h2 style={{ marginBottom: "36px", fontWeight: "100", fontSize: "1.5rem" }}>Login</h2>
        <Form onSubmit={handleSubmit}>
          <TextField 
            className={classes.textInput}
            label="Email" 
            variant="outlined" 
            value={emailInput} 
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            className={classes.textInput}
            label="Password"
            variant="outlined" 
            value={passwordInput} 
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormFooter>
            <BorderlessButton
              type="button"
              style={{ fontSize: "0.75em" }}
              onClick={scrollToRegister}
            >
              Don't have an account? Register Now!
            </BorderlessButton>
            <p style={{ height: "24px", color: "red" }}>
              {hasError ? "Invalid credentials" : ""}
            </p>
            <Button type="submit" variant="contained" color="primary"> Login </Button>
          </FormFooter>
        </Form>
      </Card>
    </LoginContainer>
  );
};

const Register = ({ loginRef, registerRef, redirect }) => {
  const classes = useStyles();
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

    if (response.data.message === "duplicate") {
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

  const scrollToLogin = () => {
    loginRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await createAccount();
  };

  return (
    <RegisterContainer ref={registerRef}>
      <Card className={classes.root}>
      <h2 style={{ marginBottom: "36px", fontWeight: "100", fontSize: "1.5rem" }}>Register an account</h2>
        <Form onSubmit={handleSubmit}>
          <TextField 
            className={classes.textInput}
            label="Email" 
            variant="outlined" 
            value={emailInput} 
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField 
            className={classes.textInput}
            label="Username" 
            variant="outlined" 
            value={nameInput} 
            onChange={(e) => setName(e.target.value)}
          />
          <TextField 
            className={classes.textInput}
            label="Email" 
            variant="outlined" 
            value={passwordInput} 
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormFooter>
            <BorderlessButton
                type="button"
                style={{ fontSize: "0.75em" }}
                onClick={scrollToLogin}
            >
              Back to login
            </BorderlessButton>
            <p style={{ height: "24px", color: "red" }}>{error}</p>
            <Button type="submit" variant="contained" color="primary"> Register </Button>
          </FormFooter>
        </Form>
      </Card>
    </RegisterContainer>
  );
};

export default Landing;

const Container = styled.div`
  width: 100%;
  font-family: "Roboto";
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
  justify-content: center;
  backdrop-filter: blur(4px);
  
`;

const Title = styled.h1`
  font-size: 2em;
  margin-top: 50px;
  letter-spacing: 2px;
  font-weight: 500;
`;

const Slogan = styled.h4`
  font-size: 1.5em;
  margin-top: 1.5rem;
  font-weight: 400;
  font-family: 'Montserrat', sans-serif;
`

const Logo = styled.img`
  max-width: 100%;
  height: auto;
`;


const BorderlessButton = styled.button`
  border: 0px;
  cursor: pointer;

  font-size: 1.1em;
  font-weight: 100;
  letter-spacing: 2px;

  background: none;

  transition: all 500ms cubic-bezier(0.77, 0, 0.175, 1);	

  &:hover {
    text-decoration: underline
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

  background-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.2),
      rgba(0, 0, 0, 0.1)
    ),
    url(${loginImage});
  background-position: 30% 50%;
  background-repeat: no-repeat;
  background-size: cover;
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

const FormFooter = styled.div`
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
  border: 1px solid grey;

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

  background-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.2),
      rgba(0, 0, 0, 0.1)
    ),
    url(${registerImage});
  background-position: 30% 50%;
  background-repeat: no-repeat;
  background-size: cover;
`;
