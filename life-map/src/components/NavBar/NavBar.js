import React, { useState, useEffect } from "react";
import axios from "axios";
import { fade, makeStyles } from "@material-ui/core/styles";

//--------import custom components and hooks ---------//
import FollowRequestCard from "./FollowRequestCard";
import MobileMenuModal from "./MobileMenuModal";
import useDebouncer from "../../hooks/useDebouncer";
//--------end custom components and hooks ---------//
//--------start import Material-ui components---------//
import AppBar from "@material-ui/core/AppBar";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import MenuIcon from "@material-ui/icons/Menu";
import MoreIcon from "@material-ui/icons/MoreVert";
import NotificationsIcon from "@material-ui/icons/Notifications";
import SearchIcon from "@material-ui/icons/Search";
import Badge from '@material-ui/core/Badge';
//--------end import Material-ui components---------//

const config = {
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};

const useStyles = makeStyles((theme) => ({
  search: {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    width: "100%",
  },
  input: {
    color: theme.palette.common.white,
  },
  title: {
    // only show the page title on widths > 600px
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  desktopButtonsContainer: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  mobileButtonsContainer: {
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

const NavBar = ({
  page,
  followRequests,
  handlePageChange,
  handleSearchRedirect,
  handleFollowUIUpdate,
  handleLogOut,
}) => {
  const classes = useStyles();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const isMenuOpen = Boolean(menuAnchor);
  const [followMenuAnchor, setFollowMenuAnchor] = useState(null);
  const isFollowMenuOpen = Boolean(followMenuAnchor);
  const [mobileAnchor, setMobileAnchor] = useState(null);
  const isMobileMenuOpen = Boolean(mobileAnchor);

  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const debouncedSearchInput = useDebouncer(searchInput, 500);

  // useEffect hook for search API calls.
  // debouncedSearchInput is the only dependency, so this only runs
  // each time the debouncer returns a new value after the specified delay
  useEffect(() => {
    (async () => {
      if (debouncedSearchInput) {
        try {
          const {
            data: { results },
          } = await axios.post(
            `/api/social/user`,
            { searchString: debouncedSearchInput },
            config
          );

          if (results) {
            setSearchResults(results);
            return;
          }
        } catch (error) {
          console.error(error);
        }
        setSearchResults([]);
      }
    })();
  }, [debouncedSearchInput]);

  const handleOpenMenu = (event) => {
    setMenuAnchor(event.target);
  };

  const handleOpenFollow = (event) => {
    setFollowMenuAnchor(event.target);
  };

  const handleOpenMobileMenu = (event) => {
    setMobileAnchor(event.target);
  };

  const onMenuItemClick = (page) => {
    setMenuAnchor(null);
    handlePageChange(page);
  };

  return (
    <AppBar position="static" style={{ padding: 0 }}>
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton color="inherit" onClick={handleOpenMenu} style={{ paddingLeft: 0 }}>
            <MenuIcon />
          </IconButton>

          {/* search bar */}
          <Autocomplete
            freeSolo
            inputValue={searchInput}
            // when an option is selected (or removed)
            onChange={(event, value) => {
              if (value) {
                handleSearchRedirect(value.id);
              }
            }}
            // when text input changes
            onInputChange={(event, newInputValue) =>
              setSearchInput(newInputValue)
            }
            options={searchResults}
            getOptionLabel={(result) => result.name}
            // render prop for input component
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                className={classes.search}
                InputProps={{
                  ...params.InputProps,
                  className: classes.input,
                  // render search icon
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
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
                navigateToProfile={() => handleSearchRedirect(req.sender)}
              />
            ))}

          {!followRequests.length && (
            <MenuItem style={{ width: "350px" }}>No follow requests</MenuItem>
          )}
        </Menu>
        {/* end follow requests modal */}

        <Typography variant="h6" className={classes.title}>
          {page}
        </Typography>

        <div className={classes.desktopButtonsContainer}>
          <IconButton
            color="inherit"
            onClick={() => onMenuItemClick("Profile")}
          >
            <AccountCircleIcon />
          </IconButton>
          <IconButton color="inherit" onClick={handleOpenFollow}>
            <Badge badgeContent={followRequests.length > 0 && followRequests.length}>
              <NotificationsIcon/>
            </Badge>
          </IconButton>
          <Button color="inherit" onClick={handleLogOut}>
            Logout
          </Button>
        </div>

        <div className={classes.mobileButtonsContainer}>
          <IconButton onClick={handleOpenMobileMenu} color="inherit">
            <MoreIcon />
          </IconButton>
        </div>

        {/* mobile menu modal */}
        <MobileMenuModal
          anchor={mobileAnchor}
          setAnchor={setMobileAnchor}
          isOpen={isMobileMenuOpen}
          followRequests={followRequests}
          UIhandler={handleFollowUIUpdate}
          handleLogOut={handleLogOut}
          handleProfile={() => onMenuItemClick("Profile")}
        />
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
