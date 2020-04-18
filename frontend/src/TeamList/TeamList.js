import React, { Component } from "react";
import axios from "axios";
import { getHeaderToken } from "../Authentication/JwtConfig";

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
        console.log(this.state.user.name);
        console.log(this.state.user);
      });
  }

  render() {
    return (
      <div>
        <div>
          <section class="hero">
            <div class="hero-body">
              <div>
                <p>Here you can view the lists of teams you are involved with. You can edit them and assign people to teams.</p>
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">Teams</th>
                      <th scope="col">No. People in Team</th>
                      <th scope="col">Team Leader</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">Team name #1</th>
                      <td>5</td>
                      <td>Leader #1</td>
                    </tr>
                    <tr>
                      <th scope="row">Team name #2</th>
                      <td>12</td>
                      <td>Leader #2</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}
