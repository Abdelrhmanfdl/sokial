import "./App.scss";
import Signup from "./components/signup";
import Login from "./components/login";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import Profile from "./components/profile";
import Home from "./components/home";
import MainBar from "./components/mainBar";
import { Component } from "react";

/////////////////////

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
    let tmpIdentity;
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
          tmpIdentity = {
            id: res.userData.id,
            firstName: res.userData.first_name,
            lastName: res.userData.last_name,
            profileImagePath: res.userData.profile_image_path,
          };

          /*
          this.setState({
               identity: {
              id: res.userData.id,
              firstName: res.userData.first_name,
              lastName: res.userData.last_name,
              profileImagePath: res.userData.profile_image_path,
            },
            authChecked: true,
          });*/

          return fetch(
            `/get-profile-img/${res.userData.id}?` +
              new URLSearchParams({
                profile_image_path: res.userData.profile_image_path,
              })
          );
        } else {
          this.setState({ authChecked: true });
          if (
            window.location.pathname != "/login" &&
            window.location.pathname != "/signup"
          )
            window.location.replace("/login");
        }
      })
      .then((res) => {
        if (res && res.ok) return res.blob();
      })
      .then((res) => {
        if (res) {
          const img = URL.createObjectURL(res);
          this.setState({
            identity: { ...tmpIdentity, profileImage: img },
            authChecked: true,
          });
        }
      })
      .catch((err) => {
        this.setState({
          identity: tmpIdentity,
          authChecked: true,
        });
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
