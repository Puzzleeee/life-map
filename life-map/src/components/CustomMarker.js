import React from 'react';
import ChildFriendlySharpIcon from '@material-ui/icons/ChildFriendlySharp';
import RestaurantSharpIcon from '@material-ui/icons/RestaurantSharp';
import SportsFootballSharpIcon from '@material-ui/icons/SportsFootballSharp';
import FavoriteSharpIcon from '@material-ui/icons/FavoriteSharp';
import RoomIcon from "@material-ui/icons/Room";
import { colors } from "../constants.js";

const CustomMarker = ({ variant, onClick }) => {
  
  return (
    <div>
      { !variant &&  
        <RoomIcon
          fontSize="large"
          style={{
            color: colors.blue,
            cursor: "pointer",
          }}
          onClick={onClick}
        />}
      { variant === 'Couples' &&
        <FavoriteSharpIcon
          color="secondary"
          fontSize='large'
          style={{
            cursor: "pointer"
          }}
          onClick={onClick}
        />}
      { variant === 'Food' && 
        <RestaurantSharpIcon
          fontSize='large'
          style={{
          cursor: "pointer"
          }}
          onClick={onClick}
        />}
      { variant === 'Sports' && 
        <SportsFootballSharpIcon
          color="primary"
          fontSize='large'
          style={{
          cursor: "pointer"
          }}
          onClick={onClick}
        />}
      { variant === 'Family' && 
        <ChildFriendlySharpIcon
          fontSize='large'
          style={{
          cursor: "pointer"
          }}
          onClick={onClick}
        />}
    </div>
  )
}

export default CustomMarker;
