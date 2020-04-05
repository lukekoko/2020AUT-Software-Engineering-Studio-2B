import React, { Component } from "react";
import Cookies from "js-cookie";
import { withRouter } from "react-router-dom";
import axios from "axios";

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: String,
      email: String,
      password: String,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }

  form = {
    width: "40%",
    margin: "0 auto",
    marginTop: "2%",
  };

  formContainer = {
    width: "100%",
    textAlign: "center",
  };

  submitButton = {
    marginTop: "1%",
  };

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleRegister() {
    axios
      .post("/registration", {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
      }).then((res) => {
        Cookies.set("auth-cookie", res.access_token);
        this.props.history.push("/Home");
      });
  }

  render() {
    return (
      <div>
        <div style={this.formContainer}>
          <div style={this.form}>
            <div class="field">
              <div class="control">
                <input
                  class="input"
                  type="text"
                  placeholder="Name"
                  onChange={this.handleInputChange}
                  name="name"
                ></input>
              </div>
            </div>
            <div class="field">
              <input
                class="input"
                type="text"
                placeholder="Email"
                onChange={this.handleInputChange}
                name="email"
              ></input>
            </div>
            <div class="field">
              <input
                class="input"
                type="password"
                placeholder="Password"
                onChange={this.handleInputChange}
                name="password"
              ></input>
            </div>
          </div>
          <button style={this.submitButton} onClick={this.handleRegister} class="button is-primary">
            Register
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(Register);
