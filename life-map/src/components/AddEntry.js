import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

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
  const [location, setLocation] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title,
      content,
      shared,
    };

    console.log("submitting", payload);

    const {
      data: { success, message },
    } = await axios.post(
      "https://localhost:5000/homepage/create-entry",
      payload,
      config
    );

    console.log("response received", success);
    console.log("reponse msg", message);

    setResponseMessage(message);
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
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
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
