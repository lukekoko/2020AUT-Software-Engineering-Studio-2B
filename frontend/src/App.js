import React, { Component } from "react";
import ReactDOM from 'react-dom';
import Login from './login';
import Home from './Home';
import AuthenticationGuard from './Authentication/AuthenticationGuard';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path={'/login'} component={Login} />
          <AuthenticationGuard>
            <Route path={'/Home'} component={Home} />
          </AuthenticationGuard>
        </Switch>
      </BrowserRouter>
    );
  }
}
