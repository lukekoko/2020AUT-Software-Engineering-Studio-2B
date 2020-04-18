import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "js-cookie";
import { withRouter } from "react-router-dom";
import logo from "./assets/logo512.png";
import core from "./assets/core.jpg";
import "bulma/css/bulma.css";
import { Button, Header, Grid, Form, Menu} from "semantic-ui-react";

import "./Task/Home.scss";

class NavBar extends Component {
  constructor(props) {
    super(props);
  }

  logout = () => {
    Cookies.remove("auth-cookie");
    this.props.history.push("/login");
  };

  render() {
    return (
      <nav
        class="navbar navGrad" 
        role="navigation"
        aria-label="main navigation"
      >
        <div class="navbar-brand">
          <a class="navbar-item">
            <img src={core} class="logo"/>
          </a>
        </div>

        <div id="navbarBasicExample" class="navbar-menu">
          <div class="navbar-start menu">
            <a class="navbar-item">Board</a>
            <a class="navbar-item">List</a> 
            <a class="navbar-item">Calander</a>
            <a class="navbar-item">Timesheets</a>
          </div>

          <div class="navbar-end">
            <div class="navbar-item">
              <div class="buttons">
                <button
                  onClick={() => this.logout()}
                  class="button"
                  type="submit"
                >Log out</button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default withRouter(NavBar);
