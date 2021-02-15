import { useState, useEffect } from "react";
import PostsHomeSection from "./postsHomeSection";
import Posting from "./posting";

const Home = (props) => {
  return (
    <div>
      <h1>HOME</h1>
      <Posting identity={props.identity} />
      <PostsHomeSection identity={props.identity} />
    </div>
  );
};

export default Home;
