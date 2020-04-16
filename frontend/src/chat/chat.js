import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Navbar from "../NavBar";
import { getHeaderToken } from "../Authentication/JwtConfig";
import io from "socket.io-client";
import axios from "axios";
import Cookies from "js-cookie";

var socket;
class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      username: "",
      sendMessage: "",
      messages: [],
    };
    this.connectSocket = this.connectSocket.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.listen = this.listen.bind(this);
    this.connectRoom = this.connectRoom.bind(this);
    axios
      .get("/users", { headers: { Authorization: getHeaderToken() } })
      .then((res) => {
        if (res.data) {
          this.setState({
            users: res.data,
          });
        }
      });
  }

  componentDidMount() {
    socket = io("http://localhost:5000", {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: getHeaderToken(),
          },
        },
      },
    });
    this.connectSocket();
    this.listen();
  }

  componentWillUnmout() {
    console.log("disconnect");
    socket.close();
  }

  connectSocket() {
    socket.on("connect", function () {
      socket.emit("join", { username: Cookies.get("username"), room: "room1" });
    });
  }

  listen() {
    socket.on("roomMessage", (data) => {
      this.setState((prevState) => ({
        messages: [...prevState.messages, data],
      }));
    });

    socket.on("message", (data) => {});
  }

  inputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  sendMessage() {
    if (this.state.sendMessage != "") {
      socket.emit("sendMessage", {
        message: this.state.sendMessage,
        room: "room1",
        username: Cookies.get("username"),
        time: new Date().getTime(),
      });
      this.setState({ sendMessage: "" });
    }
  }

  connectRoom(event) {
    console.log(event.target.value);
    // socket.emit("join", { username: Cookies.get("username"), room: "name" });
  }

  render() {
    return (
      <div>
        <Navbar></Navbar>
        <div class="columns" style={{ padding: "10px" }}>
          <div class="column is-one-fifth">
            {this.state.users.map((item) => (
      <div style={{ padding: "10px" }} key={item.email}>
        <button
          id={item.email}
          key={item.email}
          class="button is-dark is-large is-fullwidth is-rounded"
          onClick={this.connectRoom}
          value = {item.name}
        >
          {item.name}
        </button>
      </div>
    ))}
          </div>
          <div class="column">
            <article
              class="message"
              style={{ width: "100%", height: "500px", overflow: "auto" }}
            >
              <div class="message-header">
                <p>toe</p>
              </div>
              <div class="message-body">
                {this.state.messages.map((item, i) => (
                  <div key={item.time}>
                    {item.username}: {item.message}
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
        <div class="columns">
          <div class="column is-one-fifth"></div>
          <div class="column">
            <div class="container is-fluid">
              <input
                name="sendMessage"
                class="input"
                type="text"
                style={{ width: "90%" }}
                onChange={this.inputChange}
                value={this.state.sendMessage}
              ></input>
              <button class="button is-primary" onClick={this.sendMessage}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(Chat);
