import React, { Component } from "react";
import axios from "axios";
import { getHeaderToken } from "./Authentication/JwtConfig";
import Navbar from "./NavBar";
import baby from "./assets/baby.gif";
import relatable from "./assets/relatable.jpg";
import fire from "./assets/fire.jpg";
import toe from "./assets/toe.jpg";

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
      });
  }

  render() {
    return (
      <div>
        <Navbar></Navbar>
        <div>
          <section class="hero">
            <div class="hero-body">
              <div>
                <h1 class="title">
                  You are now logged in. This is the main dashboard.
                </h1>
                <p>Email: {this.state.user.email}</p>
                <p>Name: {this.state.user.name}</p>
              </div>
            </div>
          </section>
        </div>

        <div class="columns">
          <div class="column">
            <figure class="image is-square">
              <img src={baby} style={{ width: "500px", height: "500px" }}></img>
            </figure>
          </div>
          <div class="column">
            <figure class="image is-16by9">
              <iframe
                class="has-ratio"
                width="640"
                height="360"
                src="https://www.youtube.com/embed/nSLURZ054IQ"
                frameborder="0"
                allowfullscreen
              ></iframe>
            </figure>
          </div>
          <div class="column">
            <figure class="image is-16by9">
              <iframe
                class="has-ratio"
                width="640"
                height="360"
                src="https://www.youtube.com/embed/9bZkp7q19f0"
                frameborder="0"
                allowfullscreen
              ></iframe>
            </figure>
          </div>
          <div class="column">
            <figure class="image is-square">
              <img
                src={relatable}
                style={{ width: "500px", height: "500px" }}
              ></img>
            </figure>
          </div>
        </div>
        <figure class="image">
          <img src={fire} style={{ width: "100%", height: "400px" }}></img>
        </figure>
        <figure class="image">
          <img src={toe} style={{ width: "100%", height: "400px" }}></img>
        </figure>
      </div>
    );
  }
}
