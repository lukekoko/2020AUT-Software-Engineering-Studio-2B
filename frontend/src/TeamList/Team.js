import React, { Component } from "react";
import axios from "axios";
import { getHeaderToken } from "../Authentication/JwtConfig";
import { withRouter } from "react-router-dom";
import Navbar from "../NavBar";

class Team extends Component {
  constructor(props) {
    super(props);

    this.state = {
      team: this.props.location.team,
    };
    console.log(this.state.team);
  }

  render() {
    return (
      <div>
        <div>
          <Navbar></Navbar>
          <a
            class="navbar-item"
            onClick={() => {
              this.props.history.push({
                pathname: `/TeamsList`,
              });
            }}
          >
            Get back to list of the teams
          </a>
          <div>
            <section class="hero">
              <div class="hero-body">
                <div>
                  <p>Here you can view the members of the teams</p>
                  <br/>
                  {Object.keys(this.state.team).map((key) => (
                    <div class="raised card">
                      <div class="card">
                        <div class="content">
                          <div key={key} class="header">
                            {this.state.team[key].name}
                          </div>
                          <div class="meta">
                            Employee ID : {this.state.team[key].id}{" "}
                          </div>
                          <div class="description">
                            Elliot Fu is a film-maker from New York.
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(Team);
