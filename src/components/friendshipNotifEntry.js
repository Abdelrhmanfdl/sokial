import { Grid, Button, ButtonGroup, Container } from "@material-ui/core";
import { friendshipRelatedFunctions as frFuncs } from "../usable functions/endpoint-related";

const FriendshipNotifEntry = (props) => {
  return (
    <Grid direction="row" className="friendship-notif-entry" container>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <div class="friendship-notif-img"></div>
        <a
          class="clickable-account-name friendship-notif-name"
          href={`${window.location.origin}/profile?id=${props.id}`}
          style={{ marginLeft: "4px" }}
        >
          {props.fullName}
        </a>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <ButtonGroup
          size={"small"}
          variant="contained"
          aria-label="contained primary button group"
        >
          <Button
            style={{ width: "100%" }}
            onClick={() => {
              frFuncs.handleAcceptFriendship(props.id);
            }}
          >
            Accept
          </Button>
          <Button
            style={{ width: "100%" }}
            onClick={() => {
              frFuncs.handleRejectFriendship(props.id);
            }}
          >
            Reject
          </Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  );
};

export default FriendshipNotifEntry;
