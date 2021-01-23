import "./App.css";
import Signup from "./components/signup";
import Login from "./components/login";
import { Link, Switch, Route, BrowserRouter as Router } from "react-router-dom";

const Sokial = (props) => {
  return (
    <>
      <button
        onClick={async () => {
          await fetch("/logout", {
            method: "post",
          });
          window.location.replace("/login");
        }}
      >
        Logout
      </button>
      <br />
      <h3>Welcome to home</h3>
    </>
  );
};

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/home" component={Sokial} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
      </Switch>
    </Router>
  );
}

export default App;
