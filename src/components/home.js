import { useState, useEffect } from "react";
import PostsHomeSection from "./postsHomeSection";

const Home = (props) => {
  return (
    <div>
      <h1>HOME</h1>
      <PostsHomeSection identity={props.identity} />
    </div>
  );
};

export default Home;
