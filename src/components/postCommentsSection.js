import { createRef } from "react";
import { TextField, TextareaAutosize, Button } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import generalFunctions from "../usable functions/general";
import PostComment from "./postComment";
import { Component } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

class PostCommentsSections extends Component {
  constructor(props) {
    super(props);

    this.state = {
      noMoreComments: false,
      waitingForComments: false,
      firstFetchDone: false,
      fetchedComments: [],
      shownCommentsDivs: [],
    };
    this.textareaRef = createRef(null);

    this.numCommentsToFetch = 100; // It's a parameter that can be changed
    this.numCommentsToPush = 20; // It's a parameter that can be changed

    // This variable is used to prevent making a fetch while
    // haven't get last sent fetch yet. (A problem of scrolling based fetching)
    this.fetching = false;

    this.handleSendComment = this.handleSendComment.bind(this);
    this.fetchNewComments = this.fetchNewComments.bind(this);
    this.pushToShownComments = this.pushToShownComments.bind(this);
    this.handleWaitingForComments = this.handleWaitingForComments.bind(this);
    this.handleEditComment = this.handleEditComment.bind(this);
    this.handleDeleteComment = this.handleDeleteComment.bind(this);
    this.pushingNewComment = this.pushingNewComment.bind(this);
    this.createComment = this.createComment.bind(this);
  }

  createComment(newComment) {
    return (
      <PostComment
        key={newComment.commentData.id}
        commentData={{ ...newComment.commentData }}
        commentAuthorData={{ ...newComment.commentAuthorData }}
        postAuthorData={this.props.postAuthorData}
        identity={this.props.identity}
        handleEditComment={this.handleEditComment}
        handleDeleteComment={this.handleDeleteComment}
      />
    );
  }

  pushingNewComment(newComment) {
    const tmpFetchedComments = [...this.state.fetchedComments];
    tmpFetchedComments.push(newComment); // TODO :: Update all comments' index those have not been shown yet

    const tmpCommentsDivs = [...this.state.shownCommentsDivs];
    newComment.commentData.commentIndex = tmpCommentsDivs.length;
    tmpCommentsDivs.push(this.createComment(newComment));
    this.setState({
      fetchedComments: tmpFetchedComments,
      shownCommentsDivs: tmpCommentsDivs,
    });
  }

