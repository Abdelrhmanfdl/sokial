import { TextField, TextareaAutosize, Grid, Button } from "@material-ui/core";

const Profile = (props) => {
  return (
    <div id="profile">
      <div id="profile-header-div">
        <div id="profile-cover-container"></div>
        <div id="profile-img-container">
          <div id="profile-img-frame"></div>
        </div>
        <div id="profile-name-container">Abdelrhman Ahmed Fadl</div>
        <div id="profile-header-options-container">
          <Button id="profile-header-posts-option-btn" size="large">
            Posts
          </Button>
          <Button id="profile-header-about-option-btn" size="large">
            About
          </Button>
          <Button id="profile-header-friends-option-btn" size="large">
            Friends
          </Button>
          <Button id="profile-header-photos-option-btn" size="large">
            Photos
          </Button>
        </div>
      </div>
      <Grid
        id="profile-two-colums"
        direction="row"
        justify={"space-evenly"}
        container
      >
        <Grid id="profile-left-column" item sm={5} xs={12}>
          <div
            id="profile-posts-about-section"
            className="profile-posts-section"
            item
          >
            About
          </div>
          <div
            id="profile-posts-photos-section"
            className="profile-posts-section"
            item
          >
            Photos
          </div>
          <div
            id="profile-posts-friends-section"
            className="profile-posts-section"
            item
          >
            Friends
          </div>
        </Grid>
        <Grid
          id="profile-posts-section"
          className="profile-posts-section"
          item
          sm={6}
          xs={12}
        >
          POSTS
          <div id="profile-posting-section">
            <TextareaAutosize
              aria-label="empty textarea"
              placeholder="What's in your mind?"
              style={{
                width: "100%",
                height: "90px",
                outlineStyle: "none",
                borderStyle: "none",
              }}
            />
            <Button>Post</Button>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Profile;
