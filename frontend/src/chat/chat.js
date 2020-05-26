import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Navbar from "../NavBar";
import { getHeaderToken } from "../Authentication/JwtConfig";
import io from "socket.io-client";
import axios from "axios";
import Cookies from "js-cookie";
import { Form, Dropdown } from "semantic-ui-react";
import "./chat.scss";
import foot from "../assets/index.png";

// http://34.87.237.202:5000 for docker
var url = "http://localhost:5000";
// var url = "http://34.87.237.202:5000";
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
      modelActivate: {},
      editingMessage: "",
      editRoomName: false,
    };
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
    this.editMessage = this.editMessage.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
    this.enableEditInput = this.enableEditInput.bind(this);
    this.editMessageOnChange = this.editMessageOnChange.bind(this);
    this.deleteRoom = this.deleteRoom.bind(this);
    this.editRoomName = this.editRoomName.bind(this);
    this.editRoomNameOnChange = this.editRoomNameOnChange.bind(this);
    this.dropdownlist = React.createRef();
  }

  componentDidMount() {
    this.getUsers();
    this.getRooms();
    socket = io(url, {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: getHeaderToken(),
          },
        },
      },
    });
    this.listen();
  }

  componentWillUnmout() {
    console.log("disconnect");
    socket.close();
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
      data.map((item) => {
        let newModelActivate = { ...this.state.modelActivate };
        newModelActivate[item.id] = false;
        this.setState({
          messages: this.state.messages.concat(item),
          modelActivate: newModelActivate,
        });
      });
      this.updateScroll();
    });

    socket.on("success", (data) => {
      if (parseInt(data["userid"]) == parseInt(this.state.userid)) {
        this.getPreviousMessages();
      }
    });

    // this is for deleteing and editing messages
    socket.on("successMessage", (data) => {
      console.log(data['userid']);
      if (data["userid"].includes(parseInt(this.state.userid))) {
        this.getPreviousMessages();
      }
    });

    // this is for deleteing and editing + rooms
    socket.on("successRoom", (data) => {
      console.log(data["userid"]);
      if (data["userid"].includes(parseInt(this.state.userid))) {
        if (data["method"] === "delete") {
          socket.emit("leave", {
            username: this.state.username,
            userid: this.state.userid,
            room: this.state.room,
          });
          this.setState({ room: "", roomDisplay: "", messages: [] });
          this.getRooms();  
        } else {
          this.setState({editRoomName: false})
          this.getRooms();  
        }
      }
    });

    socket.on("roomCreated", (data) => {
      this.getRooms();
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
            data[key]["roomName"] = data[key]["roomName"]
              .replace(this.state.username + ", ", "")
              .replace(", " + this.state.username, "");
          }
          // for (const key of Object.keys(data)) {
          //   data[key]["name"] = data[key]["name"]
          //     .replace(this.state.username + ", ", "")
          //     .replace(", " + this.state.username, "");
          // }
          this.setState({
            rooms: data,
          });
        }
      });
  }

  getPreviousMessages() {
    axios
      .post(
        "/rooms/messages",
        { room: this.state.room },
        { headers: { Authorization: getHeaderToken() } }
      )
      .then((res) => {
        this.setState({ messages: [] });
        res.data.map((item) => {
          let newModelActivate = { ...this.state.modelActivate };
          newModelActivate[item.id] = false;
          this.setState({
            messages: this.state.messages.concat(item),
            modelActivate: newModelActivate,
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

  deleteMessage(id) {
    axios
      .post(
        "/rooms/messages/delete",
        { id: id, room: this.state.room, userId: this.state.userid },
        {
          headers: { Authorization: getHeaderToken() },
        }
      )
      .then((res) => {
        // console.log(res);
      });
  }

  editMessage(event, editBool, id) {
    if (editBool) {
      // clear edit message dict
      axios
        .post(
          "/rooms/messages/edit",
          {
            id: id,
            room: this.state.room,
            userId: this.state.userid,
            message: this.state.editingMessage,
          },
          {
            headers: { Authorization: getHeaderToken() },
          }
        )
        .then((res) => {
          console.log(res);
        });

      this.enableEditInput(id, false, "none");
    }

    event.preventDefault();
  }

  enableEditInput(id, bool, message) {
    let toggle = false;
    if (bool) {
      this.setState({ editingMessage: message });
    }
    let editedModelActivate = { ...this.state.modelActivate };
    for (var key in editedModelActivate) {
      if (parseInt(key) !== parseInt(id)) {
        editedModelActivate[key] = false;
      }
    }
    if (editedModelActivate[id]) {
      editedModelActivate[id] = false;
    } else {
      editedModelActivate[id] = true;
    }
    this.setState({ modelActivate: editedModelActivate });
  }

  editMessageOnChange(event, id) {
    this.setState({
      editingMessage: event.target.value,
    });
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
          this.getRooms();
          this.setState({selectedUsersForCreatingRoom: []});
          // this.state.selectedUsersForCreatingRoom.length = 0;
          // this.dropdownlist.current.dropdown('clear');
        },
        (error) => {
          alert("Room with these users is already created", error);
        }
      );
  }

  connectRoom(event) {
    if (this.state.room != "") {
      socket.emit("leave", {
        username: this.state.username,
        userid: this.state.userid,
        room: this.state.room,
      });
    }
    socket.emit("join", {
      username: this.state.username,
      userid: this.state.userid,
      room: event.target.value,
    });
    var room = this.state.rooms.filter(
      (room) => parseInt(room.id) == parseInt(event.target.value)
    )[0];
    this.setState({
      room: event.target.value,
      messages: [],
      roomDisplay: room.roomName,
    });
  }

  deleteRoom() {
    axios
      .post(
        "/rooms/delete",
        { roomid: this.state.room, userId: this.state.userid },
        {
          headers: { Authorization: getHeaderToken() },
        }
      )
      .then((res) => {
        // this.setState({ room: "", roomDisplay: "", messages: [] });
      });
  }

  editRoomNameOnChange(event) {
    this.setState({
      roomDisplay: event.target.value,
    });
  }

  editRoomName(event) {
    console.log(this.state.roomDisplay);
    axios
      .post(
        "/rooms/edit",
        { roomid: this.state.room, name: this.state.roomDisplay },
        {
          headers: { Authorization: getHeaderToken() },
        }
      )
      .then((res) => {
        // console.log(res);
        // this.setState({editRoomName: false})
      });
    event.preventDefault();
  }

  displayMessages = () =>
    this.state.messages.map((item, i) => (
      <div class="columns is-vcentered is-flex is-centered">
        <div class="column is-narrow">
          <figure
            class="image is-64x64"
            data-tooltip={item.username}
            data-position="right center"
            data-variation="mini"
            data-inverted=""
          >
            <img class="is-rounded" src={foot}></img>
          </figure>
        </div>
        <div class="column">
          <article
            className={
              "message is-small " +
              (item.removed === true ? " is-danger" : "") +
              (parseInt(this.state.userid) === parseInt(item.userId)
                ? " is-success"
                : " is-info")
            }
            data-tooltip={new Date(item.time).toLocaleString("en-AU")}
            data-position="bottom left"
            data-variation="mini"
            data-inverted=""
          >
            <div class="message-header has-text-black">
              <p>
                {item.username} {item.edited === true && "<edited>"}
              </p>

              {parseInt(this.state.userid) === parseInt(item.userId) &&
                !item.removed && (
                  <div>
                    <a
                      class="button is-text is-small"
                      onClick={() =>
                        this.enableEditInput(item.id, true, item.message)
                      }
                    >
                      <span class="icon">
                        <i class="fas fa-edit"></i>
                      </span>
                    </a>
                    <a
                      class="button is-text is-small"
                      onClick={() => {
                        if (window.confirm("Do you want to Delete?"))
                          this.deleteMessage(item.id);
                      }}
                    >
                      <span class="icon">
                        <i class="fas fa-trash"></i>
                      </span>
                    </a>
                  </div>
                )}
            </div>
            <div class="message-body has-text-black">
              {this.state.modelActivate[item.id] ? (
                <form
                  onSubmit={(e) => {
                    if (window.confirm("Do you want to edit?"))
                      this.editMessage(e, true, item.id);
                    else this.editMessage(e, false, item.id);
                  }}
                  style={{ width: "100%" }}
                  // onBlur={() => this.enableEditInput(item.id, false, '')}
                >
                  <div class="field has-addons">
                    <p class="control is-expanded">
                      <input
                        name={"editMessage" + item.id}
                        class="input is-rounded"
                        type="text"
                        onChange={(e) => this.editMessageOnChange(e, item.id)}
                        value={this.state.editingMessage}
                        disabled={this.state.room === ""}
                      />
                    </p>
                    <p class="control">
                      <button class="button is-danger is-rounded" type="submit">
                        Edit
                      </button>
                    </p>
                  </div>
                </form>
              ) : (
                <span>{item.message}</span>
              )}
            </div>
          </article>
        </div>
      </div>
    ));

  render() {
    return (
      <div>
        <Navbar></Navbar>
        <div class="columns" style={{ padding: "10px" }}>
          <div class="column is-one-fifth">
            <Form onSubmit={this.createRoom}>
              <div
                class="columns is-flex is-centered"
                // style={{ padding: "5px" }}
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
                    value={this.state.selectedUsersForCreatingRoom}
                    ref={this.dropdownlist} 
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
                  {item.roomName}
                </button>
              </div>
            ))}
          </div>
          <div class="column">
            <div class="message-header">
              {this.state.editRoomName ? (
                <form
                  onSubmit={(e) => {
                    if (window.confirm("Do you want to edit?"))
                      this.editRoomName(e);
                  }}
                  style={{ width: "90%" }}
                  // onBlur={() => this.enableEditInput(item.id, false, '')}
                >
                  <div class="field has-addons">
                    <p class="control is-expanded">
                      <input
                        name={"editMessage" + this.state.roomDisplay}
                        class="input is-rounded"
                        type="text"
                        onChange={this.editRoomNameOnChange}
                        value={this.state.roomDisplay}
                        disabled={this.state.room === ""}
                      />
                    </p>
                    <p class="control">
                      <button class="button is-danger is-rounded" type="submit">
                        Edit
                      </button>
                    </p>
                  </div>
                </form>
              ) : (
                <p>{this.state.roomDisplay}</p>
              )}
              {this.state.roomDisplay !== "" && this.state.room !== "1" && (
                <div>
                  <a
                    class="button is-text is-small"
                    onClick={() => {
                      this.setState({ editRoomName: !this.state.editRoomName });
                    }}
                  >
                    <span class="icon has-text-light">
                      <i class="fas fa-edit"></i>
                    </span>
                  </a>
                  <a
                    class="button is-text is-small"
                    onClick={() => {
                      if (window.confirm("Do you want to Delete?"))
                        this.deleteRoom();
                    }}
                  >
                    <span class="icon has-text-light">
                      <i class="fas fa-trash"></i>
                    </span>
                  </a>
                </div>
              )}
            </div>
            <div
              id="messageDiv"
              class="message-body"
              style={{ width: "100%", height: "1000px", overflow: "auto" }}
            >
              <div class="message-body" style={{}}>
                {this.state.room === "" && (
                  <p>Click on the buttons on the right to start a chat</p>
                )}
                {this.state.messages.length === 0 && this.state.room !== "" && (
                  <span>No Messages</span>
                )}
                {this.displayMessages()}
              </div>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column is-one-fifth"></div>
          <div class="column">
            <div class="container is-fluid">
              <form onSubmit={this.sendMessage} style={{ width: "100%" }}>
                <input
                  name="sendMessage"
                  class="input is-rounded"
                  type="text"
                  style={{ width: "80%" }}
                  onChange={this.inputChange}
                  value={this.state.sendMessage}
                  disabled={this.state.room === ""}
                  placeholder="Write something"
                ></input>
                <button
                  class="button is-primary is-rounded"
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
