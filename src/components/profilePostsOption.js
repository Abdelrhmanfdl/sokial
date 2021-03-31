import { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import PostsProfileSection from "./postsProfileSection";
import PublicIcon from "@material-ui/icons/Public";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import Avatar from "./../images/default_profile_image.png";

const ProfilePostsOption = (props) => {
  document.body.onscroll = null;
  const [introImages, setIntroImages] = useState([]);

  useEffect(() => {
    if (props.profileData) {
      fetch(
        `/get-number-of-profile-images/${props.profileData.id}?` +
          new URLSearchParams({
            numOfImages: 9,
          })
      )
        .then((res) => res.json())
        .then((res) => {
          // Got at most 9 images paths
          const fetchesPromises = res.results.map((path) =>
            fetch(`/get-post-image/${path}`, {
              method: "GET",
            })
          );
          return Promise.all(fetchesPromises);
        })
        .then((res) => {
          const jsonRes = res.map((x) => (x ? x.blob() : null));
          return Promise.all(jsonRes);
        })
        .then((res) => {
          const images = res.map((image) => {
            if (image) {
              const img = URL.createObjectURL(image);
              return <img src={img} />;
            }
          });
          setIntroImages(images);
        })
        .catch((err) => {
          console.log("Error:: ", err.message);
        });
    }
  }, [props.profileData]);

  return (
    <Grid
      id="profile-two-colums"
      direction="row"
      justify={"space-evenly"}
      style={{ alignItems: "start" }}
      container
    >
      <Grid id="profile-left-column" item sm={4} xs={12}>
        <div
          id="profile-posts-about-section"
          className="profile-posts-section profile-left-col-section"
          item
        >
          <h3> About Me </h3>
          {props.profileData.country ? (
            <div className="profile-about-data">
              <div class="profile-about-country data-line country-data">
                <PublicIcon style={{ marginRight: "10px" }} />
                <span>{props.profileData.country}</span>
              </div>
              <div class="profile-about-city data-line city-data">
                <LocationCityIcon style={{ marginRight: "10px" }} />
                <span>{props.profileData.city}</span>
              </div>
            </div>
          ) : null}
        </div>
        <div
          id="profile-posts-images-section"
          className="profile-posts-section profile-left-col-section"
          item
        >
          <h3> Images </h3>
          <div id="images">{introImages}</div>
        </div>
        <div
          id="profile-posts-friends-section"
          className="profile-posts-section profile-left-col-section"
          style={{ display: "none" }}
          item
        >
          <h3> Friends </h3>
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
