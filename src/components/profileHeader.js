import { TextField, TextareaAutosize, Grid, Button } from "@material-ui/core";

const ProfileHeader = (props) => {
  return (
    <div id="profile-header-div">
      <div id="profile-cover-container"></div>
      <div id="profile-img-container">
        <div id="profile-img-frame"></div>
      </div>
      <div id="profile-name-container">{`${props.profileData.firstName} ${props.profileData.lastName}`}</div>
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
  );
};

export default ProfileHeader;
