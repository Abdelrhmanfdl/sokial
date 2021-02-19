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
- postOwnerData
- myReactionType
,- content
- identity
- toggleReaction
- handleDeletePost
- handleEditPost
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
      props.postOwnerData &&
      props.postOwnerData.profileImg
    ) {
      authorProfileImgRef.current.src = props.postOwnerData.profileImg;
    }
  }, [
    authorProfileImgRef,
    props.postOwnerData.profileImg,
    window.location.href,
  ]);

  const handleClickDeletePost = () => {
    props.handleDeletePost(props.postIndex);
    handleCloseMoreOptions(false);
  };
  const handleClickEditPost = () => {
    setEditingPost(true);
    handleCloseMoreOptions(false);
  };

  const handleToggleLike = () => {
    fetch(
      `/post/react/${props.id}?` + new URLSearchParams({ reaction_type: "1" }),
      { method: "POST" }
    ).then((res) => {
      if (!res.ok) throw new Error();
    });

    props.toggleReaction(props.postIndex, props.myReactionType ? null : "1");
  };

  return (
    <Grid id="tmp-post-container">
      <div className="post">
        <div className="post-header">
          <div className="post-identity-container">
            <a
              href={`${window.location.origin}/profile?id=${props.postOwnerData.id}`}
            >
              <img className="post-profile-photo" ref={authorProfileImgRef} />
            </a>

            <a
              className="clickable-account-name"
              href={`${window.location.origin}/profile?id=${props.postOwnerData.id}`}
            >{`${props.postOwnerData.firstName} ${props.postOwnerData.lastName}`}</a>

            {props.identity.id == props.postOwnerData.id ? (
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
          {props.content}
        </div>
        <div className="post-footer">
          <div className="post-counters">
            <div
              className="post-reaction-counter"
              hidden={props.postCounters.reactionsCounter == 0}
            >
              <ThumbUpAltIcon
                style={{
                  height: "18px",
                  position: "relative",
                  bottom: "-5px",
                }}
                color={"primary"}
              />
              {props.postCounters.reactionsCounter} Likes
            </div>
            <div
              className="post-comment-counter"
              hidden={props.postCounters.commentsCounter == 0}
              onClick={handleToggleCommentsSection}
            >
              {props.postCounters.commentsCounter} Comments
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
          postOwnerData={props.postOwnerData}
          postId={props.id}
          openCommentsSection={openCommentsSection}
        />
      </div>
      <PostEditing
        postIndex={props.postIndex}
        editingPost={editingPost}
        setEditingPost={setEditingPost}
        postContentRef={postContentRef}
        handleEditPost={props.handleEditPost}
      />
    </Grid>
  );
};

export default Post;
