import { TextField, TextareaAutosize, Grid, Button } from "@material-ui/core";

import { useState } from "react";

const Post = (props) => {
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
          <Button> React </Button>
          <Button> Comment </Button>
        </div>
      </div>
    </Grid>
  );
};

export default Post;
