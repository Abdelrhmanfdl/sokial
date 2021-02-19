import { useState, useRef, useEffect } from "react";
import {
  MenuItem,
  Menu,
  TextareaAutosize,
  Button,
  ButtonGroup,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const PostComment = (props) => {
  const [menuAnchorElem, setMenuAnchorElem] = useState(null);
  const [editing, setEditing] = useState(false);
  const editingAreaRef = useRef(null);
  const authorProfileImgRef = useRef(null);
  const isMoreOptionsOpen = menuAnchorElem !== null;

  useEffect(() => {
    if (
      authorProfileImgRef &&
      authorProfileImgRef.current &&
      props.commentAuthor.authorProfileImg
    ) {
      authorProfileImgRef.current.src = props.commentAuthor.authorProfileImg;
    }
  }, [authorProfileImgRef, props.commentAuthor.authorProfileImg]);

  const handleOpenMoreOptions = (event) => {
    setMenuAnchorElem(event.target);
  };

  const handleCloseMoreOptions = () => {
    setMenuAnchorElem(null);
  };

  const handleClickEditComment = () => {
    setEditing(true);
    handleCloseMoreOptions();
  };

  const handleSaveEdit = () => {
    props.handleEditComment(props.commentIndex, editingAreaRef.current.value);
    setEditing(false);
    handleCloseMoreOptions();
  };

  const handleDeleteComment = () => {
    props.handleDeleteComment(props.commentIndex);
    setEditing(false);
    handleCloseMoreOptions();
  };

  return (
    <div className="post-comment">
      <a
        href={`${window.location.origin}/profile?id=${props.commentAuthor.id}`}
      >
        <img ref={authorProfileImgRef} className="comment-author-img"></img>
      </a>
      <div className="comment-right-col">
        <a
          className="clickable-account-name comment-author-name"
          href={`${window.location.origin}/profile?id=${props.commentAuthor.id}`}
        >
          {`${props.commentAuthor.first_name} ${props.commentAuthor.last_name}`}
        </a>

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
      {props.commentAuthor.id === props.identity.id ? (
        <div className="comment-more-div">
          {!editing ? (
            <Button
              id="comment-more-btn"
              // disableRipple
              disabled={editing}
              style={{ backgroundColor: "transparent" }}
              startIcon={<MoreVertIcon />}
              onClick={handleOpenMoreOptions}
            />
          ) : null}

          <Menu
            anchorEl={menuAnchorElem}
            open={isMoreOptionsOpen}
            onClose={handleCloseMoreOptions}
          >
            <MenuItem onClick={handleClickEditComment}>Edit</MenuItem>
            <MenuItem onClick={handleDeleteComment}>Delete</MenuItem>
          </Menu>
        </div>
      ) : null}
    </div>
  );
};

export default PostComment;
