import React, { Component } from "react";
import Cookies from 'js-cookie'
import { withRouter } from 'react-router-dom';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
        email: '',
        password: '',
        loginSuccessful: Boolean
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value});
    }

    handleSubmit(event) {
      fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: this.state.email,
            password: this.state.password
      })
    }).then((response) => {
        if (response.ok) {
            return response.json().then(data => {
              Cookies.set('auth-cookie', data.access_token);
              this.props.history.push('/Home');
            });
        } else {
            this.setState({loginSuccessful: false});
        }
    })
    event.preventDefault();
    }


  render() {
    return (
      <div align="center">
          <form onSubmit={this.handleSubmit}>
            <label>
                Email: 
                <input type="text" placeholder="email" name="email" value={this.state.email} onChange={this.handleChange} ></input>
            </label>
            <label>
                Password:
                <input type="password" placeholder="password" name="password" value={this.state.password} onChange={this.handleChange} ></input>
            </label>
            <input type="submit" value="login" />
            { this.state.loginSuccessful == false &&
              <h1>Login failed</h1>
            }
          </form>
      </div>
    );
  }
  }
export default withRouter(Login);
