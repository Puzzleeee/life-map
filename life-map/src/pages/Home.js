import React, { useEffect } from "react";
import styled from "styled-components";
import GoogleMapReact from "google-map-react";
import Marker from "../components/Marker";

const Home = (props) => {
  const id = props;

  useEffect(() => {
    console.log("mounting");
    console.log(id);
  });

  const mapDefaults = {
    center: {
      lat: 1.3521,
      lng: 103.8198,
    },
    zoom: 12,
  };

  const tag = {
    lat: 1.303902,
    lng: 103.907284,
  };

  return (
    <Container>
      <SideBar>
        <NavButton>Add an entry</NavButton>
        <NavButton>View all entries</NavButton>
      </SideBar>
      <MapContainer>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyDzTgpKHtP7Isg7-HdcV962p_Kjv0tH1UU" }}
          defaultCenter={mapDefaults.center}
          defaultZoom={mapDefaults.zoom}
          distanceToMouse={() => {}}
        >
          <Marker lat={1.303902} lng={103.907284}></Marker>
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
    background-color: rgb(17, 82, 168, 0.8);
  }
`;
