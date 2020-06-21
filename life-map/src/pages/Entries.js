import React, { useState } from "react";
import styled from "styled-components";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core";
import { useSnackbar } from "notistack";
import axios from "axios";

//--------start import Material-ui components---------//
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";
import Collapse from "@material-ui/core/Collapse";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
//--------end import Material-ui components---------//

//--------start import icons--------//
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import RoomIcon from "@material-ui/icons/Room";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import createEntryBackground from "../static/create-entry-background.png";
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
const EntryCard = ({ entry, removeEntry }) => {
  const classes = useStyles();
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
      marker_id: entry.marker.id
    }
    const { success } = await axios.post('/homepage/delete-entry', payload, config);
    if (success) {
      removeEntry();
      enqueueSnackbar("Successfully deleted entry!", { variant: "success"});
    } else {
      enqueueSnackbar("Oops, something went wrong", { variant: "error"});
    }
    handleCloseMenu();
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
              <Typography>{entry.marker.name}</Typography>
            </Location>
          </div>
        }
        action={
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
        }
      />

      <CardContent>
        <Typography variant="body1" color="textPrimary" component="p">
          {entry.content.slice(0, 130)}

          {/* display ellipses if >130 chars long */}
          {entry.content.length > 130 ? "..." : ""}
        </Typography>
      </CardContent>

      {/* display expansion card if >130 chars OR there are photos */}
      {(entry.content.length > 130 || entry.photos.length) && (
        <div>
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

          <Collapse in={expanded} timeout="auto">
            <CardContent>
              <Typography variant="body1" color="textPrimary" component="p">
                {entry.content.slice(130)}
              </Typography>
            </CardContent>

            <ImageContainer>
              {entry.photos.map((photo) => (
                <CardMedia>
                  <Image src={photo.data} alt="card photo" />
                </CardMedia>
              ))}
            </ImageContainer>
          </Collapse>
        </div>
      )}
    </StyledCard>
  );
};

/**
 * This is a list container for all entry cards
 * It receives a list of Entry Objects as props
 *
 * Entries.propTypes = {
 * entries: PropTypes.arrayOf(Entry).isRequired
 * }
 */
const Entries = ({ entries }) => {
  const [diaryEntries, setEntries] = useState(entries);

  const removeDeletedEntry = (entry) => {
    return () => {
      console.log("setting state");
      setEntries(diaryEntries.filter(x => x !== entry));
    }
  }

  return (
    <Container>
      {diaryEntries.map((entry) => (
        <EntryCard key={entry.id} entry={entry} removeEntry={removeDeletedEntry(entry)} />
      ))}
    </Container>
  );
};

export default Entries;

const Container = styled(Paper)`
  flex-grow: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url(${createEntryBackground});
  background-repeat: repeat-y;
  background-size: cover;
`;

const StyledCard = styled(Card)`
  min-width: 300px;
  width: 50%;
  margin: 28px 0px;
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
