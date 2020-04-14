import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Navbar from "../NavBar";
import axios from "axios";
import { getHeaderToken } from "../Authentication/JwtConfig";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sendMessage: "",
      receiveMessage: []
    };
    this.connectSocket = this.connectSocket.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.listen = this.listen.bind(this);
  }

  componentDidMount() {
    this.connectSocket();
    this.listen();
  }

  connectSocket() {
    socket.on("connect", function () {
        console.log('connected to server');
    });
    socket.emit('fetchMessages');
  }

  listen() {
    socket.on('sentMessage', (data) => {
        this.setState({receiveMessage: data.data});
        console.log(this.state.receiveMessage);
    });
    socket.on('initalMessages', (data) => {
        this.setState({receiveMessage: data.data});
        console.log(this.state.receiveMessage);
    });
  }

  inputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  sendMessage() {
    if (this.state.sendMessage != "") {
      socket.emit("message", this.state.sendMessage);
      this.setState({sendMessage: ""});
    }
  }

  render() {
    return (
      <div>
        <Navbar></Navbar>
        <div class="container" class="container">
          <article class="message" style={{ width: "100%", height: "500px" }}>
            <div class="message-header">
              <p>Hello World</p>
            </div>
            <div class="message-body">
                {this.state.receiveMessage.map((item, i)=> <div>{item}</div>)}
            </div>
          </article>
          <input
            name="sendMessage"
            class="input"
            type="text"
            style={{ width: "90%"}}
            onChange={this.inputChange}
            value={this.state.sendMessage}
          ></input>
          <button class="button is-primary" onClick={this.sendMessage}>
            Send
          </button>
        </div>
      </div>
    );
  }
}
export default withRouter(Chat);
