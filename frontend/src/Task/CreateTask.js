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
    };
    this.getUsers = this.getUsers.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.getUsers();
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  getUsers() {
    axios
      .get("/users", { headers: { Authorization: getHeaderToken() } })
      .then((res) => {
        if (res.data) {
          {
            res.data.map((item) =>
              this.setState({
                users: this.state.users.concat({
                  key: item.id,
                  text: item.name,
                  value: item.id,
                }),
              })
            );
          }
          console.log(res.data);
        }
      });
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
                      <Form onSubmit={this.handleLogin}>
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
