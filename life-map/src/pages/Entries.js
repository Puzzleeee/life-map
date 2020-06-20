import React, { useState } from "react";
import styled from "styled-components";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Paper } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
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
          </Collapse>
        </div>
      )}
    </StyledCard>
  );
};

const Entries = ({ entries }) => {
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
`;

const StyledCard = styled(Card)`
  width: 50%;
  margin: 36px;
`;
