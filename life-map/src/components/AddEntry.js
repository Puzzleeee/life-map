import React, { useState } from "react";
import styled from "styled-components";

const AddEntry = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitting");
  };

  return (
    <Form onSubmit={(e) => handleSubmit(e)}>
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
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <FormButton type="submit" style={{ marginTop: "24px" }}>
        Save
      </FormButton>
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
  margin-bottom: 12px;
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
  height: 50%;
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
