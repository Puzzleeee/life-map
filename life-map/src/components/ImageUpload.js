import React, { useState } from "react";
import styled from "styled-components";

const ImageUpload = () => {
  const [image, setImage] = useState([]);

  const handleSelectImage = (event) => {
    // create local URLs for each image selected
    const objectURLs = Array.from(event.target.files).map((file) =>
      URL.createObjectURL(file)
    );

    // store references to these image so we can display them in preview
    setImage(objectURLs);
  };

  return (
    <div>
      <input type="file" onChange={handleSelectImage} multiple />
      {image.map((url) => (
        <img src={url} key={url} />
      ))}
      {/* <img src={image} alt="selected" /> */}
    </div>
  );
};

export default ImageUpload;
