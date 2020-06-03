import React, { Component } from "react";
import Cookies from "js-cookie";
import { withRouter } from "react-router-dom";
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
import axios from "axios";
import Navbar from "../NavBar";
import { getHeaderToken } from "../Authentication/JwtConfig";
import "./task.scss";

class CreateTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      loginSuccessful: Boolean,
      description: [],
      users: [],
      user: null,
      selectedUsersIDs: [],
    };
    this.getUsers = this.getUsers.bind(this);
    this.createTask = this.createTask.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
  }

  componentDidMount() {
    this.getUsers();
    this.getCurrentUser();
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  onSelectChange(event, value) {
    this.setState({
      selectedUsers: value.value,
    });
  }

  getUsers() {
    axios
      .get("/users", { headers: { Authorization: getHeaderToken() } })
      .then((res) => {
        if (res.data) {
          res.data.map((item) =>
            this.setState({
              users: this.state.users.concat({
                key: item.id,
                text: item.name,
                value: item.id,
              }),
            })
          );

          console.log(res.data);
        }
      });
  }

  getCurrentUser() {
    axios
      .get("/protected", { headers: { Authorization: getHeaderToken() } })
      .then((res) => {
        this.setState({
          user: res.data,
        });
        Cookies.set("username", res.data["name"]);
        Cookies.set("userid", res.data["id"]);
      });
  }

  createTask() {
    console.log(
      this.state.user["name"],
      this.state.title,
      this.state.description,
      this.state.user["id"],
      this.state.selectedUsers
    );
    axios
      .post("/createTask", {
        name: this.state.user["name"],
        title: this.state.title,
        description: this.state.description,
        assignerID: this.state.user["id"],
        assignedIDS: this.state.selectedUsers,
      })
      .then(
        (res) => {
          alert("Create Task Successful", res);
        },
        (error) => {
          alert("Create Task Error", error);
        }
      );
  }

  render() {
    return (
      <div>
        <Navbar></Navbar>
        <div class="background_task">
          <div className="containerTask">
            <Grid className="card" style={{ width: "50%" }}>
              <Grid.Column width={16}>
                <Grid stackable style={{ justifyContent: "center" }}>
                  <Grid.Row>
                    <Grid.Column>
                      <Header className="htn">Create a task</Header>
                      <Form onSubmit={this.createTask}>
                        <Form.Field>
                          <input
                            name="title"
                            className="create_task_input"
                            placeholder="Title"
                            onChange={this.handleChange}
                            value={this.state.title}
                          />
                        </Form.Field>

                        <Form.Field>
                          <TextArea
                            name="description"
                            placeholder="Description"
                            onChange={this.handleChange}
                            value={this.state.description}
                            className="create_task_textarea"
                          />
                        </Form.Field>

                        <Dropdown
                          placeholder={
                            this.state.users.length == 0
                              ? "No users registered"
                              : "Members to assign tasks to"
                          }
                          multiple
                          selection
                          options={this.state.users}
                          fluid
                          disabled={this.state.users.length == 0 ? true : false}
                          onChange={this.onSelectChange}
                        ></Dropdown>

                        <Form.Field>
                          <Button className="btn_submit" type="submit">
                            Submit
                          </Button>
                        </Form.Field>
                      </Form>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(CreateTask);
