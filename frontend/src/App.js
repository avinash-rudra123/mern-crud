import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginValidation from "./components/LoginValidation";
import Register from "./components/Register";
import Edit from "./components/Edit";
import Display from "./components/Display";
import Reset from "./components/Reset";
import NewPassword from "./components/NewPassword";
function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/create" component={Register} />
          <Route exact path="/login" component={LoginValidation} />
          <Route path="/find" component={Display} />
          <Route path="/edit/:id" component={Edit} />
          <Route path="/reset" component={Reset} />
          <Route path="/newpassword" component={NewPassword} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
