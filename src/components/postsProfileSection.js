import Post from "./post";
import { Component } from "react";

class PostsProfileSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: null,
    };
  }

  componentDidMount() {
    fetch("/get-posts/" + this.props.profileId, {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        //console.log(res);
        if (!res.valid) {
          // TODO :: Handle invalid fetch
        } else this.setState({ posts: res.posts });
      });
  }

  render() {
    const posts = [];
    if (this.state.posts)
      for (let i = 0; i < this.state.posts.length; i++)
        posts.push(
          <Post
            content={this.state.posts[i].content}
            autherFullName={`${this.props.profileData.firstName} ${this.props.profileData.lastName}`}
          />
        );
    return <div> {posts} </div>;
  }
}

export default PostsProfileSection;
