import { MenuItem, Menu, Grid, Button } from "@material-ui/core";
import PostCommentsSections from "./postCommentsSection";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useState, useRef, useEffect } from "react";
import PostEditing from "./postEditing";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ThumbUpOutlinedIcon from "@material-ui/icons/ThumbUpOutlined";
import CommentOutlinedIcon from "@material-ui/icons/CommentOutlined";
import PostReactantsModal from "./postReactantsModal";
import Avatar from "./../images/default_profile_image.png";
import { set } from "date-fns";

const Post = (props) => {
  const [openCommentsSection, setOpenCommentsSection] = useState(false);
  const [menuAnchorElem, setMenuAnchorElem] = useState(null);
  const [editingPost, setEditingPost] = useState(false);
  const [reactantsModalOpen, setReactantsModalOpen] = useState(false);
  const postContentRef = useRef(null);
  const postImageRef = useRef(null);
  const authorProfileImgRef = useRef(null);
  const isMoreOptionsOpen = menuAnchorElem !== null;

  const openReactantsModal = () => {
    setReactantsModalOpen(true);
  };
  const closeReactantsModal = () => {
    setReactantsModalOpen(false);
  };

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
    // Fetch post image if exists

    if (props.postData.postImageData.length) {
      fetch(`/get-post-image/${props.postData.postImageData[0].image_path}`, {
        method: "GET",
      })
        .then((res) => {
          if (res && res.ok) return res.blob();
        })
        .then((res) => {
          //console.log(props.postData.postImageData[0].image_path);
          const img = URL.createObjectURL(res);
          postImageRef.current.src = img || " ";
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, []);

  useEffect(() => {
    if (authorProfileImgRef.current && props.postAuthorData.profileImage) {
      authorProfileImgRef.current.src = props.postAuthorData.profileImage;
    } else authorProfileImgRef.current.src = Avatar;
  }, [
    authorProfileImgRef,
    props.postAuthorData.profileImage,
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
    props.toggleReaction(props.postIndex, props.myReactionType ? null : "1");
    fetch(
      `/post/react/${props.postData.id}?` +
        new URLSearchParams({ reaction_type: "1" }),
      { method: "POST" }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Can't react");
        else return res.json();
      })
      .then((res) => {
        props.updatePostCounters(props.postIndex, res.post_counters);
      })
      .catch((err) => {
        console.log("Error", err.message);
      });
  };

  return (
    <Grid id="tmp-post-container">
      {reactantsModalOpen ? (
        <PostReactantsModal
          postData={props.postData}
          closeModal={closeReactantsModal}
        />
      ) : null}

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
          <div class="post-content-text">{props.postData.content}</div>

          {props.postData.postImageData.length ? (
            <div className="post-image-div">
              <img ref={postImageRef} className="post-image" />
            </div>
          ) : null}
        </div>

        <div className="post-footer">
          {props.postData.postCounters.reactionsCounter ||
          props.postData.postCounters.commentsCounter ? (
            <div className="post-counters">
              <div
                className="post-reaction-counter"
                hidden={props.postData.postCounters.reactionsCounter == 0}
                onClick={openReactantsModal}
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
          ) : null}

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
              disableRipple
            >
              Like
            </Button>
            <Button
              onClick={handleToggleCommentsSection}
              color={"inherit"}
              startIcon={<CommentOutlinedIcon color="inherit" />}
              disableRipple
            >
              Comment
            </Button>
          </div>
        </div>
        <PostCommentsSections
          key={props.postData.id}
          identity={props.identity}
          postAuthorData={props.postAuthorData}
          postData={props.postData}
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
