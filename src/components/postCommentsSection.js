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
    this.numCommentsToPush = 15; // It's a parameter that can be changed

    // This variable is used to prevent making a fetch while
    // haven't get last sent fetch yet. (A problem of scrolling based fetching)
    this.fetching = false;

    this.handleSendComment = this.handleSendComment.bind(this);
    this.fetchNewComments = this.fetchNewComments.bind(this);
    this.pushToShownComments = this.pushToShownComments.bind(this);
    this.handleWaitingForComments = this.handleWaitingForComments.bind(this);
    this.handleEditComment = this.handleEditComment.bind(this);
    this.handleDeleteComment = this.handleDeleteComment.bind(this);
  }

  handleSendComment() {
    fetch(`/post/comment/${this.props.postId}`, {
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
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  handleEditComment(commentIndex, newContent) {
    fetch(`/comment/${this.state.fetchedComments[commentIndex].id}`, {
      method: "PUT",
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify({ newContent: newContent }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to edit comment");
      })
      .catch((err) => {
        console.log(err.message);
      });

    let tmpCommentsDivs = [...this.state.shownCommentsDivs];
    tmpCommentsDivs[commentIndex] = (
      <PostComment
        id={this.state.fetchedComments[commentIndex].id}
        commentIndex={commentIndex}
        content={newContent}
        authorUser={this.state.fetchedComments[commentIndex].author_user}
        profileData={this.props.profileData}
        identity={this.props.identity}
        handleEditComment={this.handleEditComment}
        handleDeleteComment={this.handleDeleteComment}
      />
    );
    this.setState({ shownCommentsDivs: tmpCommentsDivs });
  }

  handleDeleteComment(commentIndex) {
    fetch(`/comment/${this.state.fetchedComments[commentIndex].id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete comment");
      })
      .catch((err) => {
        console.log(err.message);
      });

    let tmpCommentsDivs = [...this.state.shownCommentsDivs];
    tmpCommentsDivs[commentIndex] = null;
    this.setState({ shownCommentsDivs: tmpCommentsDivs });
  }

  /*  toggleReaction(postIndex, newReactionType) {
    let tmpCommentsDivs = [...this.state.shownCommentsDivs];
    tmpCommentsDivs[postIndex] = (
      <Post
        id={this.state.fetchedComments[postIndex].id}
        postIndex={postIndex}
        myReactionType={newReactionType}
        content={this.state.fetchedComments[postIndex].content}
        autherFullName={`${this.props.profileData.firstName} ${this.props.profileData.lastName}`}
        toggleReaction={this.toggleReaction}
      />
    );
    this.setState({ shownCommentsDivs: tmpCommentsDivs });
  }
*/

  handleWaitingForComments() {
    this.setState({ waitingForComments: true });

    if (
      this.state.fetchedComments.length === this.state.shownCommentsDivs.length
    ) {
      // Need to fetch new comments
      this.fetchNewComments().then((comments) => {
        //console.log("Fetched comments >> ", comments);
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
        `/get-comments/${this.props.postId}?` +
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
            // console.log(res.comments.length);
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
      console.log(this.state.fetchedComments[i].author_user);
      tmpCommentsDivs.push(
        <PostComment
          id={this.state.fetchedComments[i].id}
          commentIndex={tmpCommentsDivs.length}
          content={this.state.fetchedComments[i].content}
          authorUser={this.state.fetchedComments[i].author_user}
          profileData={this.props.profileData}
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
            <div class="post-commenting-section">
              <TextareaAutosize
                rowsMin={2}
                rowsMax={8}
                ref={this.textareaRef}
                style={{
                  width: "100%",
                  resize: "none",
                  overflow: "auto",
                  outlineStyle: "none",
                  //borderStyle: "none",
                  borderRadius: "5px",
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
            {this.state.shownCommentsDivs}
          </div>
          {endDiv}
        </div>
      );
  }
}

export default PostCommentsSections;
