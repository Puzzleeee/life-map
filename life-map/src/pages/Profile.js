import React, { useState, useEffect, useRef, useReducer } from "react";
import styled from "styled-components";
import axios from "axios";
import { useSnackbar } from "notistack";
import EntryCard from "../components/EntryCard";
import UserCard from "../components/UserCard";
import LoadingIndicator from "../components/LoadingIndicator";
import PrivateAccount from "../components/PrivateAccount"
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
import Button from "@material-ui/core/Button";
import useSocialButton from "../hooks/useSocialButton.js";

const config = {
  withCredentials: true,
  headers: {
    "content-type": "application/json",
  },
};

const initialUserState = {
  profileInfo: {
    followers: [],
    following: []
  },
  viewerInfo: {
    followers: [],
    following: [],
    sentRequests: [],
  },
}

const userStateReducer = (state, action) => {
  switch (action.type) {
    case 'initialize':
      return action.payload;
    case 'setViewer':
      return {
        ...state,
        viewerInfo: action.payload.viewerInfo
      };
    default:
      return state;
  }
}

const initialInputState = {
  nameInput: "",
  isEditingName: false,
  bioInput: "",
  isEditingBio: false,
  profilePic: "",
  entries: []
}

const inputStateReducer = (state, action) => {
  switch (action.type) {
    case 'initialize':
      return {
        ...state,
        nameInput: action.payload.nameInput,
        bioInput: action.payload.bioInput,
        profilePic: action.payload.profilePic,
        entries: action.payload.entries
      };
    case 'toggleEditName':
      return {
        ...state,
        isEditingName: !state.isEditingName
      }
    case 'setNameInput':
      return {
        ...state,
        nameInput: action.payload.nameInput
      }
    case 'toggleEditBio':
      return {
        ...state,
        isEditingBio: !state.isEditingBio
      }
    case 'setBioInput':
      return {
        ...state,
        bioInput: action.payload.bioInput
      }
    case 'setProfilePic':
      return {
        ...state,
        profilePic: action.payload.profilePic
      }
    case 'removeEntry':
      return {
        ...state,
        entries: state.entries.filter(x => x.id !== action.payload.entry.id)
      }
    default:
      return state;
  }
}
/**
 * @description A page to fetch and display a single user's profile
 * @props {string} viewerID - the viewer's ID. Used to determine if you're viewing your own profile
 * @props {string} userID - the userID of the user to fetch and display
 * @props {function} changeProfile - a route handler to change the current user being displayed on
 * the profile page
 */
