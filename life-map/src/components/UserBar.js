import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import axios from "axios";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

const config = {
  withCredentials: true,
  headers: {
    "content-type": "application/json",
  },
};

const UserBar = ({ userID, navigateToProfile }) => {

  const [profilePic, setProfilePic] = useState(null);
  const [name, setName] = useState("");

  useEffect(() => {
    console.log("UserBar use effect called");
    (async () => {
      try {
        const { data: { success, profile_pic, name }} = await axios.post(
          "/profile/user-summary",
          { id: userID },
          config
        );
        if (success) {
          setProfilePic(profile_pic);
          setName(name);
        }
      } catch (err) {
        console.log(err)
      }
    })();
  }, [userID]);

  return (
    <Container
      onClick={() => navigateToProfile(userID)}>
      <Avatar
        src={profilePic || ""}
        alt={name}
        style={{ marginRight: "16px" }}
      />
      <Typography variant="h6">{name}</Typography>
    </Container>
  );
}

export default UserBar;

const Container = styled.div`
  display: flex;
  text-align: center;
  cursor: pointer;
`