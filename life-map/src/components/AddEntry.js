import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

const config = {
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};

const AddEntry = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [shared, setShared] = useState(false);
  const [location, setLocation] = useState({});
  const [responseMessage, setResponseMessage] = useState("");

  /* initialize Places API */
  const {
    ready,
    value: locationInput,
    suggestions: { status, data },
    setValue: setLocationInput,
    clearSuggestions,
  } = usePlacesAutocomplete({
    // configure location-biasing for suggestions
    requestOptions: {
      // center of singapore
      location: {
        lat: () => 1.3521,
        lng: () => 103.8198,
      },
      // radius in metres
      radius: 40 * 1000,
    },
  });

  /* when a Place suggestion is clicked */
  const handleSelectPlace = (suggestion) => {
    const {
      description,
      place_id: placeId,
      structured_formatting: { main_text },
    } = suggestion;

    // get lat/lng
    getGeocode({ placeId })
      .then((results) => getLatLng(results[0]))
      .then((latLngObject) => {
        const { lat, lng } = latLngObject;

        setLocation({
          name: main_text,
          address: description,
          lat,
          lng,
        });
      })
      .catch((error) => {
        console.log(error);
      });

    // reset input field
    setLocationInput(description, false);
    // close drop-down list
    clearSuggestions();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title,
      content,
      shared,
      location,
    };

    // const {
    //   data: { success, message },
    // } = await axios.post(
    //   "http://localhost:5000/homepage/create-entry",
    //   payload,
    //   config
    // );

    // setResponseMessage(message);
  };

  /* Func comp to show suggestions in a drop-down list */
  const Suggestions = () => {
    return (
      <div style={{ border: "1px solid grey" }}>
        {data.map((suggestion) => {
          const { description, place_id } = suggestion;

          return (
            <SuggestionTag
              key={place_id}
              onClick={() => handleSelectPlace(suggestion)}
            >
              {description}
            </SuggestionTag>
          );
        })}
      </div>
    );
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Label>Title</Label>
      <TextInput
        type="text"
        placeholder=""
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Label>Content</Label>
      <TextArea value={content} onChange={(e) => setContent(e.target.value)} />
      <Label>Location</Label>
      <TextInput
        type="text"
        placeholder="type to search"
        value={locationInput}
        onChange={(e) => setLocationInput(e.target.value)}
        style={{ marginBottom: "0" }}
      />
      {/* preconditions to check before rendering autocomplete results */}
      {ready && status === "OK" && status !== "ZERO_RESULTS" && <Suggestions />}
      <CheckBoxContainer>
        <input
          type="checkbox"
          style={{
            marginRight: "18px",
            height: "18px",
            width: "18px",
            cursor: "pointer",
          }}
          onChange={() => setShared((prev) => !prev)}
          checked={shared}
        />
        <p
          style={{ cursor: "pointer" }}
          onClick={() => setShared((prev) => !prev)}
        >
          Share with friends
        </p>
      </CheckBoxContainer>
      <FormButton type="submit" style={{ marginTop: "24px" }}>
        Save
      </FormButton>
      <p style={{ height: "30px", color: "red", textAlign: "center" }}>
        {responseMessage}
      </p>
    </Form>
  );
};

export default AddEntry;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 64px;
`;

const Label = styled.label`
  font-size: 1.1em;
  letter-spacing: 1px;
  margin: 12px 0px;
`;

const TextInput = styled.input`
  margin-bottom: 18px;
  font-size: 1.1em;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid grey;
`;

const TextArea = styled.textarea`
  font-family: "Roboto";
  font-size: 1.1em;
  min-height: 40%;
  flex-shrink: 0;
  resize: none;
  margin-bottom: 18px;
`;

const FormButton = styled.button`
  font-size: 1.1em;
  padding: 8px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.1s ease;
  border: 1px solid grey;

  &:hover {
    background-color: #1152a8;
    color: white;
  }
`;

const CheckBoxContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.1em;
  letter-spacing: 1px;
`;

const SuggestionTag = styled.div`
  padding: 8px;
  cursor: pointer;

  &:hover {
    background-color: rgba(85, 85, 85, 0.1);
  }
`;
