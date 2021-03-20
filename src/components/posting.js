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

const Posting = ({ identity, isMyProfile, pushingNewPost }) => {
  /*
  TODO :: Save the textarea if no posting or refreshing happened
  */

  const postingAuthorProfileImgRef = useRef(null);

  useEffect(() => {
    if (
      identity &&
      identity.profileImage &&
      postingAuthorProfileImgRef.current
    ) {
      postingAuthorProfileImgRef.current.src = identity.profileImage || " ";
    } else if (postingAuthorProfileImgRef.current) {
      postingAuthorProfileImgRef.current.src = Avatar;
    }
  }, [identity, postingAuthorProfileImgRef, window.location.href]);

  const [openDialog, setOpenDialog] = useState(false);
  const [disablePosting, setDisablePosting] = useState(true);
  const [disableWriting, setDisableWriting] = useState(false);
  const textareaRef = useRef(null);

  const handleOpenPostingDialog = () => {
    setOpenDialog(true);
  };
  const handleClosePostingDialog = () => {
    setOpenDialog(false);
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
        setOpenDialog(false);
        setDisableWriting(false);
        return res.json();
      })
      .then((res) => {
        console.log(res);
        pushingNewPost({
          postData: {
            id: res.postData.id,
            content: textareaRef.current.value,
            timestamp: res.postData.timestamp,
            privacy: res.postData.privacy,
            postType: res.postData.post_type,
            postCounters: {
              commentsCounter: res.postData.comments_counter,
              reactionsCounter: res.postData.reactions_counter,
            },
          },
          postAuthorData: {
            id: res.postData.author_user_id,
            firstName: identity.firstName,
            lastName: identity.lastName,
            profileImage: identity.profileImage,
          },
          reactions: [],
        });
      })
      .catch((res) => {
        /*
        TODO :: Handle posting failure
      */
      });
  };

  if (!isMyProfile && window.location.pathname == "/profile") return null;
  return (
    <div id="profile-posting-section" className="profile-posts-section">
      <div id="profile-posting-header">
        <img
          ref={postingAuthorProfileImgRef}
          id="wanna-posting-author-profile-img"
        ></img>
        <div
          id="profile-wanna-posting-textarea"
          onClick={handleOpenPostingDialog}
        ></div>
      </div>
      <Dialog open={openDialog} onClose={handleClosePostingDialog}>
        <DialogTitle style={{ textAlign: "center" }}>Create post</DialogTitle>
        <DialogContent
          style={{ width: "400px", height: "200px", padding: "8px 0px" }}
        >
          <TextareaAutosize
            ref={textareaRef}
            rowsMin={3}
            rowsMax={8}
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
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickPost} disabled={disablePosting}>
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Posting;
