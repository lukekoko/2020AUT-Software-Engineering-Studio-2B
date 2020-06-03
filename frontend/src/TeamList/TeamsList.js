import React, { Component } from "react";
import axios from "axios";
import { getHeaderToken } from "../Authentication/JwtConfig";
import { withRouter } from "react-router-dom";
import Navbar from "../NavBar";
 
class TeamsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      team: {}

    };

    //function to receive teams data
    axios
      .get("/teams", { headers: { Authorization: getHeaderToken() } })
      .then((res) => {
        this.setState({
          team: res.data,
        });
        // console.log(this.state.team);
      });
    // console.log(findLeader(Object.keys(this.state.team[1].users),1));
   
  }
  
  
  render() {
    return (
      <div>
        <div>
          <Navbar></Navbar>
        </div>
        <div>
          <section class="hero">
            <div class="hero-body">
              <div>
                <p>
                  Here you can view the lists of teams you are involved with.
                  You can edit them and assign people to teams.
                </p>
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">Teams</th>
                      <th scope="col">No. People in Team</th>
                      <th scope="col">Team Leader</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(this.state.team).map((key) => (
                      <tr >
                        {/* team name  */}
                        <td key={key} onClick={() => {
                         this.props.history.push({
                          pathname: `/Team`,
                          team: this.state.team[key].users
                        });
                      }}>{this.state.team[key].name}</td>
                        {/* number of people in team */}
                        <td>
                          {Object.keys(this.state.team[key].users).length}
                        </td>
                        {/* name of the team leader */}
                        <td>
                          {Object.keys(this.state.team[key].users).map(
                            ([keyName, keyIndex]) => {
                              return keyName === key
                                ? this.state.team[key].users[keyName].name
                                : "";
                            }
                          )}
                        </td>
                        {/* {console.log(findLeader(this.state.team[key].users,key) })} */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
        }
      </div>
    );
  }
}
export default withRouter(TeamsList);
