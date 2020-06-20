import React, { useState } from "react";
import styled from "styled-components";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";
import Collapse from "@material-ui/core/Collapse";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Paper } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import createEntryBackground from "../static/create-entry-background.png";

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

const EntryCard = ({ entry }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  return (
    <StyledCard elevation={3}>
      <CardHeader
        title={entry.title}
        subheader={new Date(entry.date_time).toString()}
      />
      <CardContent>
        <Typography variant="body1" color="textPrimary" component="p">
          {entry.content.slice(0, 130)}
          {entry.content.length > 130 ? "..." : ""}
        </Typography>
      </CardContent>
      {entry.content.length > 130 && (
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

const Entries = ({ entries }) => {
  console.log(entries);
  return (
    <Container>
      {entries.map((entry) => (
        <EntryCard key={entry.id} entry={entry} />
      ))}
    </Container>
  );
};

export default Entries;

const Container = styled(Paper)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url(${createEntryBackground});
  background-repeat: repeat-y;
  background-size: contain;
`;

const StyledCard = styled(Card)`
  width: 50%;
  margin: 28px 0px;
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
