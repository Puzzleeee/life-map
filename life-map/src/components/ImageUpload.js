import React, { useState } from "react";
import styled from "styled-components";

const ImageUpload = ({ images, handleSelectImage }) => (
  <Container>
    <input type="file" onChange={handleSelectImage} multiple />
    <ThumbnailContainer>
      {Array.from(images).map((file) => (
        <Thumbnail src={URL.createObjectURL(file)} />
      ))}
    </ThumbnailContainer>
  </Container>
);

export default ImageUpload;

const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ThumbnailContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;

  margin-top: 12px;
  background-color: rgba(85, 85, 85, 0.1);
  border-radius: 5px;
`;

const Thumbnail = styled.img`
  width: 150px;
  height: auto;
  object-fit: contain;

  border: 1px solid rgba(45, 45, 45, 0.5);
  border-radius: 5px;
  margin: 16px;
`;
