import { TextField, TextareaAutosize, Grid, Button } from "@material-ui/core";
import ProfileHeader from "./profileHeader";
import Posting from "./posting";
import PostsProfileSection from "./postsProfileSection";
import { useState, useEffect } from "react";

const Profile = (props) => {
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
  });

  // Get the userId in the path (want to get his profile)
  const params = new URLSearchParams(window.location.search);

  if (params.get("id") === null) {
    // then it's my profile
    window.location.replace(
      `${window.location.origin}/profile?id=${props.identity.id}`
    );
  }

  // Get basic data of current profile
  useEffect(() => {
    fetch(`/get-basic-user-data/${params.get("id")}`, {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (!res.valid) throw new Error(res.message);
        else {
          setProfileData(res.userData);
          console.log(">>>", profileData);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const isMyProfile = params.get("id") == props.identity.id;

  return (
    <div id="profile">
      <ProfileHeader profileData={profileData} />
      <Grid
        id="profile-two-colums"
        direction="row"
        justify={"space-evenly"}
        container
      >
        <Grid id="profile-left-column" item sm={5} xs={12}>
          <div
            id="profile-posts-about-section"
            className="profile-posts-section"
            item
          >
            About
          </div>
          <div
            id="profile-posts-photos-section"
            className="profile-posts-section"
            item
          >
            Photos
          </div>
          <div
            id="profile-posts-friends-section"
            className="profile-posts-section"
            item
          >
            Friends
          </div>
        </Grid>

        <Grid id="profile-right-column" item sm={6} xs={12}>
          <Posting
            identity={props.identity}
            isMyProfile={isMyProfile}
            profileData={profileData}
          />
          <PostsProfileSection
            identity={props.identity}
            isMyProfile={isMyProfile}
            profileId={params.get("id")}
            profileData={profileData}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Profile;
