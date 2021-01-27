import "./App.scss";
import Signup from "./components/signup";
import Login from "./components/login";
import { Link, Switch, Route, BrowserRouter as Router } from "react-router-dom";
import Profile from "./components/profile";
import Posting from "./components/posting";
import Post from "./components/post";

import { useState, Component } from "react";

const Sokial = (props) => {
  return (
    <>
      <button
        onClick={async () => {
          await fetch("/logout", {
            method: "post",
          });
          props.loggedOut();
        }}
      >
        Logout
      </button>
      <br />
      <h3>
        Welcome to home, {props.identity.firstName} {props.identity.lastName}
      </h3>
    </>
  );
};

/* function App() {
  // Check whether Auth or not, and get userData if so

  const getIdentity = async () => {
    const res = await fetch("/about-auth", { method: "GET" });
    res = res.json();
    if (res.auth == false) {
      // Not authenticated
    } else {
    }
  };

  const [identity, setIdentity] = useState(null);
  console.log(identity);

  const gotUserData = (data) => {
    setIdentity(data);
  };

  return (
    <Router>
      <Switch>
        <Route
          path="/login"
          component={() => <Login gotUserData={gotUserData} />}
        />
        <Route
          path="/signup"
          component={() => <Signup gotUserData={gotUserData} />}
        />
        <Route
          path="/home"
          component={() => (
            <Sokial
              loggedOut={() => {
                setIdentity(null);
              }}
              identity={identity}
            />
          )}
        />
        <Route path="/profile" component={Profile} />
        <Route path="/posting" component={Posting} />
      </Switch>
    </Router>
  );
}
 */

class App extends Component {
  constructor(props) {
    super(props);
    this.gotUserData = this.gotUserData.bind(this);
    this.handleLogout = this.handleLogout.bind(this);

    this.state = {
      identity: null,
      authChecked: false,
    };
  }

  gotUserData(data) {
    this.setState({ identity: data });
    window.location.replace("/home");
  }
  handleLogout() {
    window.location.replace("/login");
    this.setState({ identity: null });
  }

  async componentDidMount() {
    let res = await fetch("/about-auth", { method: "GET" });
    res = await res.json();

    if (res.auth) {
      if (
        window.location.pathname == "/login" ||
        window.location.pathname == "/signup"
      )
        window.location.replace("/home");
      this.setState({ identity: res.userData });
    } else {
      if (window.location.pathname == "/home")
        window.location.replace("/login");
    }

    this.setState({ authChecked: true });
  }

  render() {
    if (this.state.authChecked)
      return (
        <Router>
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
              path="/home"
              component={() => (
                <Sokial
                  loggedOut={this.handleLogout}
                  identity={this.state.identity}
                />
              )}
            />
            <Route
              path="/profile"
              component={() => <Profile identity={this.state.identity} />}
            />
            <Route path="/posting" component={Posting} />
            <Route path="/post" component={Post} />
          </Switch>
        </Router>
      );
    else return null;
  }
}
export default App;
