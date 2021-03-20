import { MenuItem, Menu, Grid, Button } from "@material-ui/core";
import PostCommentsSections from "./postCommentsSection";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useState, useRef, useEffect } from "react";
import PostEditing from "./postEditing";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ThumbUpOutlinedIcon from "@material-ui/icons/ThumbUpOutlined";
import CommentOutlinedIcon from "@material-ui/icons/CommentOutlined";
import { set } from "date-fns";

/*
Props: 
- id: post id
- postIndex
- postAuthorData
- myReactionType
- content
- identity
- toggleReaction
- handleDeletePost
- handleEditPost
- specificStyle
*/

const Post = (props) => {
  const [openCommentsSection, setOpenCommentsSection] = useState(false);
  const [menuAnchorElem, setMenuAnchorElem] = useState(null);
  const [editingPost, setEditingPost] = useState(false);

  const postContentRef = useRef(null);
  const authorProfileImgRef = useRef(null);
  const isMoreOptionsOpen = menuAnchorElem !== null;

  const handleOpenMoreOptions = (event) => {
    setMenuAnchorElem(event.target);
  };

  const handleCloseMoreOptions = (event) => {
    setMenuAnchorElem(null);
  };

  const handleToggleCommentsSection = () => {
    setOpenCommentsSection(!openCommentsSection);
  };

  useEffect(() => {
    if (
      authorProfileImgRef.current &&
      props.postAuthorData &&
      props.postAuthorData.profileImage
    ) {
      authorProfileImgRef.current.src = props.postAuthorData.profileImage;
    }
  }, [
    authorProfileImgRef,
    props.postAuthorData.profileImage,
    window.location.href,
  ]);

  const handleClickDeletePost = () => {
    props.handleDeletePost(props.postData.postIndex);
    handleCloseMoreOptions(false);
  };
  const handleClickEditPost = () => {
    setEditingPost(true);
    handleCloseMoreOptions(false);
  };

  const handleToggleLike = () => {
    props.toggleReaction(
      props.postData.postIndex,
      props.myReactionType ? null : "1"
    );
    fetch(
      `/post/react/${props.postData.id}?` +
        new URLSearchParams({ reaction_type: "1" }),
      { method: "POST" }
    ).then((res) => {
      if (!res.ok) throw new Error();
    });
  };

  return (
    <Grid id="tmp-post-container">
      <div className="post" style={{ ...props.specificStyle }}>
        <div className="post-header">
          <div className="post-identity-container">
            <a
              href={`${window.location.origin}/profile?id=${props.postAuthorData.id}`}
            >
              <img className="post-profile-image" ref={authorProfileImgRef} />
            </a>

            <a
              className="clickable-account-name"
              href={`${window.location.origin}/profile?id=${props.postAuthorData.id}`}
            >{`${props.postAuthorData.firstName} ${props.postAuthorData.lastName}`}</a>

            {props.identity.id == props.postAuthorData.id ? (
              <div className="post-more-div">
                <Menu
                  open={isMoreOptionsOpen}
                  anchorEl={menuAnchorElem}
                  onClose={handleCloseMoreOptions}
                  keepMounted
                >
                  <MenuItem onClick={handleClickEditPost}> Edit</MenuItem>
                  <MenuItem onClick={handleClickDeletePost}> Delete </MenuItem>
                </Menu>

                <Button
                  id="post-more-btn"
                  disableRipple
                  style={{ backgroundColor: "transparent" }}
                  startIcon={<MoreVertIcon />}
                  onClick={handleOpenMoreOptions}
                />
              </div>
            ) : null}
          </div>
        </div>

        <div ref={postContentRef} className="post-content">
          {props.postData.content}
        </div>
        <div className="post-footer">
          <div className="post-counters">
            <div
              className="post-reaction-counter"
              hidden={props.postData.postCounters.reactionsCounter == 0}
            >
              <ThumbUpAltIcon
                style={{
                  height: "18px",
                  position: "relative",
                  bottom: "-5px",
                }}
                color={"primary"}
              />
              {props.postData.postCounters.reactionsCounter} Likes
            </div>
            <div
              className="post-comment-counter"
              hidden={props.postData.postCounters.commentsCounter == 0}
              onClick={handleToggleCommentsSection}
            >
              {props.postData.postCounters.commentsCounter} Comments
            </div>
          </div>
          <div className="post-btns">
            <Button
              onClick={handleToggleLike}
              color={props.myReactionType ? "primary" : "inherit"}
              startIcon={
                props.myReactionType ? (
                  <ThumbUpAltIcon color={"primary"} />
                ) : (
                  <ThumbUpOutlinedIcon color={"inherit"} />
                )
              }
            >
              Like
            </Button>
            <Button
              onClick={handleToggleCommentsSection}
              color={"inherit"}
              startIcon={<CommentOutlinedIcon color="inherit" />}
            >
              Comment
            </Button>
          </div>
        </div>
        <PostCommentsSections
          identity={props.identity}
          postAuthorData={props.postAuthorData}
          postData={props.postData}
          openCommentsSection={openCommentsSection}
        />
      </div>
      <PostEditing
        postIndex={props.postData.postIndex}
        editingPost={editingPost}
        setEditingPost={setEditingPost}
        postContentRef={postContentRef}
        handleEditPost={props.handleEditPost}
      />
    </Grid>
  );
};

export default Post;
