import Post from "./post";
import Posting from "./posting";
import { Component } from "react";
import { Button } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";

class PostsHomeSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      noMorePosts: false,
      waitingForPosts: true,
      firstFetchDone: false,
      fetchedPosts: [],
      shownPostsDivs: [],
    };

    this.numPostsToFetch = 50; // It's a parameter that can be changed
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
    this.updatePostCounters = this.updatePostCounters.bind(this);
  }

  updatePostCounters(postIndex, newCounters) {
    // Update my reaction in the state, because in the toggle function i just temporarily updated it.
    // Also, it updates the post counters... comments and reactions.

    let tmpFetchedPosts = [...this.state.fetchedPosts],
      willTurnOffReaction = false;
    if (tmpFetchedPosts[postIndex].reactions.length) {
      tmpFetchedPosts[postIndex].reactions.pop();
      willTurnOffReaction = true;
    } else tmpFetchedPosts[postIndex].reactions.push(1);

    tmpFetchedPosts[postIndex].postData = {
      ...tmpFetchedPosts[postIndex].postData,
      postCounters: {
        reactionsCounter: newCounters.reactions_counter,
        commentsCounter: newCounters.comments_counter,
      },
    };

    let tmpPostsDivs = [...this.state.shownPostsDivs];
    tmpPostsDivs[postIndex] = {
      ...tmpPostsDivs[postIndex],
      props: {
        ...tmpPostsDivs[postIndex].props,
        postData: {
          ...tmpPostsDivs[postIndex].props.postData,
          postCounters: {
            reactionsCounter: newCounters.reactions_counter,
            commentsCounter: newCounters.comments_counter,
          },
        },
        myReactionType: willTurnOffReaction ? null : 1,
      },
    };

    this.setState({
      shownPostsDivs: tmpPostsDivs,
      fetchedPosts: tmpFetchedPosts,
    });
  }

  createPost(newPost) {
    return (
      <Post
        key={newPost.postData.id}
        postData={newPost.postData}
        postIndex={newPost.postIndex}
        postAuthorData={newPost.postAuthorData}
        myReactionType={newPost.reactions ? newPost.reactions[0] : null}
        specificStyle={newPost.specificStyle}
        identity={this.props.identity}
        toggleReaction={this.toggleReaction}
        handleDeletePost={this.handleDeletePost}
        handleEditPost={this.handleEditPost}
        updatePostCounters={this.updatePostCounters}
      />
    );
  }

  pushingNewPost(newPost) {
    const tmpFetched = [...this.state.fetchedPosts];
    tmpFetched.unshift({
      postData: newPost.postData,

      postAuthorData: newPost.postAuthorData,
      reactions: newPost.reactions,
      specificStyle: {
        border: "1px #3f51b5 solid",
        cursor: "progress",
      },
    });

    this.setState({ fetchedPosts: tmpFetched }, function () {
      const tmpPostsDivs = [];
      for (let i = 0; i < this.state.shownPostsDivs.length + 1; i++) {
        const post = this.state.fetchedPosts[i];
        tmpPostsDivs.push(
          post !== null ? this.createPost({ ...post, postIndex: i }) : null
        );
      }
      this.setState({ shownPostsDivs: tmpPostsDivs });
    });
  }

  handleEditPost(postIndex, newContent) {
    fetch(`/post/${this.state.fetchedPosts[postIndex].postData.id}`, {
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
        tmpFetchedPosts[postIndex].postData.content = newContent;

        let tmpPostsDivs = [...this.state.shownPostsDivs];

        // Objects in components are read-only objects
        tmpPostsDivs[postIndex] = {
          ...tmpPostsDivs[postIndex],
          props: { ...tmpPostsDivs[postIndex].props },
        };
        tmpPostsDivs[postIndex].props.postData.content = newContent;

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
    fetch(`/post/${this.state.fetchedPosts[postIndex].postData.id}`, {
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
    /* Temporarily!!, will respond to the user action till the server confirms this action.
       This function is for improving UX, 
       When a user reacts to a post the reaction button has to change its color as fast ass possible.
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
        posts = posts.map((post) => {
          console.log(post.post_image_path);
          return {
            postData: {
              id: post.post_id,
              content: post.content,
              timestamp: post.timestamp,
              privacy: post.privacy,
              postImageData: post.post_image_path
                ? [{ image_path: post.post_image_path }]
                : [],
              postCounters: {
                reactionsCounter: post.reactions_counter,
                commentsCounter: post.comments_counter,
              },
            },
            postAuthorData: {
              id: post.author_user_id,
              firstName: post.first_name,
              lastName: post.last_name,
              profileImagePath: post.profile_image_path,
            },
            reactions: post.my_reaction_type ? [post.my_reaction_type] : [],
          };
        });
        if (posts.length === 0) {
          this.setState({ noMorePosts: true });
        } else {
          if (this.state.fetchedPosts.length === 0)
            this.beforeDate = posts[0].postData.timestamp;
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
        `/home/posts?` +
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
            return resolve(res.entries);
          }
        });
    });
  }

  pushToShownPosts() {
    const tmpPostsDivs = [];
    //alert("here");

    let toPushLeft = this.state.shownPostsDivs.length;
    let toPushRight = Math.min(
      toPushLeft + this.numPostsToPush,
      this.state.fetchedPosts.length
    );

    for (let i = toPushLeft; i < toPushRight; i++) {
      tmpPostsDivs.push(
        <Post
          key={this.state.fetchedPosts[i].postData.id}
          postData={this.state.fetchedPosts[i].postData}
          postAuthorData={this.state.fetchedPosts[i].postAuthorData}
          identity={this.props.identity}
          postIndex={tmpPostsDivs.length}
          myReactionType={
            this.state.fetchedPosts[i].reactions
              ? this.state.fetchedPosts[i].reactions[0]
              : null
          }
          toggleReaction={this.toggleReaction}
          handleDeletePost={this.handleDeletePost}
          handleEditPost={this.handleEditPost}
          updatePostCounters={this.updatePostCounters}
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
    else if (
      this.state.noMorePosts === false &&
      this.state.shownPostsDivs.length
    ) {
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
      <div style={{ marginTop: "10px" }}>
        <Posting
          identity={this.props.identity}
          pushingNewPost={this.pushingNewPost}
        />
        {this.state.shownPostsDivs} {endDiv}
      </div>
    );
  }
}

export default PostsHomeSection;
