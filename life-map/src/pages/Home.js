import React, { useState, useEffect } from "react";
import styled from "styled-components";
import GoogleMapReact from "google-map-react";
import Marker from "../components/Marker";
import axios from "axios";

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
  const [markers, setMarkers] = useState([]);

  useEffect(async () => {
    /* start of dummy logic */
    // const fakeMarkers = [
    //   {
    //     lat: 1.3521,
    //     lng: 103.8198,
    //     name: "home",
    //   },
    //   {
    //     lat: 1.42,
    //     lng: 103.87,
    //     name: "home 2",
    //   },
    // ];
    // setMarkers(fakeMarkers);
    /* end of dummy logic */

    /* Uncomment this for actual api call logic */
    const markers = await axios.get("http://localhost:5000/homepage", config);
    console.log(markers.data);
    setMarkers(markers.data.data);
  }, []);

  return (
    <Container>
      <SideBar>
        <p style={{ textAlign: "center" }}>Welcome {userID}</p>
        <NavButton>Add an entry</NavButton>
        <NavButton>View all entries</NavButton>
        <LogOutButton>Log Out</LogOutButton>
      </SideBar>
      <MapContainer>
        <GoogleMapReact
          // populate api key
          bootstrapURLKeys={{ key: "" }}
          defaultCenter={mapDefaults.center}
          defaultZoom={mapDefaults.zoom}
          // somehow you need to do this cos of some bug in the package
          distanceToMouse={() => {}}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.name}
              lat={marker.lat}
              lng={marker.lng}
              name={marker.name}
            />
          ))}
        </GoogleMapReact>
      </MapContainer>
    </Container>
  );
};

export default Home;

const Container = styled.section`
  width: 100%;
  height: 100vh;
  display: flex;
`;

const MapContainer = styled.div`
  height: 100%;
  width: 100%;
`;

const SideBar = styled.nav`
  width: 20%;
  display: flex;
  flex-direction: column;
  padding: 24px;
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
