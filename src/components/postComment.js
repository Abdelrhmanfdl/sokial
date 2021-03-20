import { useState, useRef, useEffect } from "react";
import {
  MenuItem,
  Menu,
  TextareaAutosize,
  Button,
  ButtonGroup,
} from "@material-ui/core";
import Avatar from "./../images/default_profile_image.png";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const PostComment = (props) => {
  const [commentAuthorProfileImage, setCommentAuthorProfileImage] = useState(
    null
  );
  const [menuAnchorElem, setMenuAnchorElem] = useState(null);
  const [editing, setEditing] = useState(false);
  const editingAreaRef = useRef(null);
  const authorProfileImgRef = useRef(null);
  const isMoreOptionsOpen = menuAnchorElem !== null;

  useEffect(() => {
    // Component did mount, Fetch image
    if (props.commentAuthorData.profileImagePath) {
      fetch(
        `/get-profile-img/${props.commentAuthorData.id}?` +
          new URLSearchParams({
            profile_image_path: props.commentAuthorData.profileImagePath,
          })
      )
        .then((res) => {
          if (res && res.ok) return res.blob();
        })
        .then((res) => {
          const img = URL.createObjectURL(res);
          setCommentAuthorProfileImage(img);
        })
        .catch((err) => {});
    }
  }, []);

  useEffect(() => {
    if (
      authorProfileImgRef &&
      authorProfileImgRef.current &&
      commentAuthorProfileImage
    ) {
      authorProfileImgRef.current.src = commentAuthorProfileImage;
    } else if (authorProfileImgRef.current) {
      authorProfileImgRef.current.src = Avatar;
    }
  }, [authorProfileImgRef, commentAuthorProfileImage]);

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
    props.handleEditComment(
      props.commentData.commentIndex,
      editingAreaRef.current.value
    );
    setEditing(false);
    handleCloseMoreOptions();
  };

  const handleDeleteComment = () => {
    props.handleDeleteComment(props.commentData.commentIndex);
    setEditing(false);
    handleCloseMoreOptions();
  };

  return (
    <div className="post-comment">
      <a
        href={`${window.location.origin}/profile?id=${props.commentAuthorData.id}`}
      >
        <img ref={authorProfileImgRef} className="comment-author-img"></img>
      </a>
      <div className="comment-right-col">
        <a
          className="clickable-account-name comment-author-name"
          href={`${window.location.origin}/profile?id=${props.commentAuthorData.id}`}
        >
          {`${props.commentAuthorData.firstName} ${props.commentAuthorData.lastName}`}
        </a>

        <div className="comment-content">
          {!editing ? (
            props.commentData.content
          ) : (
            <div
              class="post-commenting-section"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <TextareaAutosize
                rowsMin={2}
                rowsMax={8}
                ref={editingAreaRef}
                defaultValue={props.commentData.content}
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
      {props.commentAuthorData.id === props.identity.id ? (
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
