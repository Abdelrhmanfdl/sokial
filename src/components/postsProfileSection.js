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
    this.handleDeletePost = this.handleDeletePost.bind(this);
    this.handleEditPost = this.handleEditPost.bind(this);
  }

  handleEditPost(postIndex, newContent) {
    fetch(`/post/${this.state.fetchedPosts[postIndex].id}`, {
      method: "PUT",
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        newContent: newContent,
        newPrivacy: 5, // TODO :: update it
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error in editing the post");
      })
      .catch((res) => {});

    let tmpPostsDivs = [...this.state.shownPostsDivs];

    tmpPostsDivs[postIndex] = (
      <Post
        id={this.state.fetchedPosts[postIndex].id}
        postIndex={postIndex}
        myReactionType={this.state.fetchedPosts[postIndex].reactions[0]}
        content={newContent}
        postOwnerData={{
          id: this.props.profileId,
          firstName: this.props.profileData.firstName,
          lastName: this.props.profileData.lastName,
          profileImg: this.props.profileData.profileImg,
        }}
        postCounters={{
          reactionsCounter: this.state.fetchedPosts[postIndex]
            .reactions_counter,
          commentsCounter: this.state.fetchedPosts[postIndex].comments_counter,
        }}
        identity={this.props.identity}
        toggleReaction={this.toggleReaction}
        handleDeletePost={this.handleDeletePost}
        handleEditPost={this.handleEditPost}
      />
    );
    this.setState({ shownPostsDivs: tmpPostsDivs });
  }

  handleDeletePost(postIndex) {
    fetch(`/post/${this.state.fetchedPosts[postIndex].id}`, {
      method: "DELETE",
    })
      .then((res) => {})
      .catch((err) => {});

    let tmpPostsDivs = [...this.state.shownPostsDivs];

    tmpPostsDivs[postIndex] = null;
    this.setState({ shownPostsDivs: tmpPostsDivs });
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
        postOwnerData={{
          id: this.props.profileId,
          firstName: this.props.profileData.firstName,
          lastName: this.props.profileData.lastName,
          profileImg: this.props.profileData.profileImg,
        }}
        postCounters={{
          reactionsCounter: this.state.fetchedPosts[postIndex]
            .reactions_counter,
          commentsCounter: this.state.fetchedPosts[postIndex].comments_counter,
        }}
        identity={this.props.identity}
        toggleReaction={this.toggleReaction}
        handleDeletePost={this.handleDeletePost}
        handleEditPost={this.handleEditPost}
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

    //console.log(`${escapePosts} ${limitPosts}`);

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
      tmpPostsDivs.push(
        <Post
          id={this.state.fetchedPosts[i].id}
          postIndex={tmpPostsDivs.length}
          postOwnerData={{
            id: this.props.profileId,
            firstName: this.props.profileData.firstName,
            lastName: this.props.profileData.lastName,
            profileImg: this.props.profileData.profileImg,
          }}
          postCounters={{
            reactionsCounter: this.state.fetchedPosts[i].reactions_counter,
            commentsCounter: this.state.fetchedPosts[i].comments_counter,
          }}
          myReactionType={this.state.fetchedPosts[i].reactions[0]}
          content={this.state.fetchedPosts[i].content}
          identity={this.props.identity}
          toggleReaction={this.toggleReaction}
          handleDeletePost={this.handleDeletePost}
          handleEditPost={this.handleEditPost}
        />
      );
    }

    this.setState({
      shownPostsDivs: this.state.shownPostsDivs.concat(tmpPostsDivs),
      firstFetchDone: true,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // If there is a change in profile data that commin from "Profile", then it's a new state.
    if (prevProps.profileData !== this.props.profileData) {
      this.setState({
        noMorePosts: false,
        waitingForPosts: false,
        firstFetchDone: false,
        fetchedPosts: [],
        shownPostsDivs: [],
      });
      this.handleWaitingForPosts();
    }
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
