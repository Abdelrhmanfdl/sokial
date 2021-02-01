const friendshipRelatedFunctions = {
  handleAddFriendClick: (toId) => {
    fetch(`/friendship-request/${toId}`, { method: "POST" })
      .then((res) => {
        if (!res.ok) throw new Error(res.message);
        window.location.reload();
      })
      .catch((err) => {});
  },

  handleAcceptFriendship: (toId) => {
    fetch(`/friendship-request/accept/${toId}`, { method: "POST" })
      .then((res) => {
        if (!res.ok) throw new Error(res.message);
        window.location.reload();
      })
      .catch((err) => {});
  },
  handleUnrequestFriendship: (toId) => {
    fetch(`/friendship-request/${toId}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error(res.message);
        window.location.reload();
      })
      .catch((err) => {});
  },
  handleRejectFriendship: (toId) => {
    fetch(`/friendship-request/${toId}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error(res.message);
        window.location.reload();
      })
      .catch((err) => {});
  },
  handleUnfriendClick: (toId) => {
    fetch(`/friends/unfriend/${toId}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error(res.message);
        window.location.reload();
      })
      .catch((err) => {});
  },
};

export { friendshipRelatedFunctions };
