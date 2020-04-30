import React, { Component } from "react";
import Navbar from "../NavBar";
import "./Home.scss";
import axios from "axios";
import { getHeaderToken } from "../Authentication/JwtConfig";

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
