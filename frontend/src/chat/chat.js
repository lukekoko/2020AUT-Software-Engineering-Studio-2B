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
      username: Cookies.get("username"),
      userid: Cookies.get("userid"),
      sendMessage: "",
      messages: [],
      room: "",
      roomDisplay: "",
    };
    this.connectSocket = this.connectSocket.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.listen = this.listen.bind(this);
    this.connectRoom = this.connectRoom.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.updateScroll = this.updateScroll.bind(this);
    // get all users
  }

  componentDidMount() {
    this.getUsers();
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
    console.log("username: " + this.state.username);
    socket.on("connect", function () {
      console.log("Connected");
    });
  }

  listen() {
    socket.on("roomMessage", (data) => {
      this.setState((prevState) => ({
        messages: [...prevState.messages, data],
      }));
      this.updateScroll();
    });

    socket.on("message", (data) => {
      console.log(data);
    });
  }

  getUsers() {
    axios
      .get("/users", { headers: { Authorization: getHeaderToken() } })
      .then((res) => {
        if (res.data) {
          this.setState({
            users: res.data.filter(
              (user) => parseInt(user.id) !== parseInt(Cookies.get("userid"))
            ),
          });
        }
      });
  }

  inputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  sendMessage(event) {
    if (this.state.sendMessage != "") {
      socket.emit("sendMessage", {
        message: this.state.sendMessage,
        room: this.state.room,
        username: this.state.username,
        time: new Date().getTime(),
      });
      this.setState({ sendMessage: "" });
    }
    event.preventDefault();
  }

  updateScroll() {
    var element = document.getElementById("messageDiv");
    element.scrollTop = element.scrollHeight;
  }

  connectRoom(event) {
    var user = this.state.users.filter(
      (user) => parseInt(user.id) === parseInt(event.target.value)
    )[0];
    console.log(user);
    // var room = this.state.username + "-" + event.target.value;
    var room = parseInt(this.state.userid) + parseInt(event.target.value);
    if (this.state.room != "") {
      socket.emit("leave", {
        username: this.state.username,
        room: this.state.room,
      });
    }

    socket.emit("join", { username: this.state.username, room: room });
    this.setState({
      room: room,
      messages: [],
      roomDisplay: user.name,
    });
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
                  value={item.id}
                >
                  {item.name}
                </button>
              </div>
            ))}
          </div>
          <div class="column">
            <div class="message-header">
              <p>{this.state.roomDisplay}</p>
            </div>
            <article
              class="message"
              id="messageDiv"
              style={{ width: "100%", height: "500px", overflow: "auto" }}
            >
              <div class="message-body" style={{}}>
                {this.state.room === "" && (
                  <p>Click on the buttons on the right to start a chat</p>
                )}
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
              <form onSubmit={this.sendMessage} style={{ width: "100%" }}>
                <input
                  name="sendMessage"
                  class="input"
                  type="text"
                  style={{ width: "90%" }}
                  onChange={this.inputChange}
                  value={this.state.sendMessage}
                  disabled={this.state.room === ""}
                ></input>
                <button
                  class="button is-primary"
                  disabled={this.state.room === ""}
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(Chat);
