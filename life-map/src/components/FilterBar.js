import React, { useState } from 'react';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import styled from "styled-components";
import { categories } from "../constants";
import FilterListIcon from '@material-ui/icons/FilterList';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const FilterBar = ({ selectedCategories, setSelectedCategories }) => {
  return (
    <Container>
      <FilterListIcon
        fontSize='large'
      />
      <Select
        id="demo-mutiple-checkbox"
        value={selectedCategories}
        multiple
        input={<Input />}
        renderValue={(selected) => ""}
        MenuProps={MenuProps}
        onChange={(event) => setSelectedCategories(event.target.value)}
      >
        {categories.map((category) => (
          <MenuItem key={category} value={category}>
            <Checkbox color='primary' checked={selectedCategories.indexOf(category) > -1} />
            <ListItemText primary={category} />
          </MenuItem>
        ))}
      </Select>
    </Container>
  )
}

export default FilterBar

const Container = styled.div`
  position: absolute;
  display: flex;
  z-index: 10;
`

