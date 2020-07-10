import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { Redirect } from "react-router-dom";
import GoogleMapReact from "google-map-react";
import AddEntry from "../components/AddEntry";
import Entries from "./Entries";
import Profile from "./Profile";
import FollowRequestCard from "../components/FollowRequestCard";
//--------start import Material-ui components---------//
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Drawer from "@material-ui/core/Drawer";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import NotificationsIcon from "@material-ui/icons/Notifications";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import RoomIcon from "@material-ui/icons/Room";
import CloseIcon from "@material-ui/icons/Close";
//--------end import Material-ui components---------//

const config = {
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};

// initialize constants for map
const mapDefaults = {
  center: {
    lat: 1.3521,
    lng: 103.8198,
  },
  zoom: 12,
  styles: [
    {
      featureType: "administrative",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#444444",
        },
      ],
    },
    {
      featureType: "administrative.country",
      elementType: "all",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "administrative.province",
      elementType: "all",
      stylers: [
        {
          visibility: "off",
        },
        {
          saturation: "0",
        },
        {
          lightness: "0",
        },
      ],
    },
    {
      featureType: "administrative.locality",
      elementType: "all",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "administrative.neighborhood",
      elementType: "all",
      stylers: [
        {
          visibility: "simplified",
        },
      ],
    },
    {
      featureType: "landscape",
      elementType: "all",
      stylers: [
        {
          visibility: "off",
        },
        {
          color: "#ffffff",
        },
      ],
    },
    {
      featureType: "landscape",
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "landscape.man_made",
      elementType: "all",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "landscape.natural",
      elementType: "geometry.fill",
      stylers: [
        {
          saturation: "17",
        },
        {
          visibility: "on",
        },
      ],
    },
    {
      featureType: "landscape.natural",
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "all",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "all",
      stylers: [
        {
          visibility: "on",
        },
        {
          hue: "#91ff00",
        },
        {
          lightness: "56",
        },
        {
          saturation: "26",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "all",
      stylers: [
        {
          saturation: -100,
        },
        {
          lightness: 45,
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "all",
      stylers: [
        {
          visibility: "simplified",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [
        {
          color: "#f5d2c4",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "labels",
      stylers: [
        {
          visibility: "on",
        },
      ],
    },
    {
      featureType: "road.arterial",
      elementType: "all",
      stylers: [
        {
          visibility: "on",
        },
      ],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry.fill",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry.stroke",
      stylers: [
        {
          visibility: "on",
        },
        {
          color: "#f5d2c4",
        },
        {
          lightness: "60",
        },
      ],
    },
    {
      featureType: "road.arterial",
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road.local",
      elementType: "all",
      stylers: [
        {
          visibility: "on",
        },
      ],
    },
    {
      featureType: "road.local",
      elementType: "geometry",
      stylers: [
        {
          color: "#f3f3f3",
        },
        {
          visibility: "simplified",
        },
      ],
    },
    {
      featureType: "road.local",
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "transit",
      elementType: "all",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "all",
      stylers: [
        {
          color: "#e9f6f8",
        },
        {
          visibility: "on",
        },
      ],
    },
  ],
};

const Home = ({
  location: {
    state: { userID },
  },
}) => {
  const [entries, setEntries] = useState([]);
  const [followRequests, setFollowRequests] = useState([]);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isLoading, setLoading] = useState(true);
  //-------- start of view states -------- //
  const [page, setPage] = useState("Map");
  const [drawerState, setDrawerState] = useState({
    title: "",
    content: "",
    isOpen: false,
  });
  const [profileUserID, setProfileUserID] = useState("");
  //-------- end of view states -------- //

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
        console.log(entries.data.data);
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

  const handleLogOut = async () => {
    await axios.post("http://localhost:5000/logout", config);
    setLoggedIn(false);
  };

  //-------- start of nav menu setters --------//
  const [menuAnchor, setMenuAnchor] = React.useState(null);
  const isMenuOpen = Boolean(menuAnchor);

  const handleOpenMenu = (event) => {
    setMenuAnchor(event.target);
  };

  const handlePageChange = (page) => {
    if (page === "Profile") {
      setProfileUserID(userID);
    }

    setPage(page);
    setMenuAnchor(null);
  };

  //-------- end of nav menu setters --------//

  //-------- start of follow menu handlers --------//
  const [followMenuAnchor, setFollowMenuAnchor] = React.useState(null);
  const isFollowMenuOpen = Boolean(followMenuAnchor);

  const handleOpenFollow = (event) => {
    setFollowMenuAnchor(event.target);
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
  //-------- end of follow menu handlers --------//

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
          {/* start of navbar */}
          <AppBar position="static" style={{ padding: 0}}>
            <Toolbar
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <IconButton color="inherit" onClick={handleOpenMenu}>
                <MenuIcon />
              </IconButton>

              {/* nav bar menu modal */}
              <Menu
                anchorEl={menuAnchor}
                keepMounted
                open={isMenuOpen}
                onClose={() => setMenuAnchor(null)}
              >
                <MenuItem onClick={() => handlePageChange("Map")}>Map</MenuItem>
                <MenuItem onClick={() => handlePageChange("Add entry")}>
                  Add entry
                </MenuItem>
                <MenuItem onClick={() => handlePageChange("View all entries")}>
                  View all entries
                </MenuItem>
              </Menu>
              {/* end nav bar menu modal */}

              {/* follow requests modal */}
              <Menu
                anchorEl={followMenuAnchor}
                keepMounted
                open={isFollowMenuOpen}
                onClose={() => setFollowMenuAnchor(null)}
              >
                {!!followRequests.length &&
                  followRequests.map((req) => (
                    <FollowRequestCard
                      key={req.id}
                      request={req}
                      UIhandler={handleFollowUIUpdate}
                    />
                  ))}

                {!followRequests.length && (
                  <MenuItem style={{ width: "350px" }}>
                    No follow requests
                  </MenuItem>
                )}
              </Menu>
              {/* end follow requests modal */}

              <Typography variant="h6">{page}</Typography>

              <div style={{ display: "flex" }}>
                <IconButton
                  color="inherit"
                  onClick={() => handlePageChange("Profile")}
                >
                  <AccountCircleIcon />
                </IconButton>

                <IconButton color="inherit" onClick={handleOpenFollow}>
                  <NotificationsIcon />
                </IconButton>

                <Button color="inherit" onClick={handleLogOut}>
                  Logout
                </Button>
              </div>
            </Toolbar>
          </AppBar>
          {/* end of navbar */}

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
                {entries.map(({ title, content, marker }) => (
                  <RoomIcon
                    fontSize="large"
                    color="primary"
                    style={{ cursor: "pointer" }}
                    key={marker.name}
                    lat={marker.lat}
                    lng={marker.lng}
                    name={marker.name}
                    onClick={(e) => {
                      e.preventDefault();
                      setDrawerState({
                        title,
                        content,
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
                <Card>
                  <CardContent
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h4" color="primary">
                      {drawerState.title}
                    </Typography>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Button variant="outlined" color="secondary">
                        view post
                      </Button>
                      <IconButton
                        onClick={() =>
                          setDrawerState({
                            title: "",
                            entries: "",
                            isOpen: false,
                          })
                        }
                      >
                        <CloseIcon fontSize="large" />
                      </IconButton>
                    </div>
                  </CardContent>
                  <CardContent>
                    <Typography variant="body1">
                      {drawerState.content}
                    </Typography>
                  </CardContent>
                </Card>
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
  background-color: #F2F9FF;
`;

const MapContainer = styled.div`
  height: 94.5vh;
  width: 100%;
`;
