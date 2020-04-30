import React, { Component } from "react";
import Navbar from "./NavBar";
import "./Task/Home.scss";
import Cookies from "js-cookie";
import axios from "axios";
import { getHeaderToken } from "./Authentication/JwtConfig";

export default class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
    };

    axios
      .get("/protected", { headers: { Authorization: getHeaderToken() } })
      .then((res) => {
        this.setState({
          user: res.data,
        });
        Cookies.set("username", res.data["name"]);
        Cookies.set("userid", res.data["id"]);
      });
  }

  render() {
    return (
      <div>
        <Navbar />
        <div>
          <section class="hero">
            <div class="hero-body">
              <div>
                <h1 class="title">Tasks Page</h1>
                <p>Name: {this.state.user.name}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}
