import { useState, useRef } from "react";
import { TextareaAutosize, Button, ButtonGroup } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const PostComment = (props) => {
  const [openMore, setOpenMore] = useState(false);
  const [editing, setEditing] = useState(false);
  const editingAreaRef = useRef(null);

  const handleClickEditComment = () => {
    setEditing(true);
    setOpenMore(false);
  };

  const handleSaveEdit = () => {
    props.handleEditComment(props.commentIndex, editingAreaRef.current.value);
    setEditing(false);
    setOpenMore(false);
  };

  const handleDeleteComment = () => {
    props.handleDeleteComment(props.commentIndex);
    setEditing(false);
    setOpenMore(false);
  };

  return (
    <div className="post-comment">
      <div className="comment-author-img"></div>
      <div style={{ width: "100%" }}>
        <div className="comment-author-name">
          {`${props.commentAuthor.first_name} ${props.commentAuthor.last_name}`}
        </div>

        {props.commentAuthor.id === props.identity.id ? (
          <div className="comment-more-div">
            {!editing ? (
              <Button
                id="comment-more-btn"
                disableRipple
                disabled={editing}
                style={{ backgroundColor: "transparent" }}
                startIcon={<MoreVertIcon />}
                onClick={() => {
                  setOpenMore(!openMore);
                }}
              />
            ) : null}

            {openMore ? (
              <div className="comment-more-options">
                <div
                  className="comment-more-edit"
                  onClick={handleClickEditComment}
                >
                  Edit
                </div>
                <div
                  className="comment-more-delete"
                  onClick={handleDeleteComment}
                >
                  Delete
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="comment-content">
          {!editing ? (
            props.content
          ) : (
            <div
              class="post-commenting-section"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <TextareaAutosize
                rowsMin={2}
                rowsMax={8}
                ref={editingAreaRef}
                defaultValue={props.content}
                style={{
                  width: "100%",
                  resize: "none",
                  overflow: "auto",
                  outlineStyle: "none",
                  borderRadius: "5px",
                }}
              />
              <div>
                <ButtonGroup
                  style={{ marginTop: "5px" }}
                  orientation={"horizontal"}
                >
                  <Button onClick={handleSaveEdit} style={{ width: "50%" }}>
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setEditing(false);
                    }}
                    style={{ width: "50%" }}
                  >
                    Cancel
                  </Button>
                </ButtonGroup>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostComment;
