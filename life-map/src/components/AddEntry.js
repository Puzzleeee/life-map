import React, { useState, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { useSnackbar } from "notistack";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import ImageUpload from "./ImageUpload";
import { makeStyles } from "@material-ui/core/styles";
import createEntryBackground from "../static/create-entry-background.png";
import { colors } from "../constants";
import CornerLoading from "./Loading/CornerLoading";

//--------start import Material-ui components---------//
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
//--------end import Material-ui components---------//

//--------start import icons--------//
import TitleTwoToneIcon from "@material-ui/icons/TitleTwoTone";
import MenuBookTwoToneIcon from "@material-ui/icons/MenuBookTwoTone";
import LocationOnTwoToneIcon from "@material-ui/icons/LocationOnTwoTone";
import ShareTwoToneIcon from "@material-ui/icons/ShareTwoTone";
import RoomIcon from "@material-ui/icons/Room";
//--------end import icons--------//

const config = {
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};

const toolbarConfig = {
  display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS'],
  INLINE_STYLE_BUTTONS: [
    {label: 'Bold', style: 'BOLD'},
    {label: 'Italic', style: 'ITALIC'},
    {label: 'Underline', style: 'UNDERLINE'}
  ],
  BLOCK_TYPE_BUTTONS: [
    {label: 'UL', style: 'unordered-list-item'},
    {label: 'OL', style: 'ordered-list-item'}
  ]
}

const useStyles = makeStyles({
  entryCard: {
    backgroundColor: "rgba(247, 247, 247, 0.9)",
    flexGrow: "1",
    minWidth: "300px",
    width: "60%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: "5%",
    marginBottom: "5%",
  },
  textInput: {
    flexGrow: "1",
  },
  icons: {
    marginRight: "0.75em",
  },
});

const AddEntry = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [shared, setShared] = useState(false);
  const [location, setLocation] = useState({});
  const [markerVariant, setMarkerVariant] = useState(null);
  const [images, setImages] = useState([]);
  const [isUploading, setUploading] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const classes = useStyles();

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
      radius: 20 * 1000,
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

  const handleSelectImage = (event) => {
    // create local URLs for each image selected
    // const objectURLs = Array.from(event.target.files).map((file) =>
    //   URL.createObjectURL(file)
    // );

    // // store references to these image so we can display them in preview
    // setImages(objectURLs);

    setImages(event.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    const payload = {
      title,
      content,
      shared,
      location: { ...location, variant: markerVariant },
      images: Array.from(images),
    };

    const form_data = new FormData();

    for (const field in payload) {
      if (field === "images") {
        payload[field].forEach((file, idx) => {
          form_data.append(`image${idx}`, file);
        });
      } else if (field === "location") {
        form_data.append(field, JSON.stringify(payload[field]));
      } else {
        form_data.append(field, payload[field]);
      }
    }

    const upload_config = {
      withCredentials: true,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    };

    const {
      data: { success, message },
    } = await axios
      .post("/api/homepage/create-entry", form_data, upload_config)
      .catch((err) => {
        return {
          data: err.response.data,
        };
      });

    setUploading(false);
    if (success) {
      enqueueSnackbar("Entry created successfully!", { variant: "success" });
    } else {
      enqueueSnackbar(`Oops, something went wrong: ${message}`, {
        variant: "error",
      });
    }
  };

  /* declare dom ref to close when user clicks outside the dropdown list */
  const dropDownRef = useRef();
  useOnclickOutside(dropDownRef, clearSuggestions);

  /* Func comp to show suggestions in a drop-down list */
  const Suggestions = () => {
    return (
      <div ref={dropDownRef} style={{ border: "1px solid grey" }}>
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
    <Entry>
      {isUploading && <CornerLoading/>}
      <Card className={classes.entryCard}>
        <Form onSubmit={handleSubmit}>
          <FormInput>
            <TitleTwoToneIcon className={classes.icons} color="primary" />
            <TextField
              className={classes.textInput}
              label="Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormInput>

          <FormInput>
            <MenuBookTwoToneIcon className={classes.icons} color="secondary" />
            <TextField
              className={classes.textInput}
              label="Content"
              variant="outlined"
              value={content}
              multiline
              rows={10}
              onChange={(e) => setContent(e.target.value)}
            />
          </FormInput>

          <FormInput>
            <LocationOnTwoToneIcon className={classes.icons} />
            <LocationContainer>
              <TextField
                className={classes.textInput}
                label="Location"
                variant="outlined"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
              />
              {/* preconditions to check before rendering autocomplete results */}
              {ready && status === "OK" && status !== "ZERO_RESULTS" && (
                <Suggestions />
              )}
            </LocationContainer>
          </FormInput>

          <div style={{ margin: "1em 0" }}>
            <FormLabel component="label">Category</FormLabel>
            <RadioGroup
              row
              value={markerVariant}
              onChange={(e) => setMarkerVariant(e.target.value)}
            >
              <FormControlLabel value="Food" control={<Radio />} label="Food" />
              <FormControlLabel
                value="Couples"
                control={<Radio />}
                label="Couples"
              />
              <FormControlLabel
                value="Family"
                control={<Radio />}
                label="Family"
              />
              <FormControlLabel
                value="Sports"
                control={<Radio />}
                label="Sports"
              />
            </RadioGroup>
          </div>

          <FormInput>
            <ShareTwoToneIcon className={classes.icons} color="primary" />
            <CheckBoxContainer>
              <Checkbox
                checked={shared}
                onChange={() => setShared((prev) => !prev)}
                color="primary"
                inputProps={{ "aria-label": "secondary checkbox" }}
                style={{ paddingLeft: "0" }}
              />

              <p
                style={{ cursor: "pointer" }}
                onClick={() => setShared((prev) => !prev)}
              >
                Share with friends
              </p>
            </CheckBoxContainer>
          </FormInput>

          <ImageUpload images={images} handleSelectImage={handleSelectImage} />

          <Button
            variant="contained"
            color="primary"
            type="submit"
            style={{ marginTop: "24px", marginBottom: "24px" }}
          >
            Save
          </Button>
        </Form>
      </Card>
    </Entry>
  );
};

export default AddEntry;

const Entry = styled.div`
  flex-grow: 2;
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  background-image: url(${createEntryBackground});
  background-repeat: repeat-y;
  background-size: cover;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 80%;
`;

const FormInput = styled.div`
  margin-top: 1em;
  margin-bottom: 1em;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CheckBoxContainer = styled.div`
  flex-grow: 1;
  display: flex;
`;

const LocationContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;
const SuggestionTag = styled.div`
  padding: 8px;
  cursor: pointer;

  &:hover {
    background-color: rgba(85, 85, 85, 0.1);
  }
`;
