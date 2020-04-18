import React, { Component } from "react";
import ReactDOM from 'react-dom';
import Login from './Authentication/login';
import Home from './Home';
import List from './TeamList/TeamList';
import Register from './Authentication/Register';
import AuthenticationGuard from './Authentication/AuthenticationGuard';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import 'bulma/css/bulma.css'

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path={'/login'} component={Login} />
          <Route path={'/Register'} component={Register} />
          <AuthenticationGuard>
            <Route path={'/Home'} component={Home} />
          </AuthenticationGuard>
        </Switch>
      </BrowserRouter>
    );
  }
}
