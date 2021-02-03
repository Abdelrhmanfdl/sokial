import { NavLink } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
} from "@material-ui/core";
import { Badge } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import FriendshipNotificationsButton from "./friendshipNotificationsButton";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

const MainBar = (props) => {
  if (props.identity == null) {
    return (
      <AppBar position="fixed" id="main-bar">
        <Toolbar id="mainbar-notlogged-toolbar">
          <Typography variant="h6">Sokial</Typography>
          <div id="mainbar-notlogged-buttons">
            <Button color="inherit">
              <NavLink to="/login" className="navlink-button">
                Login
              </NavLink>
            </Button>
            <Button color="inherit" href="/signup" aria-current="page">
              <NavLink to="/Signup" className="navlink-button">
                Signup
              </NavLink>
            </Button>
          </div>
        </Toolbar>
      </AppBar>
    );
  } else {
    return (
      <AppBar position="fixed" id="main-bar">
        <Toolbar id="mainbar-logged-toolbar">
          <Typography variant="h6">Sokial</Typography>

          <NavLink to="/home" className="navlink-button">
            <IconButton color="inherit">
              <HomeIcon />
            </IconButton>
          </NavLink>

          <NavLink
            to={`/profile?id=${props.identity.id}`}
            className="navlink-button"
          >
            <IconButton color="inherit">
              <AccountCircleIcon />
            </IconButton>
          </NavLink>

          <FriendshipNotificationsButton identity={props.identity} />
          <Button id="" color="inherit" onClick={props.logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    );
  }
};

export default MainBar;
