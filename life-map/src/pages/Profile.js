import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Paper from "@material-ui/core/Paper";

const config = {
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};

const Profile = ({ userID }) => {
  // const [socialInfo, setSocialInfo] = useState({});
  const [tabIndex, setTabIndex] = useState(0);

  // test data
  const socialInfo = {
    username: "Sam",
    biography: "I'm a student at NUS. I'm also an intern. I am a coder.",
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/social/social-info",
          config
        );
        // setSocialInfo(data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <Container>
      <Header>
        <Avatar
          src={socialInfo.avatar && ""}
          alt={socialInfo.username}
          style={{ height: "92px", width: "92px" }}
        />
        <UserInfo>
          <Typography variant="h4" style={{ marginBottom: "4px" }}>
            {socialInfo.username}
          </Typography>
          <Typography variant="subtitle1">{socialInfo.biography}</Typography>
        </UserInfo>
      </Header>

      <Paper square>
        <Tabs
          value={tabIndex}
          onChange={(event, newValue) => {
            setTabIndex(newValue);
          }}
          variant="fullWidth"
        >
          <Tab label="entries" />
          <Tab label="following" />
          <Tab label="followers" />
        </Tabs>
      </Paper>
    </Container>
  );
};

export default Profile;

const Container = styled.section`
  width: 100%;
  max-width: 750px;
  margin: 0 auto;
  padding: 48px 12px;
  display: flex;
  flex-direction: column;
  background-color: white;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 24px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0px 24px;
`;
