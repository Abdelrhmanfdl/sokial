import Post from "./post";
import { Component } from "react";
import { Button } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";

class PostsProfileSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      noMorePosts: false,
      waitingForPosts: false,
      firstFetchDone: false,
      fetchedPosts: [],
      shownPostsDivs: [],
    };

    this.numPostsToFetch = 100; // It's a parameter that can be changed
    this.numPostsToPush = 15; // It's a parameter that can be changed

    // This variable is used to prevent making a fetch while
    // haven't get last sent fetch yet. (A problem of scrolling based fetching)
    this.fetching = false;

    this.fetchNewPosts = this.fetchNewPosts.bind(this);
    this.pushToShownPosts = this.pushToShownPosts.bind(this);
    this.handleWaitingForPosts = this.handleWaitingForPosts.bind(this);
    this.toggleReaction = this.toggleReaction.bind(this);
  }

  toggleReaction(postIndex, newReactionType) {
    /* This function is for improving UX, 
       When a user reacts to a post the reaction button has to change its color as fast ass possible,
       not to wait for server act or refreshing the page.
       I assume here that the 'fetchedPosts' array won't change its content order.
    */

    let tmpPostsDivs = [...this.state.shownPostsDivs];

    tmpPostsDivs[postIndex] = (
      <Post
        id={this.state.fetchedPosts[postIndex].id}
        postIndex={postIndex}
        myReactionType={newReactionType}
        content={this.state.fetchedPosts[postIndex].content}
        autherFullName={`${this.props.profileData.firstName} ${this.props.profileData.lastName}`}
        toggleReaction={this.toggleReaction}
      />
    );
    this.setState({ shownPostsDivs: tmpPostsDivs });
  }

  handleWaitingForPosts() {
    this.setState({ waitingForPosts: true });

    if (this.state.fetchedPosts.length === this.state.shownPostsDivs.length) {
      // Need to fetch new posts
      this.fetchNewPosts().then((posts) => {
        //console.log("Fetched posts >> ", posts);
        if (posts.length === 0) {
          this.setState({ noMorePosts: true });
        } else {
          this.setState({
            fetchedPosts: this.state.fetchedPosts.concat(posts),
          });
          this.pushToShownPosts();
        }
      });
    } else {
      this.pushToShownPosts();
    }

    this.fetching = false;
    this.setState({ waitingForPosts: false });
  }

  fetchNewPosts() {
    const escapePosts = this.state.fetchedPosts.length;
    const limitPosts = this.numPostsToFetch;

    console.log(`${escapePosts} ${limitPosts}`);

    return new Promise((resolve, reject) => {
      fetch(
        `/get-posts/${this.props.profileId}?` +
          new URLSearchParams({
            esc: escapePosts,
            limit: limitPosts,
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
            //console.log(res.posts.length);
            return resolve(res.posts);
          }
        });
    });
  }

  pushToShownPosts() {
    const tmpPostsDivs = [];

    let toPushLeft = this.state.shownPostsDivs.length;
    let toPushRight = Math.min(
      toPushLeft + this.numPostsToPush,
      this.state.fetchedPosts.length
    );

    for (let i = toPushLeft; i < toPushRight; i++) {
      console.log(this.state.fetchedPosts[i]);

      tmpPostsDivs.push(
        <Post
          id={this.state.fetchedPosts[i].id}
          postIndex={tmpPostsDivs.length}
          myReactionType={this.state.fetchedPosts[i].reactions[0]}
          content={this.state.fetchedPosts[i].content}
          autherFullName={`${this.props.profileData.firstName} ${this.props.profileData.lastName}`}
          identity={this.props.identity}
          toggleReaction={this.toggleReaction}
        />
      );
    }

    this.setState({
      shownPostsDivs: this.state.shownPostsDivs.concat(tmpPostsDivs),
      firstFetchDone: true,
    });
  }

  componentDidMount() {
    this.handleWaitingForPosts();
  }

  render() {
    let endDiv = null;
    if (this.state.noMorePosts === false && this.state.waitingForPosts)
      endDiv = (
        <div id="posts-profile-section-loading-div">
          <CircularProgress />
        </div>
      );
    else if (this.state.noMorePosts === false) {
      endDiv = (
        <div>
          <Button
            style={{ width: "100%" }}
            onClick={this.handleWaitingForPosts}
          >
            Load more...
          </Button>
        </div>
      );
    }

    return (
      <div>
        {this.state.shownPostsDivs} {endDiv}
      </div>
    );
  }
}

export default PostsProfileSection;
