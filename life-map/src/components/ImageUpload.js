import React, { useState, useRef } from "react";
import { makeStyles } from '@material-ui/core/styles';
import styled from "styled-components";

import CloudUploadTwoToneIcon from '@material-ui/icons/CloudUploadTwoTone';

const ImageUpload = ({ images, handleSelectImage }) => {

  const UploadButton = () => {
    const input = useRef(null);
    
    const handleClick = (e) => {
      input.current.click();
    }
  
    return (
      <>
        <input type='file' style={{display: 'none'}} ref={input} onChange={handleSelectImage} multiple/>
        <UploadBox onClick={handleClick}> 
          <CloudUploadTwoToneIcon fontSize='large'/>
          Upload photos 
        </UploadBox>
      </>
    );
  }

  return (
    <Container>
      <UploadButton/>
      <ThumbnailContainer>
        {Array.from(images).map((file) => (
          <Thumbnail key={file.name} src={URL.createObjectURL(file)} />
        ))}
      </ThumbnailContainer>
    </Container>
  );
};



export default ImageUpload;

const UploadBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`

const Container = styled.div`
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
  border-radius: 5px;
`;

const Thumbnail = styled.img`
  width: 150px;
  min-height: 200px;
  height: auto;
  object-fit: contain;
  border: 1px solid rgba(45, 45, 45, 0.5);
  border-radius: 5px;
  margin: 16px;
`;
