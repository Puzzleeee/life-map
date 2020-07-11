import { green, purple } from "@material-ui/core/colors";

export const colors = {
  blue: "#3f51b5",
  red: "#f50057",
  green: green[500],
  purple: purple[500],
};

export const mapDefaults = {
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
