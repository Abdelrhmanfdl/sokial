import { useState } from "react";
import { Button } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const PostComment = (props) => {
  const [openMore, setOpenMore] = useState(false);

  return (
    <div className="post-comment">
      <div className="comment-author-img"></div>
      <div style={{ width: "100%" }}>
        <div className="comment-author-name">
          {`${props.authorUser.first_name} ${props.authorUser.last_name}`}
        </div>

        <div className="comment-more-div">
          <Button
            id="comment-more-btn"
            disableRipple
            style={{ backgroundColor: "transparent" }}
            startIcon={<MoreVertIcon />}
            onClick={() => {
              setOpenMore(!openMore);
            }}
          />
          {openMore ? (
            <div className="comment-more-options">
              <div className="comment-more-edit">Edit</div>
              <div className="comment-more-delete">Delete</div>
            </div>
          ) : null}
        </div>

        <div className="comment-content">{props.content}</div>
      </div>
    </div>
  );
};

export default PostComment;
