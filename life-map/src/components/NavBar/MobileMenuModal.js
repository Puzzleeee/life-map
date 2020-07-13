import React from "react";
import styled from "styled-components";
import FollowRequestCard from "./FollowRequestCard";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import NotificationsIcon from "@material-ui/icons/Notifications";

const MobileMenuModal = ({
  anchor,
  setAnchor,
  isOpen,
  followRequests,
  UIhandler,
  handleLogOut,
  handleProfile,
}) => (
  <Menu
    anchorEl={anchor}
    keepMounted
    open={isOpen}
    onClose={() => setAnchor(null)}
  >
    <MenuItem onClick={handleProfile}>
      <ListItemIcon>
        <AccountCircleIcon />
      </ListItemIcon>
      <ListItemText primary="Profile" />
    </MenuItem>

    <CleanAccordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <ListItemIcon style={{ display: "flex", alignItems: "center" }}>
          <NotificationsIcon />
        </ListItemIcon>
        <ListItemText primary="Requests" />
      </AccordionSummary>

      {!!followRequests.length &&
        followRequests.map((req) => (
          <AccordionDetails>
            <FollowRequestCard
              key={req.id}
              request={req}
              UIhandler={UIhandler}
            />
          </AccordionDetails>
        ))}

      {!followRequests.length && (
        <AccordionDetails>
          <Typography>No requests</Typography>
        </AccordionDetails>
      )}
    </CleanAccordion>

    <MenuItem onClick={handleLogOut}>
      <ListItemIcon>
        <ExitToAppIcon />
      </ListItemIcon>
      <ListItemText primary="Logout" />
    </MenuItem>
  </Menu>
);

export default MobileMenuModal;

// 1. remove box-shadow from Accordion's inner elevated Paper
// 2. Remove the :before pseudo-divider from Accordion
const CleanAccordion = styled(Accordion)`
  &.MuiPaper-elevation1 {
    box-shadow: none;
  }
  &.MuiAccordion-root:before {
    display: none;
  }
`;
