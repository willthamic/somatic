import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Landing from "./components/Landing";
import Form from "./components/Form";
import Complete from "./components/Complete";
import Demo from "./components/Demo.js";
import Settings from "./components/Settings.js";
import "react-bootstrap/dist/react-bootstrap.min.js";

function App() {
  return (
    <Router basename="/">
      <Switch>
        <Route path="/demo/:type" render={props => <Demo {...props} />}></Route>
        <Route exact path="/">
          <Landing />
        </Route>
        <Route exact path="/Form/">
          <Form />
        </Route>
        <Route exact path="/Complete/">
          <Complete />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
