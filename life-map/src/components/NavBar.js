import React, { useState, useEffect } from "react";
import axios from "axios";
import FollowRequestCard from "./FollowRequestCard";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import MenuIcon from "@material-ui/icons/Menu";
import NotificationsIcon from "@material-ui/icons/Notifications";
import SearchIcon from "@material-ui/icons/Search";
import useDebouncer from "../hooks/useDebouncer";

const useStyles = makeStyles((theme) => ({
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const NavBar = ({
  page,
  followRequests,
  handlePageChange,
  handleFollowUIUpdate,
  handleLogOut,
}) => {
  const classes = useStyles();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const isMenuOpen = Boolean(menuAnchor);
  const [followMenuAnchor, setFollowMenuAnchor] = useState(null);
  const isFollowMenuOpen = Boolean(followMenuAnchor);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const debouncedSearchInput = useDebouncer(searchInput, 500);

  // useEffect hook for search API calls.
  // debouncedSearchInput is the only dependency, so this only runs
  // each time the debouncer returns a new value after the specified delay
  useEffect(() => {
    if (debouncedSearchInput) {
      // dummy api call
      axios
        .get(`/search/?query=${debouncedSearchInput}`)
        .then((data) => {
          setSearchResults(data.results);
        })
        .catch((error) => {
          console.error(error);
          setSearchResults([]);
        });
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchInput]);

  const handleOpenMenu = (event) => {
    setMenuAnchor(event.target);
  };

  const handleOpenFollow = (event) => {
    setFollowMenuAnchor(event.target);
  };

  const onMenuItemClick = (page) => {
    setMenuAnchor(null);
    handlePageChange(page);
  };

  return (
    <AppBar position="static" style={{ padding: 0 }}>
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton color="inherit" onClick={handleOpenMenu}>
            <MenuIcon />
          </IconButton>

          {/* search bar */}
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
            />
          </div>
        </div>
        {/* end search bar */}

        {/* nav bar menu modal */}
        <Menu
          anchorEl={menuAnchor}
          keepMounted
          open={isMenuOpen}
          onClose={() => setMenuAnchor(null)}
        >
          <MenuItem onClick={() => onMenuItemClick("Map")}>Map</MenuItem>
          <MenuItem onClick={() => onMenuItemClick("Add entry")}>
            Add entry
          </MenuItem>
          <MenuItem onClick={() => onMenuItemClick("View all entries")}>
            View all entries
          </MenuItem>
        </Menu>
        {/* end nav bar menu modal */}

        {/* follow requests modal */}
        <Menu
          anchorEl={followMenuAnchor}
          keepMounted
          open={isFollowMenuOpen}
          onClose={() => setFollowMenuAnchor(null)}
        >
          {!!followRequests.length &&
            followRequests.map((req) => (
              <FollowRequestCard
                key={req.id}
                request={req}
                UIhandler={handleFollowUIUpdate}
              />
            ))}

          {!followRequests.length && (
            <MenuItem style={{ width: "350px" }}>No follow requests</MenuItem>
          )}
        </Menu>
        {/* end follow requests modal */}

        <Typography variant="h6">{page}</Typography>

        <div style={{ display: "flex" }}>
          <IconButton
            color="inherit"
            onClick={() => onMenuItemClick("Profile")}
          >
            <AccountCircleIcon />
          </IconButton>

          <IconButton color="inherit" onClick={handleOpenFollow}>
            <NotificationsIcon />
          </IconButton>

          <Button color="inherit" onClick={handleLogOut}>
            Logout
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
