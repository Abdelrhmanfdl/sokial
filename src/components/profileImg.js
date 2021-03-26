import { useState, useRef, useEffect } from "react";
import { IconButton } from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import Avatar from "./../images/default_profile_image.png";

const ProfileImg = (props) => {
  const [fetchedImage, setFetchedImage] = useState({
    isFetched: false,
    img: null,
  });
  const [choosingImg, setChoosingImg] = useState(false);
  const uploadProfileImgBtnRef = useRef(null);
  const uploadedImgRef = useRef(null);

  useEffect(() => {
    //console.log(props.profileData);
    if (uploadedImgRef.current && props.profileData.profileImage) {
      uploadedImgRef.current.src = props.profileData.profileImage;
    } else if (uploadedImgRef.current) {
      uploadedImgRef.current.src = Avatar;
    }
  }, [props.profileData.profileImage, uploadedImgRef, window.location.href]);

  const handleSelectImg = (img) => {
    // This is used when the user select an img, then he needs to confirm it or cancel.

    //console.log(URL.createObjectURL(img.target.files[0]));
    console.log(img.target.files[0]);
    uploadedImgRef.current.src = URL.createObjectURL(img.target.files[0]);
    setChoosingImg(true);
  };

  const handleCancelChoosing = (img) => {
    // This is used when the user select an img, then he needs to confirm it or cancel.

    if (!fetchedImage.img) uploadedImgRef.current.src = " ";
    else {
      const src = URL.createObjectURL(fetchedImage.img);
      uploadedImgRef.current.src = src;
    }
    setChoosingImg(false);
  };

  const handleConfirmImg = () => {
    const formData = new FormData();
    formData.append("blob", uploadProfileImgBtnRef.current.files[0]);

    fetch("/profile/set-profile-img", {
      method: "POST",
      body: formData,
    })
      .then(() => {
        window.location.reload();
        setChoosingImg(false);
      })
      .catch((err) => {
        console.log(err.message);
        handleCancelChoosing();
      });
  };

  return (
    <div id="profile-img-container">
      <div id="profile-img-frame" style={{ display: "flex" }}>
        <img id="profile-img" ref={uploadedImgRef} />

        {props.isMyProfile ? (
          <div
            id="upload-profile-img-btn"
            onClick={() => {
              uploadProfileImgBtnRef.current.click();
            }}
          >
            <input
              type="file"
              ref={uploadProfileImgBtnRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleSelectImg}
            />
            <IconButton
              disableRipple
              style={{ backgroundColor: "transparent" }}
            >
              <AddAPhotoIcon />
            </IconButton>
          </div>
        ) : null}

        {choosingImg ? (
          <>
            <div
              id="cancel-upload-profile-img-btn"
              onClick={handleCancelChoosing}
            >
              <IconButton disableRipple>
                <CancelIcon />
              </IconButton>
            </div>
            <div id="confirm-upload-profile-img-btn" onClick={handleConfirmImg}>
              <IconButton disableRipple>
                <CheckCircleIcon />
              </IconButton>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default ProfileImg;
