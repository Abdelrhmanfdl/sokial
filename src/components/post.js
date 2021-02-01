import { TextField, TextareaAutosize, Grid, Button } from "@material-ui/core";
import PostCommentsSections from "./postCommentsSection";
import { useState } from "react";

const Post = (props) => {
  const [openCommentsSection, setOpenCommentsSection] = useState(false);

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
          </div>
        </div>

        <div className="post-content">{props.content}</div>
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
          postId={props.id}
          openCommentsSection={openCommentsSection}
        />
      </div>
    </Grid>
  );
};

export default Post;
