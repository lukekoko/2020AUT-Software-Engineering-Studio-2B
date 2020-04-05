import React, { Component } from "react";
import axios from 'axios';
import {getHeaderToken} from './Authentication/JwtConfig';
import Navbar from './NavBar';

export default class Home extends Component {
    constructor(props) {
      super(props);
      this.state = {
          user: {}
      };

      axios.get('/protected', { headers: { Authorization: getHeaderToken() } }).then(res => {
        this.setState({
          user: res.data
        })
        console.log(res.data);
        console.log(res);
      });
    }

    render(){
        return(
            <div>
                <Navbar></Navbar>
                <p>You are now logged in. This is the main starting page.</p>
                <h1>Your Info:</h1>
                <h3>Email: {this.state.user.email}</h3>
                <h3>Name: {this.state.user.name}</h3>
            </div>
        );
    }
}