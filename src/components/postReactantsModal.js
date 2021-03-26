import { Modal } from "@material-ui/core";
import { Component } from "react";
import { Button, IconButton } from "@material-ui/core";
import PostReactantEntry from "./postReactantEntry";
import CircularProgress from "@material-ui/core/CircularProgress";
import ClearIcon from "@material-ui/icons/Clear";

class PostReactantsModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      noMoreEntries: false,
      waitingForEntries: false,
      fetchedEntries: [],
      shownEntriesDivs: [],
    };

    this.numEntriesToFetch = 100; // It's a parameter that can be changed
    this.numEntriesToPush = 15; // It's a parameter that can be changed
    this.beforeDate = "9999-12-30";

    // This variable is used to prevent making a fetch while
    // haven't get last sent fetch yet. (A problem of scrolling based fetching)
    this.fetching = false;
    this.fetchNewEntries = this.fetchNewEntries.bind(this);
    this.pushToShownEntries = this.pushToShownEntries.bind(this);
    this.handleWaitingForEntries = this.handleWaitingForEntries.bind(this);
  }

  handleWaitingForEntries() {
    this.setState({ waitingForEntries: true });

    if (
      this.state.fetchedEntries.length === this.state.shownEntriesDivs.length
    ) {
      this.fetchNewEntries().then((reactants) => {
        if (reactants.length === 0) {
          this.setState({ noMoreEntries: true });
        } else {
          if (this.state.fetchedEntries.length === 0)
            this.beforeDate = reactants[0]["reactions.timestamp"];
          this.setState({
            fetchedEntries: this.state.fetchedEntries.concat(reactants),
          });
          this.pushToShownEntries();
        }
      });
    } else {
      this.pushToShownEntries();
    }

    this.fetching = false;
    this.setState({ waitingForEntries: false });
  }

  fetchNewEntries() {
    const escapeEntries = this.state.fetchedEntries.length;
    const limitEntries = this.numEntriesToFetch;

    return new Promise((resolve, reject) => {
      fetch(
        `/post/react/post-reactants/${this.props.postData.id}?` +
          new URLSearchParams({
            esc: escapeEntries,
            limit: limitEntries,
            beforeDate: this.beforeDate,
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
            return resolve(res.reactants);
          }
        });
    });
  }

  pushToShownEntries() {
    const tmpEntriesDivs = [...this.state.shownEntriesDivs];

    let toPushLeft = this.state.shownEntriesDivs.length;
    let toPushRight = Math.min(
      toPushLeft + this.numEntriesToPush,
      this.state.fetchedEntries.length
    );

    for (let i = toPushLeft; i < toPushRight; i++) {
      tmpEntriesDivs.push(
        <PostReactantEntry
          key={this.state.fetchedEntries[i].id}
          reactantData={this.state.fetchedEntries[i]}
          identity={this.props.identity}
        />
      );
    }

    this.setState({
      shownEntriesDivs: tmpEntriesDivs,
      firstFetchDone: true,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // If there is a change in profile data that commin from "Profile", then it's a new state.
    if (prevProps.profileData !== this.props.profileData) {
      this.setState({
        noMoreEntries: false,
        waitingForEntries: false,
        fetchedEntries: [],
        shownEntriesDivs: [],
      });
      this.handleWaitingForEntries();
    }
  }

  componentDidMount() {
    this.handleWaitingForEntries();
  }

  render() {
    let endDiv = null;
    if (this.state.noMoreEntries === false && this.state.waitingForEntries)
      endDiv = (
        <div id="post-reactants=modal-loading-div">
          <CircularProgress />
        </div>
      );
    else if (this.state.noMoreEntries === false) {
      endDiv = (
        <div>
          <Button
            style={{ width: "100%" }}
            onClick={this.handleWaitingForEntries}
          >
            Load more...
          </Button>
        </div>
      );
    }

    const tmp = [];
    for (let z = 0; z < 30; z++) {
      tmp.push(<PostReactantEntry identity={this.props.identity} />);
    }

    return (
      <Modal id="reactants-modal" open={true} onClose={this.props.closeModal}>
        <div id="reactants-modal-body">
          <div id="reactants-modal-header">
            <IconButton onClick={this.props.closeModal}>
              <ClearIcon />
            </IconButton>
          </div>
          <div id="reactants-modal-content">
            {this.state.shownEntriesDivs} {endDiv}
          </div>
        </div>
      </Modal>
    );
  }
}

export default PostReactantsModal;
