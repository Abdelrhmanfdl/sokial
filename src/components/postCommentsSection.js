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
    this.fetchingAuthorsProfileImgs = this.fetchingAuthorsProfileImgs.bind(
      this
    );
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
        c
        commentAuthor={{
          ...this.state.fetchedComments[commentIndex].author_user,
          authorProfileImg: this.state.fetchedComments[commentIndex]
            .authorProfileImg,
        }}
        postOwnerData={this.props.postOwnerData}
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
      //console.log(this.state.fetchedComments[i].author_user);
      tmpCommentsDivs.push(
        <PostComment
          id={this.state.fetchedComments[i].id}
          commentIndex={tmpCommentsDivs.length}
          content={this.state.fetchedComments[i].content}
          commentAuthor={{
            ...this.state.fetchedComments[i].author_user,
            authorProfileImg: this.state.fetchedComments[i].authorProfileImg,
          }}
          postOwnerData={this.props.postOwnerData}
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

  fetchingAuthorsProfileImgs(comments) {
    return new Promise((resolve, reject) => {
      const allFetchPromises = [];
      for (let i = 0; i < comments.length; i++) {
        allFetchPromises.push(
          fetch(
            `/get-profile-img/${comments[i].author_user.id}?` +
              new URLSearchParams({
                profile_photo_path: comments[i].author_user.profile_photo_path,
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
        let tmpArr = [...this.state.shownCommentsDivs];
        for (let i = left; i < right; i++) {
          tmpArr[i] = (
            <PostComment
              id={this.state.fetchedComments[i].id}
              commentIndex={i}
              content={this.state.fetchedComments[i].content}
              commentAuthor={{
                ...this.state.fetchedComments[i].author_user,
                authorProfileImg: result[i - left],
              }}
              postOwnerData={this.props.postOwnerData}
              identity={this.props.identity}
              handleEditComment={this.handleEditComment}
              handleDeleteComment={this.handleDeleteComment}
            />
          );
        }
        this.setState({ shownCommentsDivs: tmpArr });

        tmpArr = [...this.state.fetchedComments];
        for (let i = left; i < right; i++) {
          tmpArr[i].authorProfileImg = result[i - left];
        }
        this.setState({ fetchedComments: tmpArr });
      });
    }
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
