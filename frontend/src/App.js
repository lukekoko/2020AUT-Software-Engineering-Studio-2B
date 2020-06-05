import React, { Component } from "react";
import ReactDOM from "react-dom";
import Login from "./Authentication/login";
import Home from "./Home";
import Register from "./Authentication/Register";
import Chat from "./chat/chat";
import CreateTask from "./Task/CreateTask";
import Task from "./Task/Task";
import TeamList from "./TeamList/TeamsList";
import Team from "./TeamList/Team";
import Task2 from "./Task/Task2";
import AuthenticationGuard from "./Authentication/AuthenticationGuard";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import "bulma/css/bulma.css";
import myCalendar from "./Calendar/Calendar";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path={"/login"} component={Login} />
          <Route path={"/Register"} component={Register} />
          <AuthenticationGuard>
            <Route path={"/Home"} component={Home} />
            <Route path={"/chat"} component={Chat} />
            <Route path={"/calendar"} component={myCalendar} />
            <Route path={"/CreateTask"} component={CreateTask} />
            <Route path={"/Task"} component={Task} />
            <Route path={"/TeamsList"} component={TeamList} />
            <Route path={"/Team"} component={Team} />
            <Route path={"/Task2"} component={Task2} />
          </AuthenticationGuard>
        </Switch>
      </BrowserRouter>
    );
  }
}
