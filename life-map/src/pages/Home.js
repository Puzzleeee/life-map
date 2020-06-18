import React, { useState, useEffect } from "react";
import styled from "styled-components";
import GoogleMapReact from "google-map-react";
import Marker from "../components/Marker";
import AddEntry from "../components/AddEntry";
import axios from "axios";
import { Redirect } from "react-router-dom";

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
};

const Home = ({
  location: {
    state: { userID },
  },
}) => {
  const [entries, setEntries] = useState([]);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [mapView, setMapView] = useState(true);

  // on mounting component, check if user was already logged in and redirect
  // appropriately
  useEffect(() => {
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

      const entries = await axios.get("http://localhost:5000/homepage", config);
      setEntries(entries.data.data);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogOut = async () => {
    await axios.post("http://localhost:5000/logout", config);
    console.log("logging out");
    setLoggedIn(false);
  };

  const toggleMap = () => {
    setMapView((prev) => !prev);
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
          <SideBar>
            <p style={{ textAlign: "center" }}>Welcome {userID}</p>
            <NavButton onClick={toggleMap}>
              {mapView ? `Add an entry` : `Back to map`}
            </NavButton>
            <NavButton>View all entries</NavButton>
            <LogOutButton onClick={() => handleLogOut()}>Log Out</LogOutButton>
          </SideBar>

          {/* render map if mapView is true */}
          {mapView && (
            <MapContainer>
              <GoogleMapReact
                // populate api key
                bootstrapURLKeys={{ key: "" }}
                defaultCenter={mapDefaults.center}
                defaultZoom={mapDefaults.zoom}
                // somehow you need to do this cos of some bug in the package
                distanceToMouse={() => {}}
              >
                {entries.map(({ marker }) => (
                  <Marker
                    key={marker.name}
                    lat={marker.lat}
                    lng={marker.lng}
                    name={marker.name}
                  />
                ))}
              </GoogleMapReact>
            </MapContainer>
          )}

          {/* render form if mapView is false */}
          {!mapView && <AddEntry />}
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
`;

const MapContainer = styled.div`
  height: 94.5vh;
  width: 100%;
`;

const SideBar = styled.nav`
  height: 15%;
  width: 100%;
  display: flex;
  background-color: rgba(250, 249, 245, 0.8);
  box-shadow: 1px 0px 20px rgb(100, 100, 100);
  z-index: 1;
`;

const NavButton = styled.button`
  color: white;
  background-color: rgb(17, 82, 168);
  margin: 12px 24px;
  padding: 6px 0px;
  border-radius: 25px;
  border: 1px solid grey;

  font-size: 1.1em;
  font-family: "Roboto";
  font-weight: 200;
  letter-spacing: 1px;

  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgb(17, 82, 168, 0.9);
  }
`;

const LogOutButton = styled.button`
  color: white;
  background-color: rgba(168, 17, 50, 1);
  margin: 12px 24px;
  padding: 6px 0px;
  border-radius: 25px;
  border: none;

  font-size: 1.1em;
  font-family: "Roboto";
  font-weight: 300;
  letter-spacing: 1px;

  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(168, 17, 50, 0.9);
  }
`;
