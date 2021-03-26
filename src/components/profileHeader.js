import { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import ProfileImg from "./profileImg";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { friendshipRelatedFunctions } from "../usable functions/endpoint-related";

const ProfileHeader = (props) => {
  const friendshipButtonsAttr = {
    variant: "outlined",
    color: "primary",
  };

  useEffect(() => {
    console.log("new");
  }, []);

  const friendshipRelButton = props.isMyProfile ? null : props.areFriends ? (
    <Button
      {...friendshipButtonsAttr}
      startIcon={<RemoveCircleIcon />}
      onClick={() => {
        friendshipRelatedFunctions.handleUnfriendClick(props.profileData.id);
      }}
    >
      Unfriend
    </Button>
  ) : !props.thereIsFrReq ? (
    <Button
      {...friendshipButtonsAttr}
      startIcon={<AddCircleIcon />}
      onClick={() => {
        friendshipRelatedFunctions.handleAddFriendClick(props.profileData.id);
      }}
    >
      Add Friend
    </Button>
  ) : props.didISendFrReq ? (
    <Button
      {...friendshipButtonsAttr}
      startIcon={<CancelIcon />}
      onClick={() => {
        friendshipRelatedFunctions.handleUnrequestFriendship(
          props.profileData.id
        );
      }}
    >
      Unrequest friendship
    </Button>
  ) : (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <Button
        {...friendshipButtonsAttr}
        startIcon={<CheckCircleIcon />}
        onClick={() => {
          friendshipRelatedFunctions.handleAcceptFriendship(
            props.profileData.id
          );
        }}
      >
        Accept friendship
      </Button>

      <Button
        {...friendshipButtonsAttr}
        startIcon={<CancelIcon color={"secondary"} />}
        onClick={() => {
          friendshipRelatedFunctions.handleRejectFriendship(
            props.profileData.id
          );
        }}
      >
        Reject friendship
      </Button>
    </div>
  );
  //    console.log("zz: ", props.profileData);
  return (
    <div id="profile-header-div">
      <div id="profile-cover-container"></div>
      <ProfileImg
        profileData={props.profileData}
        isMyProfile={props.isMyProfile}
      />

      <div id="profile-name-container">{`${props.profileData.firstName} ${props.profileData.lastName}`}</div>
      <div id="profile-friendship-buttons-div">{friendshipRelButton}</div>
      <div id="profile-header-options-container">
        <Button
          id="profile-header-posts-option-btn"
          size="large"
          onClick={() => {
            props.setProfileChosenOption("posts");
          }}
        >
          Posts
        </Button>
        <Button
          id="profile-header-friends-option-btn"
          size="large"
          onClick={() => {
            props.setProfileChosenOption("friends");
          }}
        >
          Friends
        </Button>
        <Button id="profile-header-about-option-btn" size="large">
          About
        </Button>

        <Button id="profile-header-images-option-btn" size="large">
          Images
        </Button>
      </div>
    </div>
  );
};

export default ProfileHeader;
