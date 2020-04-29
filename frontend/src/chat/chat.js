import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Navbar from "../NavBar";
import { getHeaderToken } from "../Authentication/JwtConfig";
import io from "socket.io-client";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Button,
  Header,
  Grid,
  Form,
  TextArea,
  Dropdown,
  Label,
  Icon,
} from "semantic-ui-react";

var socket;
class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      selectedUsersForCreatingRoom: [],
      rooms: [],
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
    this.getRooms = this.getRooms.bind(this);
    this.createRoom = this.createRoom.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.getPreviousMessages = this.getPreviousMessages.bind(this);
  }

  componentDidMount() {
    this.getUsers();
    this.getRooms();
    socket = io("http://localhost:5000", {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: getHeaderToken(),
          },
        },
      },
    });
    // this.connectSocket();
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

    socket.on("previousMessage", (data) => {
      data.map((item)=> {
        this.setState({
          messages: this.state.messages.concat(item)
        });
      });
      this.updateScroll();
    });

    socket.on("success", (data) => {
      console.log(data);
      this.getPreviousMessages();
    });
  }

  getUsers() {
    axios
      .get("/users", { headers: { Authorization: getHeaderToken() } })
      .then((res) => {
        if (res.data) {
          res.data
            .filter(
              (user) => parseInt(user.id) !== parseInt(Cookies.get("userid"))
            )
            .map((item) =>
              this.setState({
                users: this.state.users.concat({
                  key: item.id,
                  text: item.name,
                  value: item.id,
                }),
              })
            );
        }
      });
  }

  getRooms() {
    axios
      .get("/rooms", { headers: { Authorization: getHeaderToken() } })
      .then((res) => {
        if (res.data) {
          var data = res.data;
          for (const key of Object.keys(data)) {
            data[key]["name"] = data[key]["name"].replace(
              this.state.username + ", ",
              ""
            );
          }
          this.setState({
            rooms: data,
          });
        }
      });
  }

  getPreviousMessages() {
    axios
    .post("/rooms/messages", 
    {room: this.state.room},
    { headers: { Authorization: getHeaderToken() } })
    .then((res) => {
      console.log(res.data);
      res.data.map((item)=> {
        this.setState({
          messages: this.state.messages.concat(item)
        });
      });
      this.updateScroll();
    });
  }

  inputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  onSelectChange(event, value) {
    this.setState({
      selectedUsersForCreatingRoom: value.value,
    });
  }

  sendMessage(event) {
    if (this.state.sendMessage != "") {
      socket.emit("sendMessage", {
        message: this.state.sendMessage,
        room: this.state.room,
        username: this.state.username,
        userid: this.state.userid,
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

  createRoom() {
    axios
      .post(
        "/rooms",
        {
          users: this.state.selectedUsersForCreatingRoom,
        },
        { headers: { Authorization: getHeaderToken() } }
      )
      .then(
        (res) => {
          alert("Create Task Successful", res);
          this.getRooms();
        },
        (error) => {
          alert("Create Task Error", error);
        }
      );
  }

  connectRoom(event) {
    socket.emit("join", {
      username: this.state.username,
      room: event.target.value,
    });
    var room = this.state.rooms.filter(
      (room) => parseInt(room.id) == parseInt(event.target.value)
    )[0];
    this.setState({
      room: event.target.value,
      messages: [],
      roomDisplay: room.name,
    });
  }

  render() {
    return (
      <div>
        <Navbar></Navbar>
        <div class="columns" style={{ padding: "10px" }}>
          <div class="column is-one-fifth">
            <Form onSubmit={this.createRoom}>
              <div
                class="columns is-flex is-centered"
                style={{ padding: "5px" }}
              >
                <div class="column">
                  <Dropdown
                    placeholder={
                      this.state.users.length == 0
                        ? "No users to chat to"
                        : "Create new chat"
                    }
                    multiple
                    selection
                    options={this.state.users}
                    fluid
                    disabled={this.state.users.length == 0 ? true : false}
                    onChange={this.onSelectChange}
                  ></Dropdown>
                </div>
                <div class="column">
                  <Form.Field>
                    <button
                      class="button is-dark"
                      type="submit"
                      disabled={
                        this.state.selectedUsersForCreatingRoom.length === 0
                      }
                    >
                      Create new chat
                    </button>
                  </Form.Field>
                </div>
              </div>
            </Form>

            {this.state.rooms.map((item) => (
              <div style={{ padding: "10px" }} key={"chatdiv" + item.id}>
                <button
                  id={"chatbutton" + item.id}
                  key={"chatbutton " + item.id}
                  class="button is-dark is-large is-fullwidth"
                  onClick={this.connectRoom}
                  value={item.id}
                  disabled={this.state.room == item.id}
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
                    {new Date(item.time).toLocaleString('en-AU')} - {item.username}: {item.message}
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
