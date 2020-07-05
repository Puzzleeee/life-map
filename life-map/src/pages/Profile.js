import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import CheckIcon from "@material-ui/icons/Check";
import EditIcon from "@material-ui/icons/Edit";
import TextField from "@material-ui/core/TextField";

const config = {
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};

/**
 * @description Component to display a single user card in a list of followers/following users
 * @props {string} viewer - the viewer's ID. Used to check if the viewer follows the user or not.
 * @props {object} user - the user object to render
 */
const UserCard = ({ viewer, user }) => {
  const [isFollowing, setIsFollowing] = useState(
    user.followers.includes(viewer)
  );

  const handleClick = () => {
    if (!isFollowing) {
      axios
        .post("http://localhost:5000/social/follow", config, {
          recipient: user.id,
        })
        .then(() => setIsFollowing(true))
        .catch((error) => {
          console.error(error);
        });
    }

    // in future, handle unfollow action
  };

  return (
    <CardContainer>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Avatar
          src={user.avatar && ""}
          alt={user.username}
          style={{ marginRight: "16px" }}
        />
        <Typography variant="subtitle2">{user.name}</Typography>
      </div>

      <Button
        size="small"
        variant="contained"
        color={isFollowing ? "secondary " : "primary"}
        onClick={handleClick}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
    </CardContainer>
  );
};

/**
 * @description A page to fetch and display a single user's profile
 * @props {string} viewerID - the viewer's ID. Used to determine if you're viewing your own profile
 * @props {string} userID - the userID of the user to fetch and display
 */
const Profile = ({ viewerID, userID }) => {
  const [profileInfo, setProfileInfo] = useState({
    // test data. delete once backend works. i.e. useState({})
    username: "Sam",
    bio: "I'm a student at NUS. I'm also an intern. I am a coder.",
  });
  const [tabIndex, setTabIndex] = useState(0);

  const [nameInput, setNameInput] = useState(profileInfo.username);
  const [isEditingName, setIsEditingName] = useState(false);

  const [bioInput, setBioInput] = useState(profileInfo.bio);
  const [isEditingBio, setIsEditingBio] = useState(false);

  // is the viewer visiting his own profile, or someone else's?
  const isViewingOwn = viewerID === userID;

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.post(
          "http://localhost:5000/profile/user",
          { id: userID, ...config }
        );
        console.log(data);
        // temporarily commented out since data is not correct
        // setProfileInfo(data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [userID]);

  const handleEdit = (value, field) => {
    // in future, add call to post and edit user profile before updating UI state
    switch (field) {
      case "username":
        setIsEditingName(false);
        setProfileInfo((prev) => ({ ...prev, username: value }));
        return;
      case "bio":
        setIsEditingBio(false);
        setProfileInfo((prev) => ({ ...prev, bio: value }));
        return;
      default:
        return;
    }
  };

  return (
    <Container>
      <Header>
        <Avatar
          src={profileInfo.profile_pic && ""}
          alt={profileInfo.username}
          style={{ height: "92px", width: "92px" }}
        />

        <UserInfo>
          {/* start name component */}
          <div style={{ display: "flex", alignItems: "center" }}>
            {!isEditingName && (
              <>
                <Typography variant="h4" style={{ marginBottom: "4px" }}>
                  {profileInfo.username}
                </Typography>

                {/* only display edit button if at your own profile */}
                {!!isViewingOwn && (
                  <IconButton
                    color="primary"
                    onClick={() => setIsEditingName(true)}
                  >
                    <EditIcon />
                  </IconButton>
                )}
              </>
            )}

            {!!isEditingName && (
              <>
                <TextField
                  value={nameInput}
                  onChange={(event) => setNameInput(event.target.value)}
                />
                <IconButton
                  color="primary"
                  onClick={() => handleEdit(nameInput, "username")}
                >
                  <CheckIcon />
                </IconButton>
              </>
            )}
          </div>
          {/* end name component */}

          {/* start bio component */}
          <div style={{ display: "flex", alignItems: "center" }}>
            {!isEditingBio && (
              <>
                <Typography variant="subtitle1">{profileInfo.bio}</Typography>

                {/* only display edit button if at your own profile */}
                {!!isViewingOwn && (
                  <IconButton
                    color="primary"
                    onClick={() => setIsEditingBio(true)}
                  >
                    <EditIcon />
                  </IconButton>
                )}
              </>
            )}

            {!!isEditingBio && (
              <>
                <TextField
                  value={bioInput}
                  onChange={(event) => setBioInput(event.target.value)}
                  multiline
                />
                <IconButton
                  color="primary"
                  onClick={() => handleEdit(bioInput, "bio")}
                >
                  <CheckIcon />
                </IconButton>
              </>
            )}
          </div>
          {/* end bio component */}
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

      <Paper>
        {tabIndex === 1 &&
          !!profileInfo.followers &&
          profileInfo.followers.map((user) => (
            <UserCard viewer={viewerID} user={user} />
          ))}

        {tabIndex === 2 &&
          !!profileInfo.following &&
          profileInfo.following.map((user) => (
            <UserCard viewer={viewerID} user={user} />
          ))}
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

const CardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 24px;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
`;
