import { TextField, TextareaAutosize, Grid, Button } from "@material-ui/core";
import ProfileHeader from "./profileHeader";
import Posting from "./posting";
import PostsProfileSection from "./postsProfileSection";
import ProfilePostsOption from "./profilePostsOption";
import ProfileFriendsOption from "./profileFriendsOption";
import { useState, useEffect } from "react";

const Profile = (props) => {
  const [profileData, setProfileData] = useState(null);
  const [friendshipRel, setFriendshipRel] = useState(null);
  const [profileChosenOption, setProfileChosenOption] = useState("posts");

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
          setFriendshipRel(res.friendshipRel);

          if (res.userData.profile_photo_path)
            return Promise.all([
              res.userData,
              fetch(
                `/get-profile-img/${res.userData.id}?` +
                  new URLSearchParams({
                    profile_photo_path: res.userData.profile_photo_path,
                  })
              ),
            ]);
          else setProfileData(res.userData);
        }
      })
      .then(([userData, res]) => {
        if (res && res.ok) return Promise.all([userData, res.blob()]);
      })
      .then(([userData, img]) => {
        img = URL.createObjectURL(img);
        setProfileData({ ...userData, profileImg: img });
      })
      .catch((err) => {
        console.log("ERROR:", err.message);
      });
  }, [params.get("id")]);

  const isMyProfile = params.get("id") == props.identity.id;

  if (profileData === null || (!isMyProfile && !friendshipRel)) return null;
  else
    return (
      <div>
        <ProfileHeader
          setProfileChosenOption={setProfileChosenOption}
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
        {profileChosenOption == "posts" ? (
          <ProfilePostsOption
            identity={props.identity}
            isMyProfile={isMyProfile}
            profileData={profileData}
          />
        ) : profileChosenOption == "friends" ? (
          <ProfileFriendsOption
            identity={props.identity}
            isMyProfile={isMyProfile}
            profileData={profileData}
          />
        ) : null}
      </div>
    );
};

export default Profile;
