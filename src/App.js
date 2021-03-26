import "./App.scss";
import Signup from "./components/signup";
import Login from "./components/login";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import Profile from "./components/profile";
import Home from "./components/home";
import MainBar from "./components/mainBar";
import { Component, useState, useEffect } from "react";
import { swap } from "formik";
import { Modal } from "@material-ui/core";

import { createPortal } from "react-dom";

const Child2 = (props) => {
  const [forMount, setForMount] = useState(null);
  useEffect(() => {
    // New Mount
    console.log(`${props.name} is newly mounted`);
    setForMount(props.name);
  }, []);
  useEffect(() => {
    // New Mount
    console.log(` >> ${props.name} props is changed`);
  }, [props]);

  return (
    <li style={{ width: "auto", display: "block", backgroundColor: "yellow" }}>
      {props.name} (forMount: {forMount})
    </li>
  );
};

const Little = (props) => {
  useEffect(() => {
    console.log(`${props.name} is mounting`);
  });
  return <div>{props.name}</div>;
};

const Child = (props) => {
  const [forMount, setForMount] = useState(null);
  useEffect(() => {
    // New Mount
    console.log(`${props.name} is newly mounted`);
    setForMount(props.name);
  }, []);
  useEffect(() => {
    // New Mount
    console.log(` >> ${props.name} props is changed`);
  }, [props]);

  return (
    <li style={{ width: "auto", display: "flex" }}>
      {props.name} (forMount: {forMount})
      <Little name={"Little " + props.name} />
    </li>
  );
};

const Parent = (props) => {
  const [child, setChild] = useState([]);
  const [modalOpen, setModalOpen] = useState(true);

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    const tmp = [];
    for (let i = 0; i < 10; i++) {
      tmp.push(<Child name={i} key={i} />);
    }
    setChild(tmp);
  }, []);

  return (
    <>
      <div class="btns" style={{ display: "flex", width: "auto" }}>
        <button
          onClick={() => {
            const tmp = [...child];
            if (tmp.length) {
              tmp[0] = {
                ...tmp[0],
                props: { ...tmp[0].props, name: tmp[0].props.name + 1 },
              };
            }
            setChild(tmp);
          }}
          style={{ width: "100px", height: "50px" }}
        >
          ++ First Name
        </button>
        <button
          onClick={() => {
            const tmp = [...child];
            for (let i = 1; i < tmp.length; i++) tmp[i - 1] = { ...tmp[i] };
            tmp.pop();
            setChild(tmp);
          }}
          style={{ width: "100px", height: "50px" }}
        >
          Shift
        </button>
        <button
          onClick={() => {
            const tmp = [...child];
            if (tmp.length) {
              let z = tmp[0];
              tmp[0] = tmp[1];
              tmp[1] = z;
            }
            setChild(tmp);
          }}
          style={{ width: "100px", height: "50px" }}
        >
          Swap First
        </button>
        <button
          onClick={() => {
            const tmp = [...child];
            if (tmp.length) tmp[0] = <Child name={"Wooaaaa"} />;
            setChild(tmp);
          }}
          style={{ width: "100px", height: "50px" }}
        >
          Set Dummy First
        </button>
        <button
          onClick={() => {
            const tmp = [...child];
            if (tmp.length) tmp[0] = <Child name={"Child1"} />;
            setChild(tmp);
          }}
          style={{ width: "100px", height: "50px" }}
        >
          Set first Child1
        </button>
        <button
          onClick={() => {
            const tmp = [...child];
            if (tmp.length) tmp[0] = <Child2 name={"Child2"} />;
            setChild(tmp);
          }}
          style={{ width: "100px", height: "50px" }}
        >
          Set first Child2
        </button>
        <button
          onClick={() => {
            const tmp = [...child];
            if (tmp.length) tmp[0] = <Child key={Math.random()} name={"0"} />;
            setChild(tmp);
          }}
          style={{ width: "100px", height: "50px" }}
        >
          Random first key
        </button>
      </div>
      <ul
        style={{
          margin: "30px auto 0px auto",
          width: "auto",
        }}
      >
        {child}
      </ul>
    </>
  );
};

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
          this.setState({
            identity: {
              id: res.userData.id,
              firstName: res.userData.first_name,
              lastName: res.userData.last_name,
              profileImagePath: res.userData.profile_image_path,
            },
            authChecked: true,
          });

          return fetch(
            `/get-profile-img/${res.userData.id}?` +
              new URLSearchParams({
                profile_image_path: res.userData.profile_image_path,
              })
          );
        } else {
          if (
            window.location.pathname != "/login" &&
            window.location.pathname != "/signup"
          )
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
            identity: { ...this.state.identity, profileImage: img },
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
            <Route path="/tmp" component={Parent} />
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
