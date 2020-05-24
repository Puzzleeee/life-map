import React, { useState } from "react";
import styled from "styled-components";

const Marker = ({ name }) => {
  const [isOpen, setOpen] = useState(false);

  return isOpen ? (
    <Card>
      <CardHeader>
        <h2 style={{ letterSpacing: "1px" }}>{name.toUpperCase()}</h2>
        <CloseButton onClick={() => setOpen(false)}>close</CloseButton>
      </CardHeader>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ut ornare
        erat. Vestibulum feugiat ultricies orci id mollis. Nunc blandit massa
        metus
      </p>
    </Card>
  ) : (
    <Tag onClick={() => setOpen(true)} />
  );
};

export default Marker;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  width: 250px;
  padding: 15px;
  align-items: center;
  font-family: 'Roboto';

  background-color: white;
  border-radius: 5px;
  box-shadow 3px 3px 15px rgb(100,100,100);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const Tag = styled.div`
  height: 18px;
  width: 18px;

  border-radius: 18px;
  border: 4px solid rgb(18, 82, 168);
  background-color: white;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    border: 4px solid rgb(17, 82, 168, 0.8);
  }
`;

const CloseButton = styled.button`
  background-color: rgb(17, 82, 168);
  padding: 4px 15px;
  border-radius: 15px;
  color: white;
  font-weight: 100;
  letter-spacing: 1px;

  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgb(17, 82, 168, 0.8);
  }
`;
