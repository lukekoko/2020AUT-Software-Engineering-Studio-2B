import React, { Component } from "react";
import axios from "axios";
import { getHeaderToken } from "../Authentication/JwtConfig";
import { withRouter } from "react-router-dom";
import Navbar from "../NavBar";
import logo from "./logo.png";
class Team extends Component {
  constructor(props) {
    super(props);

    this.state = {
      team: this.props.location.team,
      users: [],
      employeId: [],
    };

    //function to receive teams data
    axios
      .get("/users", { headers: { Authorization: getHeaderToken() } })
      .then((res) => {
        if (res.data) {
          res.data.map((item) =>
            this.setState({
              users: this.state.users.concat({
                key: item.id,
                text: item.name,
                value: item.id,
              }),
            })
          );
          // console.log(res.data);
        }
      });
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
                  <br />
                  <div class="ui cards">
                    {Object.keys(this.state.team).map((key) => (
                       this.state.employeId.push(
                        this.state.team[key].id
                      ),
                      <div key={key} class="card">
                        <div class="content">
                          <div class="header">{this.state.team[key].name}</div>
                          <div class="meta">
                           
                            Employee ID : {this.state.team[key].id}{" "}
                          </div>
                          <div class="description">
                            Elliot Fu is a film-maker from New York.
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
 
            {/* functionality to add users */}
            <section class="hero">
              <div class="hero-body">
                <div>
                  <p>Here you can add new memebers to the team</p>
                  <br />
                  {/* ---------------------------------------------- */}
                  {/* list of new unassigned team memberes */}

                  {Object.keys(this.state.users).map((key) => (
                    <div class="ui middle aligned divided list">
                      <div class="item">
                        <div class="right floated content">
                          <div 
                           onClick={() => {
                             //send item to backend
                          }}
                          
                          class="ui button">Add</div>
                        </div>
                        <img class="ui avatar image" src={logo} />

                        <div class="content">
                          {this.state.users[key].text}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* -------------------------------------------------- */}
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
