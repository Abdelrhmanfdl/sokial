import { useEffect, useRef, useState } from "react";
import Avatar from "./../images/default_profile_image.png";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";

const PostReactantEntry = (props) => {
  const profileImageRef = useRef(null);
  const [profileImage, setProfileImage] = useState(Avatar);

  useEffect(() => {
    if (props.reactantData && props.reactantData.profileImagePath) {
      fetch(
        `/get-profile-img/${props.reactantData.id}?` +
          new URLSearchParams({
            profile_image_path: props.reactantData.profileImagePath,
          })
      )
        .then((res) => {
          if (res && res.ok) return res.blob();
          else {
            const err = new Error("Can't fetch profile image");
          }
        })
        .then((res) => {
          const img = URL.createObjectURL(res);
          setProfileImage(img);
          profileImageRef.current.src = img;
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, []);

  useEffect(() => {
    if (profileImageRef.current) {
      profileImageRef.current.src = profileImage;
    }
  }, [profileImageRef.current, profileImage]);

  return (
    <div className="reactant-entry">
      <div className="profile-data">
        <a
          className="clickable-profile-image-anchor"
          href={`${window.location.origin}/profile?id=${props.reactantData.id}`}
        >
          <img className="profile-image" ref={profileImageRef} />
        </a>
        <a
          className="clickable-account-name"
          href={`${window.location.origin}/profile?id=${props.reactantData.id}`}
        >
          <div className="profile-name ">{`${props.reactantData.firstName} ${props.reactantData.lastName}`}</div>
        </a>
      </div>
      <ThumbUpAltIcon
        color={"primary"}
        style={{ alignSelf: "center", width: "30px", height: "30px" }}
      />
    </div>
  );
};

export default PostReactantEntry;
