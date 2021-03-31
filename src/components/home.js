import PostsHomeSection from "./postsHomeSection";
import { Grid } from "@material-ui/core";

const Home = (props) => {
  return (
    <Grid id="home-container" direction="row" container>
      <Grid item sm={4} lg={4} xs={12}></Grid>
      <Grid item sm={4} lg={4} xs={12}>
        <PostsHomeSection identity={props.identity} />
      </Grid>
      <Grid item sm={4} lg={4} xs={12}></Grid>
    </Grid>
  );
};

export default Home;
