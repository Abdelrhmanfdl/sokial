import { NavLink } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
} from "@material-ui/core";
import { Badge } from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import FriendshipNotificationsButton from "./friendshipNotificationsButton";

const MainBar = (props) => {
  if (props.identity == null) {
    return (
      <AppBar position="fixed">
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
      <AppBar position="fixed">
        <Toolbar id="mainbar-logged-toolbar">
          <Typography variant="h6">Sokial</Typography>

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
