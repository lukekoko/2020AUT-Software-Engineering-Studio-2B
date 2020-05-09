import React, { Component } from "react";
import Navbar from "../NavBar";
import "./Home.scss";
import axios from "axios";
import 'bulma/css/bulma.css'
import { getHeaderToken } from "../Authentication/JwtConfig";

export default class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      tasks : []
    };

    this.getTasks = this.getTasks.bind(this);
    axios
      .get("/protected", { headers: { Authorization: getHeaderToken() } })
      .then((res) => {
        this.setState({
          user: res.data,
        });
        this.getTasks();
      });
  }

  getTasks() {
    axios
      .post("/getTasks", {
        requestUserId: this.state.user.id
      }).then(
        (res) => {
          console.log(res);
          this.setState({tasks: res.data});
        },
        (error) => {
          console.log('error');
        }
      );
  }

       displayTasks = () => this.state.tasks.map(task =>
        <div class="card" key={task.id}>
          <header class="card-header">
            <p class="card-header-title">
              {task.title}
            </p>
          </header>
          <div class="card-content">
            <div class="content">
              {task.description}
            </div>
          </div>
          <footer class="card-footer">
            <a href="#" class="card-footer-item">Action1</a>
            <a href="#" class="card-footer-item">Action2</a>
            <a href="#" class="card-footer-item">Action3</a>
          </footer>
        </div>
        );

  render() {
    return (
      <div>
        <Navbar />
        <div>
          <section class="hero">
            <div class="hero-body">
              <div>
                <h1 class="title">Tasks Page</h1>
                <div>{this.displayTasks()}</div>
                {this.state.tasks.length == 0
                        ? "No Tasks"
                        : "Meme"}
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}
