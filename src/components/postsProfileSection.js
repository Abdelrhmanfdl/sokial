import Post from "./post";
import { Component } from "react";
import { Button } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Posting from "./posting";

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
    this.beforeDate = "9999-12-30"; // To avoid posts those are posted while i'm here

    // This variable is used to prevent making a fetch while
    // haven't get last sent fetch yet. (A problem of scrolling based fetching)
    this.fetching = false;

    this.fetchNewPosts = this.fetchNewPosts.bind(this);
    this.pushToShownPosts = this.pushToShownPosts.bind(this);
    this.handleWaitingForPosts = this.handleWaitingForPosts.bind(this);
    this.toggleReaction = this.toggleReaction.bind(this);
    this.handleDeletePost = this.handleDeletePost.bind(this);
    this.handleEditPost = this.handleEditPost.bind(this);
    this.pushingNewPost = this.pushingNewPost.bind(this);
    this.createPost = this.createPost.bind(this);
  }

  createPost(postData) {
    return (
      <Post
        id={postData.id}
        postIndex={postData.index}
        myReactionType={postData.reactions[0]}
        content={postData.content}
        timestamp={postData.timestamp}
        specificStyle={postData.specificStyle}
        postOwnerData={{
          ...this.props.profileData,
        }}
        postCounters={{
          reactionsCounter: postData.reactions_counter,
          commentsCounter: postData.comments_counter,
        }}
        identity={this.props.identity}
        toggleReaction={this.toggleReaction}
        handleDeletePost={this.handleDeletePost}
        handleEditPost={this.handleEditPost}
      />
    );
  }

  pushingNewPost(content, postData) {
    // Show the new post with some other features "temporary"

    const tmpFetched = [...this.state.fetchedPosts];
    tmpFetched.unshift({
      id: postData.id,
      content: content,
      privacy: postData.privacy,
      comments_counter: 0,
      reactions: [],
      reactions_counter: 0,
      author_user_id: postData.author_user_id,
      specificStyle: {
        border: "1px #3f51b5 solid",
        cursor: "progress",
      },
    });

    this.setState({ fetchedPosts: tmpFetched }, function () {
      const tmpPostsDivs = [];
      this.state.fetchedPosts.map((post, idx) => {
        tmpPostsDivs.push(
          post !== null ? this.createPost({ ...post, index: idx }) : null
        );
      });
      this.setState({ shownPostsDivs: tmpPostsDivs });
    });
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

        let tmpFetchedPosts = [...this.state.fetchedPosts];
        tmpFetchedPosts[postIndex].content = newContent;

        let tmpPostsDivs = [...this.state.shownPostsDivs];

        // Objects in components are read-only objects
        tmpPostsDivs[postIndex] = {
          ...tmpPostsDivs[postIndex],
          props: { ...tmpPostsDivs[postIndex].props },
        };
        tmpPostsDivs[postIndex].props.content = newContent;

        this.setState({
          shownPostsDivs: tmpPostsDivs,
          fetchedPosts: tmpFetchedPosts,
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  handleDeletePost(postIndex) {
    fetch(`/post/${this.state.fetchedPosts[postIndex].id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Can't delete this post");
        let tmpPostsDivs = [...this.state.shownPostsDivs];
        let tmpFetchedPosts = [...this.state.fetchedPosts];
        tmpPostsDivs[postIndex] = null;
        tmpFetchedPosts[postIndex] = null;
        this.setState({
          shownPostsDivs: tmpPostsDivs,
          fetchedPosts: tmpFetchedPosts,
        });
      })
      .catch((err) => {});
  }

  toggleReaction(postIndex, newReactionType) {
    /* This function is for improving UX, 
       When a user reacts to a post the reaction button has to change its color as fast ass possible,
       not to wait for server act or refreshing the page.
       I assume here that the 'fetchedPosts' array won't change its content order.
    */

    let tmpPostsDivs = [...this.state.shownPostsDivs];
    tmpPostsDivs[postIndex] = {
      ...tmpPostsDivs[postIndex],
      props: {
        ...tmpPostsDivs[postIndex].props,
        myReactionType: newReactionType,
      },
    };

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
          if (this.state.fetchedPosts.length === 0)
            this.beforeDate = posts[0].timestamp;
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

    return new Promise((resolve, reject) => {
      fetch(
        `/get-posts/${this.props.profileId}?` +
          new URLSearchParams({
            esc: escapePosts,
            limit: limitPosts,
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
            console.log(res.posts);
            return resolve(res.posts);
          }
        });
    });
  }

  pushToShownPosts() {
    const tmpPostsDivs = [...this.state.shownPostsDivs];

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
          timestamp={this.state.fetchedPosts[i].timestamp}
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
      shownPostsDivs: tmpPostsDivs,
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
      <>
        <Posting
          identity={this.props.identity}
          isMyProfile={this.props.isMyProfile}
          profileData={this.props.profileData}
          pushingNewPost={this.pushingNewPost}
        />
        {this.state.shownPostsDivs} {endDiv}
      </>
    );
  }
}

export default PostsProfileSection;
