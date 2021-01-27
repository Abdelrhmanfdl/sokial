import {
  TextField,
  TextareaAutosize,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";

import { useFormik } from "formik";
import { useState, useRef } from "react";

const Posting = (props) => {
  /*
  TODO :: Save the textarea if no posting or refreshing happened
  */

  const [openDialog, setOpenDialog] = useState(false);
  const textareaRef = useRef(null);

  const handleOpenPostingDialog = () => {
    setOpenDialog(true);
  };
  const handleClosePostingDialog = () => {
    setOpenDialog(false);
  };

  const handleClickPost = async () => {
    const D = new Date();
    const res = await fetch("/post", {
      method: "POST",
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        content: textareaRef.current.value,
        privacy: 5 /* TODO:: Update  */,
        timestamp: `${D.getFullYear()}-${
          D.getMonth() + 1
        }-${D.getDate()} ${D.getHours()}-${D.getMinutes()}-${D.getSeconds()} `,
      }),
    });

    if (!res.ok) {
      /*
        TODO: Handle posting failure
      */
    } else {
      console.log("DONEEE");
      setOpenDialog(false);
    }
  };

  if (!props.isMyProfile) return null;
  return (
    <div id="profile-posting-section" className="profile-posts-section">
      <div id="profile-posting-header">
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
            placeholder="What's on your mind?"
            style={{
              width: "100%",
              outlineStyle: "none",
              borderStyle: "none",
              resize: "none",
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickPost}>Post</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Posting;
