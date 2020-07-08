import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { useSnackbar } from "notistack";
import EntryCard from "../components/EntryCard";
import UserCard from "../components/UserCard";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import CheckIcon from "@material-ui/icons/Check";
import EditIcon from "@material-ui/icons/Edit";
import TextField from "@material-ui/core/TextField";
import ClearIcon from '@material-ui/icons/Clear';

const config = {
  withCredentials: true,
  headers: {
    "content-type": "application/json",
  },
};

/**
 * @description A page to fetch and display a single user's profile
 * @props {string} viewerID - the viewer's ID. Used to determine if you're viewing your own profile
 * @props {string} userID - the userID of the user to fetch and display
 * @props {function} changeProfile - a route handler to change the current user being displayed on
 * the profile page
 */
const Profile = ({ viewerID, userID, changeProfile }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [profileInfo, setProfileInfo] = useState({});
  const [tabIndex, setTabIndex] = useState(0);

  const [nameInput, setNameInput] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);

  const [bioInput, setBioInput] = useState("");
  const [isEditingBio, setIsEditingBio] = useState(false);

  const [profilePic, setProfilePic] = useState("");

  // is the viewer visiting his own profile, or someone else's?
  const isViewingOwn = viewerID === userID;

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.post(
          "http://localhost:5000/profile/user",
          { id: userID },
          config
        );
        console.log(data);
        setProfileInfo(data);
        setNameInput(data.name);
        setBioInput(data.bio);
        setProfilePic(data.profile_pic);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [userID]);

  const handleEdit = async (value, field) => {
    // in future, add call to post and edit user profile before updating UI state
    let payload = {
      profile_id : profileInfo.profile_id,
      id: profileInfo.id,
      bio: bioInput,
      name: nameInput
    }
    const response = await axios.post("/profile/update-user", payload, config);
    if (response.data.success) {
      enqueueSnackbar("Successfully edited profile!", { variant: "success"});
    } else {
      enqueueSnackbar("Oops something went wrong :(", { variant: "error"});
    }
    switch (field) {
      case "username":
        setIsEditingName(false);
        setProfileInfo((prev) => ({ ...prev, name: value }));
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
        <UserAvatar
          profilePic={profilePic}
          setProfilePic={setProfilePic}
          profileId={profileInfo.profile_id}
        />

        <UserInfo>
          {/* start name component */}
          <div style={{ display: "flex", alignItems: "center" }}>
            {!isEditingName && (
              <>
                <Typography variant="h4" style={{ marginBottom: "4px" }}>
                  {profileInfo.name}
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
          <Tab label="followers" />
          <Tab label="following" />
        </Tabs>
      </Paper>

      {tabIndex === 0 &&
        !!profileInfo.entries &&
        profileInfo.entries.map((entry) => <EntryCard entry={entry} />)}

      <Paper>
        {tabIndex === 1 &&
          !!profileInfo.followers &&
          profileInfo.followers.map((followRelationship) => (
            <UserCard
              viewerInfo={profileInfo}
              changeProfile={changeProfile}
              user={{
                id: followRelationship.follower,
                name: followRelationship.name,
              }}
            />
          ))}

        {tabIndex === 2 &&
          !!profileInfo.following &&
          profileInfo.following.map((followRelationship) => (
            <UserCard
              viewerInfo={profileInfo}
              changeProfile={changeProfile}
              user={{
                id: followRelationship.followee,
                name: followRelationship.name,
              }}
            />
          ))}
      </Paper>
    </Container>
  );
};

const UserAvatar = ({ profilePic, setProfilePic, profileId }) => {

  const { enqueueSnackbar } = useSnackbar();
  const input = useRef(null);

  const upload_config = {
    withCredentials: true,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  };

  const handleClick = (e) => {
    input.current.click();
  }

  const removeProfilePic = async (e) => {
    const form_data = new FormData();
    form_data.append(`image`, null);
    form_data.append('profile_id', profileId);

    const {
      data: { success, message },
    } = await axios.post(
        "http://localhost:5000/profile/profile-pic",
        form_data,
        upload_config
    );

    if (success) {
      setProfilePic(null);
      enqueueSnackbar("Profile picture removed successfully!", { variant: "success"});
    } else {
      enqueueSnackbar("Oops, something went wrong", { variant: "error"});
    }
  }

  const handleInput = async (e) => {
    if (e.target.files.length > 0) {
      const image = e.target.files[0];
      const payload = {
        profile_id: profileId,
        image
      }

      const form_data = new FormData();
      for (const field in payload) {
        if (field === 'image') {
          form_data.append(`image`, payload[field]);
        } else {
          form_data.append(field, payload[field]);
        }
      }

      const {
        data: { success, message },
      } = await axios.post(
          "http://localhost:5000/profile/profile-pic",
          form_data,
          upload_config
      );

      if (success) {
        setProfilePic(URL.createObjectURL(image));
        enqueueSnackbar("Profile picture updated successfully!", { variant: "success"});
      } else {
        enqueueSnackbar("Oops, something went wrong", { variant: "error"});
      }
    } else {
      return;
    }
  }

  return (
    <div style={{display: 'flex', alignItems: 'start'}}>
      <input type='file' style={{display: 'none'}} ref={input} onChange={handleInput}/>
      <Avatar
        onClick={handleClick}
        src={profilePic || ""}
        style={{ height: "92px", width: "92px", cursor: 'pointer' }}
      />
      <IconButton
        color="secondary"
        onClick={removeProfilePic}
      >
        <ClearIcon/>
      </IconButton>
    </div>
  )
}

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