  handleSendComment() {
    fetch(`/post/comment/${this.props.postData.id}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        content: this.textareaRef.current.value,
        timestamp: generalFunctions.getTimestamp(),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((res) => {
        this.pushingNewComment({
          commentData: {
            id: res.commentData.id,
            content: this.textareaRef.current.value,
            timestamp: res.commentData.timestamp,
            commentCounters: {
              reactions_counter: res.commentData.reactions_counter,
            },
          },
          postData: {
            id: res.commentData.post_id,
          },
          commentAuthorData: {
            id: res.commentData.author_user_id,
            firstName: this.props.identity.firstName,
            lastName: this.props.identity.lastName,
            profileImagePath: this.props.identity.profileImagePath,
            authorType: res.commentData.author_type,
          },
        });
        this.textareaRef.current.value = "";
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  handleEditComment(commentIndex, newContent) {
    fetch(
      `/comment/${this.state.fetchedComments[commentIndex].commentData.id}`,
      {
        method: "PUT",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify({ newContent: newContent }),
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to edit comment");
      })
      .catch((err) => {
        console.log(err.message);
      });

    let tmpCommentsDivs = [...this.state.shownCommentsDivs];
    let tmpFetcedComments = [...this.state.fetchedComments];
    tmpFetcedComments[commentIndex].commentData.content = newContent;

    tmpCommentsDivs[commentIndex] = {
      ...tmpCommentsDivs[commentIndex],
      props: {
        ...tmpCommentsDivs[commentIndex].props,
        commentData: {
          ...tmpCommentsDivs[commentIndex].props.commentData,
          content: newContent,
        },
      },
    };
    this.setState({
      shownCommentsDivs: tmpCommentsDivs,
      fetchedComments: tmpFetcedComments,
    });
  }

  handleDeleteComment(commentIndex) {
    fetch(
      `/comment/${this.state.fetchedComments[commentIndex].commentData.id}`,
      {
        method: "DELETE",
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete comment");
        let tmpCommentsDivs = [...this.state.shownCommentsDivs];
        let tmpFetcedComments = [...this.state.fetchedComments];
        tmpCommentsDivs[commentIndex] = tmpFetcedComments[commentIndex] = null;
        this.setState({
          shownCommentsDivs: tmpCommentsDivs,
          fetchedComments: tmpFetcedComments,
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  handleWaitingForComments() {
    this.setState({ waitingForComments: true });

    if (
      this.state.fetchedComments.length === this.state.shownCommentsDivs.length
    ) {
      // Need to fetch new comments
      this.fetchNewComments().then((comments) => {
        comments = comments.map((entry) => {
          return {
            commentData: {
              id: entry.id,
              timestamp: entry.timestamp,
              content: entry.content,
            },
            postData: { id: entry.post_id },
            commentAuthorData: {
              id: entry.author_user.id,
              firstName: entry.author_user.first_name,
              lastName: entry.author_user.last_name,
              profileImagePath: entry.author_user.profile_image_path,
            },
          };
        });
        console.log("Fetched comments >> ", comments);
        if (comments.length === 0) {
          this.setState({ noMoreComments: true });
        } else {
          this.setState({
            fetchedComments: this.state.fetchedComments.concat(comments),
          });
          this.pushToShownComments();
        }
      });
    } else {
      this.pushToShownComments();
    }

    this.fetching = false;
    this.setState({ waitingForComments: false });
  }

  fetchNewComments() {
    const escapeComments = this.state.fetchedComments.length;
    const limitComments = this.numCommentsToFetch;

    return new Promise((resolve, reject) => {
      fetch(
        `/get-comments/${this.props.postData.id}?` +
          new URLSearchParams({
            esc: escapeComments,
            limit: limitComments,
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
            return resolve(res.comments);
          }
        });
    });
  }

  pushToShownComments() {
    const tmpCommentsDivs = [];

    let toPushLeft = this.state.shownCommentsDivs.length;
    let toPushRight = Math.min(
      toPushLeft + this.numCommentsToPush,
      this.state.fetchedComments.length
    );

    for (let i = toPushLeft; i < toPushRight; i++) {
      tmpCommentsDivs.push(
        <PostComment
          key={this.state.fetchedComments[i].commentData.id}
          commentData={{
            ...this.state.fetchedComments[i].commentData,
            commentIndex: tmpCommentsDivs.length,
          }}
          commentAuthorData={this.state.fetchedComments[i].commentAuthorData}
          postAuthorData={this.props.postAuthorData}
          identity={this.props.identity}
          handleEditComment={this.handleEditComment}
          handleDeleteComment={this.handleDeleteComment}
        />
      );
    }

    this.setState({
      shownCommentsDivs: this.state.shownCommentsDivs.concat(tmpCommentsDivs),
      firstFetchDone: true,
    });
  }
  /*
  fetchingAuthorsProfileImgs(comments) {
    return new Promise((resolve, reject) => {
      const allFetchPromises = [];
      for (let i = 0; i < comments.length; i++) {
        allFetchPromises.push(
          fetch(
            `/get-profile-img/${comments[i].commentAuthorData.id}?` +
              new URLSearchParams({
                profile_image_path:
                  comments[i].commentAuthorData.profileImagePath,
              })
          )
        );
      }
      let fetchesPromise = Promise.all(allFetchPromises);
      fetchesPromise
        .then((fetches) => {
          let blobsPromises = [];
          for (let i = 0; i < comments.length; i++) {
            if (fetches[i].ok) blobsPromises.push(fetches[i].blob());
            else blobsPromises.push(null);
          }
          return Promise.all(blobsPromises);
        })
        .then((imgs) => {
          for (let i = 0; i < comments.length; i++) {
            if (imgs[i]) imgs[i] = URL.createObjectURL(imgs[i]);
          }
          return resolve(imgs);
        });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.shownCommentsDivs &&
      prevState.shownCommentsDivs.length !== this.state.shownCommentsDivs.length
    ) {
      // Fetch authors profile imgs
      let left = prevState.shownCommentsDivs.length;
      let right = Math.min(
        left + this.numCommentsToPush,
        this.state.shownCommentsDivs.length
      );

      this.fetchingAuthorsProfileImgs(
        this.state.fetchedComments.slice(left)
      ).then((result) => {
        const tmpArr = [...this.state.shownCommentsDivs];
        const tmpFetchedComments = [...this.state.fetchedComments];
        for (let i = left; i < right; i++) {
          tmpFetchedComments[i].commentAuthorData.profileImage =
            result[i - left];
          tmpArr[i] = {
            ...tmpArr[i],
            props: {
              ...tmpArr[i].props,
              commentAuthorData: {
                ...tmpArr[i].props.commentAuthorData,
                profileImage: result[i - left],
              },
            },
          };
        }
        this.setState({
          shownCommentsDivs: tmpArr,
          fetchedComments: tmpFetchedComments,
        });
      });
    }
  }
*/
  componentDidMount() {
    this.handleWaitingForComments();
  }

  render() {
    let endDiv = null;
    if (this.state.noMoreComments === false && this.state.waitingForComments)
      endDiv = (
        <div id="comments-profile-section-loading-div">
          <CircularProgress />
        </div>
      );
    else if (this.state.noMoreComments === false) {
      endDiv = (
        <div>
          <Button
            style={{ width: "100%" }}
            onClick={this.handleWaitingForComments}
          >
            Load more...
          </Button>
        </div>
      );
    }

    if (!this.props.openCommentsSection) return null;
    else
      return (
        <div>
          <div className="post-comments-section">
            {this.state.shownCommentsDivs}
            {endDiv}

            <div class="post-commenting-section">
              <TextareaAutosize
                autoFocus
                rowsMin={1}
                rowsMax={8}
                ref={this.textareaRef}
                placeholder="Write a comment..."
                style={{
                  width: "100%",
                  minHeight: "34px",
                  resize: "none",
                  overflow: "auto",
                  border: "none",
                  outlineStyle: "none",
                  borderRadius: "18px",
                  fontSize: "large",
                  background: "#f0f2f5",
                  padding: "7px 0 0 15px",
                }}
              />
              <div style={{ width: "10%", position: "relative" }}>
                <Button
                  id="post-comment-send-btn"
                  style={{ width: "10px", backgroundColor: "transparent" }}
                  onClick={this.handleSendComment}
                  startIcon={<SendIcon />}
                />
              </div>
            </div>
          </div>
        </div>
      );
  }
}

export default PostCommentsSections;
