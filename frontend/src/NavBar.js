import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "js-cookie";
import { withRouter } from 'react-router-dom';

class NavBar extends Component {
  constructor(props) {
    super(props);
  }

  logout = () => {
    Cookies.remove("auth-cookie");
    this.props.history.push("/login");
  }

  render() {
    return (
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">
          2A project
        </a>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div class="navbar-nav">
            <a class="nav-item nav-link" href="#">
              Home
            </a>
            <a class="nav-item nav-link" href="#">
              Features
            </a>
            <a class="nav-item nav-link" href="#">
              Pricing
            </a>
          </div>
        </div>
        <button
          onClick={() => this.logout()}
          class="btn btn-outline-success my-2 my-sm-0"
          type="submit"
        >
          Log Out
        </button>
      </nav>
    );
  }
}

export default withRouter(NavBar);
