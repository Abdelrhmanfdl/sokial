import { Grid } from "@material-ui/core";
import { useState, useEffect } from "react";
import FriendEntryProfileFriendsOption from "./friendEntryProfileFriendsOption.";

const ProfileFriendsOption = ({ identity, profileData }) => {
  const numToShow = 40;
  const [noMoreFriends, setNoMoreFriedns] = useState(false);
  const [waitingForMoreFriends, setWaitingForMoreFriends] = useState(true);
  const [fetchedFriends, setFetchedFriends] = useState([]);
  const [friendsDivs, setFriendsDivs] = useState([]);

  const isNearToBottom = () => {
    return (
      document.body.getBoundingClientRect().bottom <= window.innerHeight * 5
    );
  };

  const pushMoreFriendsToView = () => {
    let leftPtr = friendsDivs.length;
    let rightPtr = Math.min(fetchedFriends.length, leftPtr + numToShow);
    let tmpArr = [];

    for (let i = leftPtr; i < rightPtr; i++) {
      tmpArr.push(
        <FriendEntryProfileFriendsOption
          friendData={{
            id: fetchedFriends[i].id,
            firstName: fetchedFriends[i].first_name,
            lastName: fetchedFriends[i].last_name,
            profileImgPath: fetchedFriends[i].profile_photo_path,
          }}
          identity={identity}
          entryIndex={tmpArr.length + friendsDivs.length}
        />
      );
    }

    setWaitingForMoreFriends(false);
    setFriendsDivs(friendsDivs.concat(tmpArr));
  };

  document.body.onscroll = () => {
    console.log(
      fetchedFriends.length,
      "wait: ",
      waitingForMoreFriends,
      noMoreFriends
    );
    if (!noMoreFriends && isNearToBottom() && !waitingForMoreFriends) {
      setWaitingForMoreFriends(true);
    }
  };

  // To fetch
  useEffect(() => {
    fetch(`/get-friends?friendsOfId=${profileData.id}`, { method: "GET" })
      .then((res) => {
        if (res.ok) return res.json();
        else throw new Error("Can't fetch friends");
      })
      .then((res) => {
        console.log("Friends", res);
        setFetchedFriends(res.friends);
      })
      .catch((err) => {
        console.log("ERROR :: ", err.message);
      });
  }, []);

  // See if all is done
  useEffect(() => {
    if (friendsDivs.length === fetchedFriends.length) {
      setNoMoreFriedns(true);
    }
  }, [friendsDivs.length]);

  // To take a safe space, if there is some news in the fetchedFriends array, then may be there is more.
  useEffect(() => {
    setNoMoreFriedns(false);
  }, [fetchedFriends.length]);

  //  If waiting, go and push more entries
  useEffect(() => {
    if (waitingForMoreFriends && !noMoreFriends) {
      pushMoreFriendsToView();
    }
  }, [waitingForMoreFriends]);

  return (
    <Grid container id="profile-friends-option-friends-container" spacing={1}>
      {friendsDivs}
    </Grid>
  );
};

export default ProfileFriendsOption;
