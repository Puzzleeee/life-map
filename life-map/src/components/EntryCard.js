import React, { useState } from "react";
import styled from "styled-components";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core";
import { useSnackbar } from "notistack";
import { useTheme } from "@material-ui/core/styles";
import axios from "axios";
import ReactMarkdown from "react-markdown";

//--------start import Material-ui components---------//
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";
// import Collapse from "@material-ui/core/Collapse";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
//--------end import Material-ui components---------//

//--------start import icons--------//
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import RoomIcon from "@material-ui/icons/Room";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
//--------end import icons--------//

const config = {
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};

const useStyles = makeStyles((theme) => ({
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
}));

/**
 * This component is a single card that displays a diary entry.
 * This display title, date, content, and photos.
 * This receives a single Entry object as props.
 */
const EntryCard = ({ entry, removeEntry, isOwnEntry }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  //------- start of menu handlers -------//
  const [menuAnchor, setMenuAnchor] = React.useState(null);
  const isMenuOpen = Boolean(menuAnchor);

  const handleOpenMenu = (event) => {
    setMenuAnchor(event.target);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const deleteEntry = async () => {
    const payload = {
      id: entry.id,
      marker_id: entry.marker.id,
    };

    handleCloseMenu();

    const {
      data: { success },
    } = await axios.post("/api/homepage/delete-entry", payload, config);

    if (success) {
      removeEntry();
      enqueueSnackbar("Successfully deleted entry!", { variant: "success" });
    } else {
      enqueueSnackbar("Oops, something went wrong", { variant: "error" });
    }
  };
  //------- end of menu handlers -------//

  return (
    <StyledCard elevation={3}>
      <CardHeader
        title={entry.title}
        subheader={
          <div style={{ marginTop: "4px" }}>
            <Typography variant="body1" color="textSecondary">
              {`Posted: ${new Date(entry.date_time).toDateString()}`}
            </Typography>
            <Location>
              <RoomIcon fontSize="small" color="primary" />
              <Typography>{entry.marker && entry.marker.name}</Typography>
            </Location>
          </div>
        }
        action={
          isOwnEntry && (
            <div>
              <IconButton aria-label="settings" onClick={handleOpenMenu}>
                <MoreVertIcon />
              </IconButton>

              <Menu
                anchorEl={menuAnchor}
                keepMounted
                open={isMenuOpen}
                onClose={handleCloseMenu}
              >
                <MenuItem onClick={deleteEntry} style={{ color: "#f44336" }}>
                  Delete
                </MenuItem>
              </Menu>
            </div>
          )
        }
      />

      <StyledCardContent isExpanded={expanded}>
        <ReactMarkdown
          source={entry.content}
          renderers={{ root: Typography }}
        />
        {!expanded && <Fade />}
      </StyledCardContent>
      <CardActions>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={() => setExpanded((prev) => !prev)}
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>

      <ImageContainer>
        {entry.photos.map((photo) => (
          <CardMedia>
            <Image src={photo.data} alt="card photo" />
          </CardMedia>
        ))}
      </ImageContainer>
    </StyledCard>
  );
};

export default EntryCard;

const StyledCard = styled(Card)`
  min-width: 300px;
  width: 100%;
  margin: 28px 0px;
`;

const StyledCardContent = styled(CardContent)`
  max-height: ${({ isExpanded }) => (isExpanded ? "none" : "200px")};
  overflow: hidden;
  position: relative;
`;

const Fade = styled.div`
  position: absolute;
  bottom: 0;
  display: block;
  width: 100%;
  height: 50px;
  background-image: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0.9) 100%
  );
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  margin-top: 4px;
`;

const ImageContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

const Image = styled.img`
  height: 250px;
  width: auto;
  margin: 12px;
  border-radius: 5px;
  box-shadow: 3px 3px 10px rgba(150, 150, 150, 0.5);
`;
