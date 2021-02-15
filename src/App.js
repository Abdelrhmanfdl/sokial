import "./App.scss";
import Signup from "./components/signup";
import Login from "./components/login";
import { Link, Switch, Route, BrowserRouter as Router } from "react-router-dom";
import Profile from "./components/profile";
import Posting from "./components/posting";
import Post from "./components/post";
import Home from "./components/home";
import MainBar from "./components/mainBar";
import { useState, Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);
    this.gotUserData = this.gotUserData.bind(this);
    this.handleLogout = this.handleLogout.bind(this);

    this.state = {
      identity: null,
      authChecked: false,
      profileImg: null,
    };
  }

  gotUserData(data) {
    this.setState({ identity: data });
    window.location.replace("/home");
  }
  async handleLogout() {
    await fetch("/logout", {
      method: "post",
    });

    window.location.replace("/login");
    this.setState({ identity: null });
  }

  componentDidMount() {
    fetch("/about-auth", { method: "GET" })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.auth) {
          if (
            window.location.pathname == "/login" ||
            window.location.pathname == "/signup"
          )
            window.location.replace("/home");
          this.setState({ identity: res.userData, authChecked: true });

          return fetch(
            `/get-profile-img/${res.userData.id}?` +
              new URLSearchParams({
                profile_photo_path: res.userData.profile_photo_path,
              })
          );
        } else {
          if (window.location.pathname == "/home")
            window.location.replace("/login");
          this.setState({ authChecked: true });
        }
      })
      .then((res) => {
        if (res && res.ok) return res.blob();
      })
      .then((res) => {
        if (res) {
          const img = URL.createObjectURL(res);
          this.setState({
            identity: { ...this.state.identity, profileImg: img },
          });
        }
      });
  }

  render() {
    if (this.state.authChecked)
      return (
        <Router>
          <MainBar logout={this.handleLogout} identity={this.state.identity} />
          <Switch>
            <Route
              path="/login"
              component={() => <Login gotUserData={this.gotUserData} />}
            />
            <Route
              path="/signup"
              component={() => <Signup gotUserData={this.gotUserData} />}
            />
            <Route
              path="/profile"
              component={() => <Profile identity={this.state.identity} />}
            />
            <Route
              path="/home"
              component={() => <Home identity={this.state.identity} />}
            />
          </Switch>
        </Router>
      );
    else return null;
  }
}
export default App;
