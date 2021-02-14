import { TextField, TextareaAutosize, Grid, Button } from "@material-ui/core";
import ProfileHeader from "./profileHeader";
import Posting from "./posting";
import PostsProfileSection from "./postsProfileSection";
import { useState, useEffect } from "react";

const Profile = (props) => {
  const [profileData, setProfileData] = useState(null);
  const [friendshipRel, setFriendshipRel] = useState(null);

  // Get the userId in the path (want to get this profile)
  const params = new URLSearchParams(window.location.search);

  if (params.get("id") === null) {
    // then it's my profile
    window.location.replace(
      `${window.location.origin}/profile?id=${props.identity.id}`
    );
  }

  // Get basic data of current profile
  useEffect(() => {
    fetch(
      `/get-basic-user-data/${params.get("id")}?` +
        new URLSearchParams({
          getFriendshipRel: !isMyProfile,
        }),
      {
        method: "GET",
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (!res.valid) throw new Error(res.message);
        else {
          setProfileData(res.userData);
          setFriendshipRel(res.friendshipRel);
        }
      })
      .catch((err) => {
        console.log("ERROR:", err.message);
      });
  }, [params.get("id")]);

  const isMyProfile = params.get("id") == props.identity.id;

  if (profileData === null || (!isMyProfile && !friendshipRel)) return null;
  else
    return (
      <div id="profile">
        <ProfileHeader
          profileData={profileData}
          isMyProfile={isMyProfile}
          areFriends={isMyProfile ? undefined : friendshipRel.areFriends}
          thereIsFrReq={
            friendshipRel &&
            (friendshipRel.friendshipReqSenderId ||
              friendshipRel.friendshipReqReceiverId)
          }
          didISendFrReq={
            isMyProfile
              ? undefined
              : friendshipRel.friendshipReqSenderId === props.identity.id
          }
        />
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

          <Grid id="profile-right-column" item sm={5} lg={5} xs={12}>
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
