import React, { Component } from "react";
import Cookies from "js-cookie";
import { withRouter } from "react-router-dom";
import { Button, Header, Grid, Form } from "semantic-ui-react";
import axios from "axios";

import "./login.scss";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      loginSuccessful: Boolean,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.RedirectToRegister = this.RedirectToRegister.bind(this);

  }

  RedirectToRegister() {
    this.props.history.push("/Register");
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleLogin() {
    axios
      .post("/login", {
        email: this.state.email,
        password: this.state.password
      })
      .then(
        (res) => {
          Cookies.set("auth-cookie", res.data.access_token);
          this.props.history.push("/Home");
        },
        (error) => {
          this.setState({ loginSuccessful: false });
        }
      );
  }

  render() {
    return (
      <div class="backgroundimg">
        <div className="container">
          <Grid className="card" style={{ width: "50%" }}>
            <Grid.Column width={16}>
              <Grid stackable style={{ width: "100%" }}>
                <Grid.Row>
                  <Grid.Column>
                    <Header className="htn">Welcome back!</Header>
                    <Form onSubmit={this.handleLogin}>
                      <Form.Field>
                        <input
                          name="email"
                          className="regis_input_type2"
                          placeholder="Email"
                          style={{ width: "100%" }}
                          onChange={this.handleChange}
                          value={this.state.email}
                        />
                      </Form.Field>
                      <Form.Field>
                        <input
                          name="password"
                          className="regis_input_type2"
                          placeholder="Password"
                          style={{ width: "100%" }}
                          type="password"
                          onChange={this.handleChange}
                          value={this.state.password}
                        />
                      </Form.Field>
                      <Form.Field>
                        <Button className="btn_submit" type="submit">
                          Login
                        </Button>
                      </Form.Field>
                      <Form.Field>
                        <p
                          className="font-sm"
                          style={{ float: "right" }}
                          onClick={() => {
                            this.props.history.push({
                              pathname: `/Register`,
                            });
                          }}
                        >
                          Register
                        </p>
                      </Form.Field>
                      <Form.Field>
                        {this.state.loginSuccessful == false && (
                          <h1 style={{color:'red'}}>Login failed</h1>
                        )}
                      </Form.Field>
                    </Form>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid>
        </div>
      </div>
    );
  }
}
export default withRouter(Login);
