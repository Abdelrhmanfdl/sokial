import { Component, createRef } from "react";
import {
  TextField,
  TextareaAutosize,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Badge,
} from "@material-ui/core";
import FriendshipNotifEntry from "./friendshipNotifEntry";
import NotificationsContainer from "./notificationsContainer";
import NotificationsIcon from "@material-ui/icons/Notifications";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import CircularProgress from "@material-ui/core/CircularProgress";

class FriendshipNotificationsButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,

      noMoreNotif: false,
      fetchedNotif: [],
      shownNotifDivs: [],
    };

    this.dialogRef = createRef(null);

    this.numNotifToFetch = 15; // It's a parameter that can be changed
    this.numNotifToPush = 5; // It's a parameter that can be changed

    this.handleClickFriendshipNotif = this.handleClickFriendshipNotif.bind(
      this
    );
    this.pushToShownNotif = this.pushToShownNotif.bind(this);
    this.handleWaitingForNotif = this.handleWaitingForNotif.bind(this);
    this.fetchNewNotif = this.fetchNewNotif.bind(this);
  }

  // Fetching Friendship Notifications
  fetchNewNotif() {
    const escapeNotif = this.state.fetchedNotif.length;
    const limitNotif = this.numNotifToFetch;

    console.log(`${escapeNotif} ${limitNotif}`);

    return new Promise((resolve, reject) => {
      fetch(
        `/friendship-request/requests?` +
          new URLSearchParams({
            asreceiver: true,
            esc: escapeNotif,
            limit: limitNotif,
          }),
        {
          method: "GET",
        }
      )
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          if (!res.valid) {
            // TODO :: Handle invalid fetch
          } else {
            console.log(res.data);
            return resolve(res.data);
          }
        });
    });
  }

  handleClickFriendshipNotif() {
    this.setState({
      openDialog: !this.state.openDialog,
    });
  }

  pushToShownNotif() {
    const tmpNotifDivs = [];

    let toPushLeft = this.state.shownNotifDivs.length;
    let toPushRight = Math.min(
      toPushLeft + this.numNotifToPush,
      this.state.fetchedNotif.length
    );

    for (let i = toPushLeft; i < toPushRight; i++)
      tmpNotifDivs.push(
        <FriendshipNotifEntry
          id={this.state.fetchedNotif[i].id}
          fullName={`${this.state.fetchedNotif[i].firstName} ${this.state.fetchedNotif[i].lastName}`}
        />
      );

    this.setState({
      shownNotifDivs: this.state.shownNotifDivs.concat(tmpNotifDivs),
    });
  }

  handleWaitingForNotif() {
    this.setState({ waitingForNotif: true });

    if (this.state.fetchedNotif.length === this.state.shownNotifDivs.length) {
      // Need to fetch new notif
      this.fetchNewNotif().then((notif) => {
        //console.log("Fetched notif >> ", notif);
        if (notif.length === 0) {
          this.setState({ noMoreNotif: true });
        } else {
          this.setState({
            fetchedNotif: this.state.fetchedNotif.concat(notif),
          });
          this.pushToShownNotif();
        }
      });
    } else {
      this.pushToShownNotif();
    }

    this.fetching = false;
    this.setState({ waitingForNotif: false });
  }

  componentDidMount() {
    this.handleWaitingForNotif();
  }

  render() {
    let endDiv = null;
    if (this.state.noMoreNotif === false && this.state.waitingForNotif)
      endDiv = (
        <div id="notif-profile-section-loading-div">
          <CircularProgress />
        </div>
      );
    else if (this.state.noMoreNotif === false) {
      endDiv = (
        <div>
          <Button
            style={{ width: "100%" }}
            onClick={this.handleWaitingForNotif}
          >
            Load more...
          </Button>
        </div>
      );
    }

    return (
      <div className="notifbtn-with-container">
        <IconButton color="inherit" onClick={this.handleClickFriendshipNotif}>
          <Badge badgeContent={3} color="secondary" variant="dot">
            <PersonAddIcon />
          </Badge>
        </IconButton>

        <Dialog
          open={this.state.openDialog}
          onClose={this.handleClickFriendshipNotif}
        >
          <div ref={this.dialogRef}></div>
          <DialogTitle style={{ textAlign: "center" }}>
            Friendship Notifications
          </DialogTitle>
          <DialogContent class="notif-container">
            {this.state.shownNotifDivs} {endDiv}
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default FriendshipNotificationsButton;
