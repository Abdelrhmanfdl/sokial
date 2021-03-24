import {
  TextareaAutosize,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import generalFunctions from "../usable functions/general";
import { useState, useRef, useEffect } from "react";
import Avatar from "./../images/default_profile_image.png";
import { IconButton } from "@material-ui/core";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import ClearIcon from "@material-ui/icons/Clear";

const Posting = ({ identity, isMyProfile, pushingNewPost }) => {
  /*
  TODO :: Save the textarea if no posting or refreshing happened
  */

  const [postImageIsSelected, setPostImageIsSelected] = useState(false);
  const postingAuthorProfileImageRef = useRef(null);
  const imageInputRef = useRef({});
  const selectedImageRef = useRef(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [disablePosting, setDisablePosting] = useState(true);
  const [disableWriting, setDisableWriting] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (
      identity &&
      identity.profileImage &&
      postingAuthorProfileImageRef.current
    ) {
      postingAuthorProfileImageRef.current.src = identity.profileImage || " ";
    } else if (postingAuthorProfileImageRef.current) {
      postingAuthorProfileImageRef.current.src = Avatar;
    }
  }, [identity, postingAuthorProfileImageRef, window.location.href]);

  const resetComponent = () => {
    cancelSelectedPostImage();
    setOpenDialog(false);
    setDisableWriting(false);
  };

  const handleSelectPostImage = (e) => {
    try {
      if (imageInputRef.current.files[0]) {
        console.log("hey");
        setPostImageIsSelected(true);
        const img = URL.createObjectURL(imageInputRef.current.files[0]);
        selectedImageRef.current.src = img;
      } else console.log("NOOO");
    } catch (err) {
      console.log("Error: ", err.message);
    }
  };

  const cancelSelectedPostImage = () => {
    setPostImageIsSelected(false);
    selectedImageRef.current.src = null;
    imageInputRef.current.value = "";
  };

  const handleOpenPostingDialog = () => {
    setOpenDialog(true);
  };
  const handleClosePostingDialog = () => {
    resetComponent();
  };

  const handleClickPost = () => {
    setDisablePosting(true);
    setDisableWriting(true);

    fetch("/post", {
      method: "POST",
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        content: textareaRef.current.value,
        privacy: 5 /* TODO :: Update  */,
        timestamp: generalFunctions.getTimestamp(),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Can't post.");

        return res.json();
      })
      .then((res) => {
        let fetchingImgPromise;

        if (imageInputRef.current.files[0]) {
          const formData = new FormData();

          formData.append("blob", imageInputRef.current.files[0]);

          fetchingImgPromise = fetch(`/set-post-image/${res.postData.id}`, {
            method: "POST",
            body: formData,
          });
        }

        return Promise.all([res, fetchingImgPromise]);
      })
      .then(([postRes, imgRes]) => {
        return Promise.all([postRes, imgRes ? imgRes.json() : null]);
      })
      .then(([postRes, imgRes]) => {
        console.log(imgRes);
        pushingNewPost({
          postData: {
            id: postRes.postData.id,
            content: textareaRef.current.value,
            timestamp: postRes.postData.timestamp,
            privacy: postRes.postData.privacy,
            postType: postRes.postData.post_type,
            postImageData: imgRes ? [imgRes.imageData] : [],
            postCounters: {
              commentsCounter: postRes.postData.comments_counter,
              reactionsCounter: postRes.postData.reactions_counter,
            },
          },
          postAuthorData: {
            id: postRes.postData.author_user_id,
            firstName: identity.firstName,
            lastName: identity.lastName,
            profileImage: identity.profileImage,
          },
          reactions: [],
        });
        resetComponent();
      })
      .catch((res) => {
        /*
        TODO :: Handle posting failure
      */
        resetComponent();
        console.log(res.message);
      });
  };

  if (!isMyProfile && window.location.pathname == "/profile") return null;
  return (
    <div id="profile-posting-section" className="profile-posts-section">
      <div id="profile-posting-header">
        <img
          ref={postingAuthorProfileImageRef}
          id="wanna-posting-author-profile-img"
        ></img>
        <div
          id="profile-wanna-posting-textarea"
          onClick={handleOpenPostingDialog}
        ></div>
      </div>
      <Dialog
        className="posting-dialoge"
        open={openDialog}
        onClose={handleClosePostingDialog}
      >
        <DialogTitle style={{ textAlign: "center" }}>Create post</DialogTitle>
        <DialogContent>
          <TextareaAutosize
            ref={textareaRef}
            rowsMin={3}
            //rowsMax={8}
            autoFocus
            disabled={disableWriting}
            placeholder="What's on your mind?"
            onInput={() => {
              if (textareaRef.current.value.trim() == "") {
                setDisablePosting(true);
              } else if (disablePosting) setDisablePosting(false);
            }}
            style={{
              width: "100%",
              outlineStyle: "none",
              borderStyle: "none",
              resize: "none",
              padding: "0px 12px",
              fontSize: "20px",
            }}
          />
          <div id="posting-input-image-div">
            {postImageIsSelected ? (
              <IconButton
                id="cancel-btn-selected-posting-image"
                onClick={cancelSelectedPostImage}
              >
                <ClearIcon />
              </IconButton>
            ) : null}

            <img
              className="posting-selecting-img"
              ref={selectedImageRef}
              hidden={!postImageIsSelected}
            />
          </div>
        </DialogContent>
        <DialogActions
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <IconButton
            onClick={() => {
              imageInputRef.current.click();
            }}
          >
            <PhotoCameraIcon />
          </IconButton>
          <input
            accept="image/*"
            type="file"
            style={{ display: "none" }}
            ref={imageInputRef}
            onChange={handleSelectPostImage}
          />
          <Button
            onClick={handleClickPost}
            disabled={disablePosting && !postImageIsSelected}
          >
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Posting;
