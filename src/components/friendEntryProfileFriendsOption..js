import { useState, useRef, useEffect } from "react";
import { Grid, Button, IconButton } from "@material-ui/core";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import Avatar from "./../images/default_profile_image.png";

const FriendEntryProfileFriendsOption = ({
  friendData,
  entryIndex,
  identity,
}) => {
  const [profileImg, setProfileImg] = useState(null);
  const profileImgRef = useRef(null);

  // Setting profile image
  useEffect(() => {
    if (profileImg && profileImgRef.current) {
      profileImgRef.current.src = profileImg;
    } else if (profileImgRef.current) {
      profileImgRef.current.src = Avatar;
    }
  }, [profileImg, profileImgRef]);

  // To fetch profile image
  useEffect(() => {
    if (entryIndex < 10) console.log(entryIndex);
    if (friendData.profileImgPath)
      // If the profile image path is not null
      fetch(
        `/get-profile-img/${friendData.id}?` +
          new URLSearchParams({
            profile_photo_path: friendData.profileImgPath,
          })
      )
        .then((res) => {
          if (res.ok) return res.blob();
          else
            throw new Error(
              `Can't fetch profile image of the friend ${friendData.id}`
            );
        })
        .then((img) => {
          setProfileImg(URL.createObjectURL(img));
        })
        .catch((err) => {
          console.log(err.message);
        });
  }, [friendData.profileImgPath]);

  return (
    <Grid item className="friend-entry" xs={12} sm={6} lg={6}>
      <div className="friend-entry-left-col">
        <a href={`${window.location.origin}/profile?id=${friendData.id}`}>
          <img className="friend-entry-profile-img" ref={profileImgRef} />
        </a>

        <a
          className="friend-entry-profile-name clickable-account-name"
          href={`${window.location.origin}/profile?id=${friendData.id}`}
        >
          {`${friendData.firstName} ${friendData.lastName}`}
        </a>
      </div>

      {identity.id !== friendData.id ? (
        <IconButton>
          <MoreHorizIcon />
        </IconButton>
      ) : null}
    </Grid>
  );
};

export default FriendEntryProfileFriendsOption;
