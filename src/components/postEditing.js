import {
  TextareaAutosize,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import generalFunctions from "../usable functions/general";
import { useState, useRef } from "react";

const PostEditing = (props) => {
  const [disablePosting, setDisablePosting] = useState(true);
  const [disableWriting, setDisableWriting] = useState(false);
  const textareaRef = useRef(null);

  const handleClosePostingDialog = () => {
    props.setEditingPost(false);
  };

  const handleClickSave = () => {
    setDisablePosting(true);
    setDisableWriting(false);
    props.handleEditPost(props.postIndex, textareaRef.current.value);
    handleClosePostingDialog();
  };

  if (!props.postContentRef.current) return null;
  return (
    <Dialog open={props.editingPost} onClose={handleClosePostingDialog}>
      <DialogTitle style={{ textAlign: "center" }}>Post Editing</DialogTitle>
      <DialogContent
        style={{ width: "400px", height: "200px", padding: "8px 0px" }}
      >
        <TextareaAutosize
          ref={textareaRef}
          rowsMin={3}
          rowsMax={8}
          autoFocus
          disabled={disableWriting}
          defaultValue={String(
            props.postContentRef.current.firstChild.textContent
          )}
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
        <Button onClick={handleClickSave} disabled={disablePosting}>
          Save
        </Button>
        <Button onClick={handleClosePostingDialog}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PostEditing;