const Profile = ({ viewerID, userID, changeProfile }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [tabIndex, setTabIndex] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [userState, dispatchUser] = useReducer(userStateReducer, initialUserState);
  const [inputState, dispatchInput] = useReducer(inputStateReducer, initialInputState);

  const setViewerInfo = (viewerInfo) => {
    dispatchUser({ type: 'setViewer', payload: {viewerInfo} });
  }

  const removeEntry = (entry) => {
    return () => {
      dispatchInput({ type: 'removeEntry', payload: {entry}})
    }
  }

  const [isFollowing, requestSent, handleClick] = useSocialButton(userState.viewerInfo, (viewerInfo) => setViewerInfo(viewerInfo), {id: userID});

  // is the viewer visiting his own profile, or someone else's?
  const isViewingOwn = viewerID === userID;

  useEffect(() => {
    console.log("Profile use effect called");
    (async () => {
      try {
        const [profileData, viewerData] = await Promise.all([
          axios.post("/api/profile/user", { id: userID }, config),
          axios.get("/api/social/social-info", config)
        ]);
        const profileInfo =  (({entries, ...o}) => o)(profileData.data);
        const viewerInfo = {...viewerData.data, id: viewerID};
        const inputState = {
          nameInput: profileData.data.name,
          bioInput: profileData.data.bio,
          profilePic: profileData.data.profile_pic,
          entries: profileData.data.entries
        }
        dispatchUser({type: 'initialize', payload: { profileInfo, viewerInfo }});
        dispatchInput({type: 'initialize', payload: { ...inputState }});
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [userID, viewerID]);

  const handleEdit = async (value, field) => {
    let payload = {
      profile_id : userState.profileInfo.profile_id,
      id: userState.profileInfo.id,
      bio: inputState.bioInput,
      name: inputState.nameInput
    }
    const response = await axios.post("/api/profile/update-user", payload, config);
    if (response.data.success) {
      enqueueSnackbar("Successfully edited profile!", { variant: "success"});
    } else {
      enqueueSnackbar("Oops something went wrong :(", { variant: "error"});
    }
    switch (field) {
      case "username":
        dispatchInput({type: 'toggleEditName', payload: {}});
        return;
      case "bio":
        dispatchInput({type: 'toggleEditBio', payload: {}});
        return;
      default:
        return;
    }
  };

  return (
    <Container>
      {isLoading && <LoadingIndicator/>}
      {!isLoading &&
        <>
          <Header>
            <UserAvatar
              profilePic={inputState.profilePic}
              setProfilePic={(pic) => dispatchInput({type: 'setProfilePic', payload: {profilePic: pic}})}
              profileId={userState.profileInfo.profile_id}
              isViewingOwn={isViewingOwn}
            />
            <UserInfo>
              {/* start name component */}
              <div style={{ display: "flex", alignItems: "center" }}>
                {!inputState.isEditingName && (
                  <>
                    <Typography variant="h5" style={{ marginBottom: "4px" }}>
                      {inputState.nameInput}
                    </Typography>

                    {/* only display edit button if at your own profile */}
                    {!!isViewingOwn && (
                      <IconButton
                        color="primary"
                        onClick={() => dispatchInput({type: 'toggleEditName', payload: {}})}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                  </>
                )}

                {!!inputState.isEditingName && (
                  <>
                    <TextField
                      value={inputState.nameInput}
                      onChange={(event) => dispatchInput({type: 'setNameInput', payload: { nameInput: event.target.value }})}
                    />
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(inputState.nameInput, "username")}
                    >
                      <CheckIcon />
                    </IconButton>
                  </>
                )}
              </div>
              {/* end name component */}

              {/* start bio component */}
              <div style={{ display: "flex", alignItems: "center" }}>
                {!inputState.isEditingBio && (
                  <>
                    <Typography variant="subtitle1">
                      {inputState.bioInput}
                    </Typography>

                    {/* only display edit button if at your own profile */}
                    {!!isViewingOwn && (
                      <IconButton
                        color="primary"
                        onClick={() => dispatchInput({type: 'toggleEditBio', payload: {}})}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                  </>
                )}

                {!!inputState.isEditingBio && (
                  <>
                    <TextField
                      value={inputState.bioInput}
                      onChange={(event) => dispatchInput({type: 'setBioInput', payload: { bioInput: event.target.value }})}
                      multiline
                    />
                    
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(inputState.bioInput, "bio")}
                    >
                      <CheckIcon />
                    </IconButton>
                  </>
                )}
              </div>
              {/* end bio component */}
            </UserInfo>

            {!isViewingOwn && 
              <Button
                style = {{width: '20%'}}
                size="small"
                variant="contained"
                color="primary"
                onClick= {handleClick}
              >
                {requestSent ? "Requested"
                  : isFollowing ? "Following"
                    : "Follow"}

              </Button>
            }
          </Header>

          <Paper
            square>
            <Tabs
              value={tabIndex}
              onChange={(event, newValue) => {
                setTabIndex(newValue);
              }}
              variant="fullWidth"
            >
              <Tab label={`${inputState.entries.length} entries`} />
              <Tab label={`${userState.profileInfo.followers.length} followers`} />
              <Tab label={`${userState.profileInfo.following.length} following`} />
            </Tabs>
          </Paper>

          {!(isFollowing || isViewingOwn)
            && <PrivateAccount/>}
            
          {tabIndex === 0 &&
            (isFollowing || isViewingOwn) &&
            !!inputState.entries &&
            inputState.entries.map((entry) => 
              <EntryCard 
                entry={entry}
                removeEntry={removeEntry(entry)}
                isOwnEntry={isViewingOwn} 
              />)}
        
          <Paper>
            {tabIndex === 1 &&
              (isFollowing || isViewingOwn) &&
              !!userState.profileInfo.followers &&
              userState.profileInfo.followers.map((followRelationship) => (
                <UserCard
                  viewerInfo={userState.viewerInfo}
                  setViewerInfo={(viewerInfo) => setViewerInfo(viewerInfo)}
                  changeProfile={changeProfile}
                  user={{
                    id: followRelationship.follower,
                    name: followRelationship.name,
                    profile_pic: followRelationship.profile_pic
                  }}
                  isViewingOwn = {isViewingOwn}
                  type='follower'
                />
              ))}

            {tabIndex === 2 &&
              (isFollowing || isViewingOwn) &&
              !!userState.profileInfo.following &&
              userState.profileInfo.following.map((followRelationship) => (
                <UserCard
                  viewerInfo={userState.viewerInfo}
                  setViewerInfo={(viewerInfo) => setViewerInfo(viewerInfo)}
                  changeProfile={changeProfile}
                  user={{
                    id: followRelationship.followee,
                    name: followRelationship.name,
                    profile_pic: followRelationship.profile_pic
                  }}
                  isViewingOwn = {isViewingOwn}
                  type='following'
                />
              ))}
          </Paper>
      </>}
    </Container>
  );
};

const UserAvatar = ({ profilePic, setProfilePic, profileId, isViewingOwn }) => {

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
      data: { success },
    } = await axios.post(
        "/api/profile/profile-pic",
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
        data: { success },
      } = await axios.post(
          "/api/profile/profile-pic",
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
        onClick={isViewingOwn ? handleClick : null}
        src={profilePic || ""}
        style={{ height: "92px", width: "92px", cursor: 'pointer' }}
      />
      {isViewingOwn &&
        <IconButton
          color="secondary"
          onClick={removeProfilePic}
        >
          <ClearIcon/>
        </IconButton>
      }

    </div>
  )
}

export default Profile;

const Container = styled.section`
  width: 100%;
  height: 94.5vh;
  max-width: 850px;
  margin: 0 auto;
  padding: 0.5vh 0px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 24px;
  padding: 0.5vh 0.5vw;
  box-sizing: border-box;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0px 24px;
`;
