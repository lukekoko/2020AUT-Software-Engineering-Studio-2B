import React, { Component } from "react";
import axios from "axios";
import { getHeaderToken } from "./Authentication/JwtConfig";
import Navbar from "./NavBar";
import TeamList from "././TeamList/TeamList.js";
import Cookies from "js-cookie";

//import baby from "./assets/baby.gif";
//import relatable from "./assets/relatable.jpg";
//import fire from "./assets/fire.jpg";
//import toe from "./assets/toe.jpg";

import "./Task/Home.scss";

export default class Home extends Component {
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
        Cookies.set("username", res.data['name']);
        Cookies.set("userid", res.data['id']);
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
                <h1 class="title">
                  You are now logged in. This is the main dashboard.
                </h1>
                <p>Email: {this.state.user.email}</p>
                <p>Name: {this.state.user.name}</p>
                <TeamList />
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}
