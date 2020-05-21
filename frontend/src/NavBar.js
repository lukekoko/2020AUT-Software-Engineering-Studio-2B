import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "js-cookie";
import { withRouter } from "react-router-dom";
import core from "./assets/core.jpg";
import "bulma/css/bulma.css";
import { Button, Header, Grid, Form, Menu } from "semantic-ui-react";

import "./Task/Home.scss";

class NavBar extends Component {
  constructor(props) {
    super(props);
  }

  logout = () => {
    Cookies.remove("auth-cookie");
    this.props.history.push("/login");
  };

  state= {
    on: false,
  }

  toggle = () => {
    this.setState({
      on: !this.state.on
    })
  }

  render() {
    return (
      <nav
        class="navbar navGrad"
        role="navigation"
        aria-label="main navigation"
      >
        
        <div class="navbar-brand">
          <a
            class="navbar-item"
            onClick={() => {
              this.props.history.push({
                pathname: `/home`,
              });
            }}
          >
            <img src={core} class="logo" />
          </a>
        </div>

        <div class="mobile-nav-open">
          <button onClick={this.toggle}>Menu</button>
          </div>    

        <div id="navbarBasicExample" class="navbar-menu desktop-menu" id="main-menu">
          <div class="navbar-start">
            <a
              class="navbar-item has-text-white"
              onClick={() => {
                this.props.history.push({
                  pathname: `/home`,
                });
              }}
            >
              Dashboard
            </a>
            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link has-text-white">Tasks</a>
              <div class="navbar-dropdown">
                <a
                  class="navbar-item"
                  onClick={() => {
                    this.props.history.push({
                      pathname: `/Task`,
                    });
                  }}
                >
                  View created tasks
                </a>
                <a
                  class="navbar-item"
                  onClick={() => {
                    this.props.history.push({
                      pathname: `/CreateTask`,
                    });
                  }}
                >
                  Create tasks
                </a>
              </div>
            </div>

            <a
              class="navbar-item has-text-white"
              onClick={() => {
                this.props.history.push({
                  pathname: `/chat`,
                });
              }}
            >
              Chat
            </a>
            <a class="navbar-item has-text-white">Calendar</a>
          </div>
          <div class="navbar-end">
            <div class="navbar-item">
              <div class="buttons">
                <button
                  onClick={() => this.logout()}
                  class="button"
                  type="submit"
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        </div>
         {this.state.on &&     
        <div id="navbarBasicExample" class="navbar-menu mobile-menu" id="main-menu">
          <div class="navbar-start">
            <a
              class="navbar-item has-text-white"
              onClick={() => {
                this.props.history.push({
                  pathname: `/home`,
                });
              }}
            >
              Dashboard
            </a>
            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link has-text-white">Tasks</a>
              <div class="navbar-dropdown">
                <a
                  class="navbar-item"
                  onClick={() => {
                    this.props.history.push({
                      pathname: `/Task`,
                    });
                  }}
                >
                  View tasks
                </a>
                <a
                  class="navbar-item"
                  onClick={() => {
                    this.props.history.push({
                      pathname: `/CreateTask`,
                    });
                  }}
                >
                  Create tasks
                </a>
              </div>
            </div>

            <a
              class="navbar-item has-text-white"
              onClick={() => {
                this.props.history.push({
                  pathname: `/chat`,
                });
              }}
            >
              Chat
            </a>
            <a class="navbar-item has-text-white">Calendar</a>
          </div>
          <div class="navbar-end">
            <div class="navbar-item">
              <div class="buttons">
                <button
                  onClick={() => this.logout()}
                  class="button"
                  type="submit"
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        </div>
  }

      </nav>
    );
  }
}

export default withRouter(NavBar);
