import { TextField, TextareaAutosize, Grid, Button } from "@material-ui/core";
import PostCommentsSections from "./postCommentsSection";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useState, useRef } from "react";
import PostEditing from "./postEditing";

const Post = (props) => {
  const [openCommentsSection, setOpenCommentsSection] = useState(false);
  const [openMore, setOpenMore] = useState(false);
  const [editingPost, setEditingPost] = useState(false);

  const postContentRef = useRef(null);

  const handleClickDeletePost = () => {
    props.handleDeletePost(props.postIndex);
    setOpenMore(false);
  };
  const handleClickEditPost = () => {
    setEditingPost(true);
    setOpenMore(false);
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
            <div className="post-profile-photo" />
            <small style={{ fontWeight: "bold" }}>{props.autherFullName}</small>

            {props.identity.id == props.author_user_id ? (
              <div className="post-more-div">
                <Button
                  id="post-more-btn"
                  disableRipple
                  //disabled={editing}
                  style={{ backgroundColor: "transparent" }}
                  startIcon={<MoreVertIcon />}
                  onClick={() => {
                    setOpenMore(!openMore);
                  }}
                />
                {openMore ? (
                  <div className="post-more-options">
                    <div
                      className="post-more-edit"
                      onClick={handleClickEditPost}
                    >
                      Edit
                    </div>
                    <div
                      className="post-more-delete"
                      onClick={handleClickDeletePost}
                    >
                      Delete
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        <div ref={postContentRef} className="post-content">
          {props.content}
        </div>
        <div className="post-footer">
          <Button
            onClick={handleToggleLike}
            color={props.myReactionType ? "secondary" : "default"}
            variant={props.myReactionType ? "contained" : "default"}
          >
            Like
          </Button>
          <Button
            onClick={() => {
              setOpenCommentsSection(!openCommentsSection);
            }}
          >
            Comment
          </Button>
        </div>
        <PostCommentsSections
          identity={props.identity}
          profileData={props.profileData}
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
