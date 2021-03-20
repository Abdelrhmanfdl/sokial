import { TextField, TextareaAutosize, Grid, Button } from "@material-ui/core";
import PostsProfileSection from "./postsProfileSection";
import { useState, useEffect } from "react";

const ProfilePostsOption = (props) => {
  document.body.onscroll = null;
  return (
    <Grid
      id="profile-two-colums"
      direction="row"
      justify={"space-evenly"}
      container
    >
      <Grid id="profile-left-column" item sm={4} xs={12}>
        <div
          id="profile-posts-about-section"
          className="profile-posts-section"
          item
        >
          About
        </div>
        <div
          id="profile-posts-images-section"
          className="profile-posts-section"
          item
        >
          Images
        </div>
        <div
          id="profile-posts-friends-section"
          className="profile-posts-section"
          item
        >
          Friends
        </div>
      </Grid>

      <Grid id="profile-right-column" item sm={7} lg={7} xs={12}>
        <PostsProfileSection
          identity={props.identity}
          isMyProfile={props.isMyProfile}
          profileId={props.profileData.id}
          profileData={props.profileData}
        />
      </Grid>
    </Grid>
  );
};

export default ProfilePostsOption;
