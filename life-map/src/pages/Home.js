import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { Redirect } from "react-router-dom";
import GoogleMapReact from "google-map-react";
import AddEntry from "../components/AddEntry";
import UserBar from "../components/UserBar";
import Entries from "./Entries";
import Profile from "./Profile";
import NavBar from "../components/NavBar";
//--------start import Material-ui components---------//
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Drawer from "@material-ui/core/Drawer";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import RoomIcon from "@material-ui/icons/Room";
//--------end import Material-ui components---------//
import { colors, mapDefaults } from "../constants";

const config = {
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};

//============= THEMES ===============//
// initialize constants for map

const Home = ({
  location: {
    state: { userID },
  },
}) => {
  //============= STATES ===============//
  const [entries, setEntries] = useState([]);
  const [followRequests, setFollowRequests] = useState([]);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isLoading, setLoading] = useState(true);
  //-------- start of view states -------- //
  const [page, setPage] = useState("Map");
  const [drawerState, setDrawerState] = useState({
    entry: {},
    isOpen: false,
  });
  const [profileUserID, setProfileUserID] = useState("");
  //-------- end of view states -------- //

  //============= LIFECYCLE ===============//
  // on mounting component, check if user was already logged in and redirect
  // appropriately
  useEffect(
    () => {
      let mounted = true;
      (async () => {
        const auth_response = await axios.get(
          "http://localhost:5000/check-auth",
          config
        );

        if (mounted) {
          setLoggedIn(auth_response.data.authenticated);
          setLoading(false);
        }

        const entries = await axios.get(
          "http://localhost:5000/homepage",
          config
        );
        setEntries(entries.data.data);

        const { data: socialInfo } = await axios.get(
          "http://localhost:5000/social/social-info",
          config
        );
        setFollowRequests(socialInfo.followRequests);
      })();

      return () => {
        mounted = false;
      };
    },
    [
      /* COMMENT THIS OUT TO PREVENT REMOUNTING ON PAGE CHANGE */
      // page
    ]
  );

  //============= ROUTE HANDLERS ===============//
  const handleLogOut = async () => {
    await axios.post("http://localhost:5000/logout", config);
    setLoggedIn(false);
  };

  const handlePageChange = (page) => {
    if (page === "Profile") {
      setProfileUserID(userID);
    }

    setPage(page);
  };

  // when a search result is clicked
  const handleSearchRedirect = (userID) => {
    setProfileUserID(userID);
    setPage("Profile");
  };

  /**
   * @description Updates in-state list of follow requests based on update type.
   * @param {string} id the follow request's id
   * @param {string} type the type of update to perform. Currently only supports 'hide'.
   *
   * @returns {void}
   */
  const handleFollowUIUpdate = (id, type) => {
    if (type === "hide") {
      setFollowRequests((prev) => prev.filter((request) => request.id !== id));
    }
  };

  return (
    <div>
      {isLoading && <p>Loading</p>}
      {/* if logged out, redirect to landing page  */}
      {!isLoading && !isLoggedIn && (
        <Redirect
          push
          to={{
            pathname: "/",
          }}
        />
      )}

      {/* else, load the logged in homepage */}
      {!isLoading && isLoggedIn && (
        <Container>
          <NavBar
            page={page}
            followRequests={followRequests}
            handlePageChange={handlePageChange}
            handleSearchRedirect={handleSearchRedirect}
            handleFollowUIUpdate={handleFollowUIUpdate}
            handleLogOut={handleLogOut}
          />

          {/* render map */}
          {page === "Map" && (
            <MapContainer>
              <GoogleMapReact
                defaultCenter={mapDefaults.center}
                defaultZoom={mapDefaults.zoom}
                options={() => ({ styles: mapDefaults.styles })}
                // somehow you need to do this cos of some bug in the package
                distanceToMouse={() => {}}
              >
                {entries.map((entry) => (
                  <RoomIcon
                    fontSize="large"
                    style={{
                      color: colors?.[entry.marker?.variant] ?? colors.blue,
                      cursor: "pointer",
                    }}
                    key={entry.marker.name}
                    lat={entry.marker.lat}
                    lng={entry.marker.lng}
                    name={entry.marker.name}
                    onClick={(e) => {
                      e.preventDefault();
                      setDrawerState({
                        entry,
                        isOpen: true,
                      });
                    }}
                  />
                ))}
              </GoogleMapReact>
              <Drawer
                open={drawerState.isOpen}
                anchor="bottom"
                onClose={() =>
                  setDrawerState({
                    title: "",
                    entries: "",
                    isOpen: false,
                  })
                }
              >
                {drawerState.isOpen && (
                  <Card
                    style={{
                      overflowY: "auto",
                    }}
                  >
                    <CardContent
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <DrawerHeader>
                        <UserBar
                          userID={drawerState.entry.user_id}
                          navigateToProfile={(id) => {
                            setPage("Profile");
                            setProfileUserID(id);
                          }}
                        />
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            flexGrow: 1,
                          }}
                        >
                          <IconButton
                            onClick={() =>
                              setDrawerState({
                                entry: {},
                                isOpen: false,
                              })
                            }
                          >
                            <CloseIcon fontSize="large" />
                          </IconButton>
                        </div>
                      </DrawerHeader>
                      <DrawerTitle>
                        <Typography variant="h4" color="primary">
                          {drawerState.entry.title}
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                          {`Posted: ${new Date(
                            drawerState.entry.date_time
                          ).toDateString()}`}
                        </Typography>
                        <Location>
                          <RoomIcon fontSize="small" color="primary" />
                          <Typography>
                            {drawerState.entry.marker &&
                              drawerState.entry.marker.name}
                          </Typography>
                        </Location>
                      </DrawerTitle>
                      <Typography
                        variant="body1"
                        color="textPrimary"
                        component="p"
                      >
                        {drawerState.entry.content}
                      </Typography>
                    </CardContent>
                    <CardContent>
                      <Typography variant="body1">
                        {drawerState.content}
                      </Typography>
                    </CardContent>
                    <ImageContainer>
                      {drawerState.entry.photos.map((photo) => (
                        <CardMedia>
                          <Image src={photo.data} alt="card photo" />
                        </CardMedia>
                      ))}
                    </ImageContainer>
                  </Card>
                )}
              </Drawer>
            </MapContainer>
          )}

          {/* render form to add entry */}
          {page === "Add entry" && <AddEntry />}

          {/* render list of entries*/}
          {page === "View all entries" && (
            <Entries entries={entries} setEntries={setEntries} />
          )}

          {/* render user profile page */}
          {page === "Profile" && (
            <Profile
              viewerID={userID}
              userID={profileUserID}
              changeProfile={setProfileUserID}
            />
          )}
        </Container>
      )}
    </div>
  );
};

export default Home;

const Container = styled.section`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f2f9ff;
`;

const MapContainer = styled.div`
  height: 94.5vh;
  width: 100%;
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  margin-top: 4px;
`;

const DrawerHeader = styled.div`
  display: flex;
  width: 100%;
`;

const DrawerTitle = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1.25rem 0px;
`;

const ImageContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

const Image = styled.img`
  height: 250px;
  width: auto;
  margin: 12px;
  border-radius: 5px;
  box-shadow: 3px 3px 10px rgba(150, 150, 150, 0.5);
`;
