import React, { Component } from "react";
//import ReactDOM from "react-dom";
import axios from "axios";
import { getHeaderToken } from "./Authentication/JwtConfig";
import Navbar from "./NavBar";
import Cookies from "js-cookie";
import "./Task/Home.scss";
//import { getHeaderToken } from "../Authentication/JwtConfig";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";


// fake data generator
const getItems = (tasks) =>
  tasks.map((k) => ({
    id: `item-${k.id}`,
    title: `${k.title}`,
    name: `${k.name}`,
    description: `${k.description}`,
  }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "#00FFb7" : "white",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "#A600FF" : "lightgrey",
  padding: grid,
  width: "30%",
});


export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      tasks: [],
      items: [],
    };
    this.getCreatedTasks = this.getCreatedTasks.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  
    // axios
    //   .get("/protected", { headers: { Authorization: getHeaderToken() } })
    //   .then((res) => {
    //     this.setState({
    //       user: res.data,
    //     });
    //     Cookies.set("username", res.data['name']);
    //     Cookies.set("userid", res.data['id']);
    //     this.getCreatedTasks();
    //   });
  }

  componentDidMount() {
    axios
      .get("/protected", { headers: { Authorization: getHeaderToken() } })
      .then((res) => {
        this.setState({
          user: res.data,
        });
        Cookies.set("username", res.data['name']);
        Cookies.set("userid", res.data['id']);
        this.getCreatedTasks();
      });
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items,
    });
  }

  getCreatedTasks() {
    axios
      .post(
        "/getCreatedTasks",

        {
          requestUserId: this.state.user.id,
        }
      )
      .then(
        (res) => {
          console.log(res);
          this.setState({ tasks: res.data, items: getItems(res.data) });
        },
        (error) => {
          console.log("error");
        }
      );
  }

  displayTasks = () =>
    this.state.tasks.map((task) => (
      <div class="card" key={task.id}>
        <header class="card-header">
          <p class="card-header-title">{task.title}</p>
        </header>
        <div class="card-content">
          <div class="content">{task.description}</div>
        </div>
        <footer class="card-footer">
          <a href="#" class="card-footer-item">
            Action1
          </a>
          <a href="#" class="card-footer-item">
            Action2
          </a>
          <a href="#" class="card-footer-item">
            Action3
          </a>
        </footer>
      </div>
    ));

  render() {
    return (
      <div>
        <Navbar />
        <div>
          <section class="hero">
            <div class="hero-body">
              <div>
                <h1 class="title">Main Board</h1>
                <p>Email: {this.state.user.email}</p>
                <p>Name: {this.state.user.name}</p>


                {this.state.tasks.length == 0 ? (
                  "No Tasks"
                ) : (
                  <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="droppable">
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={getListStyle(snapshot.isDraggingOver)}
                        >
                          {this.state.items.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  class="card"
                                  key={item.id}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                  )}
                                >
                                  <header class="card-header">
                                    <p class="card-header-title">
                                      {item.title}
                                    </p>
                                  </header>
                                  <div class="card-content">
                                    <div class="content">
                                      {item.description}
                                    </div>
                                  </div>
                                  <footer class="card-footer">
                                    <a href="#" class="card-footer-item">
                                      Action1
                                    </a>
                                    <a href="#" class="card-footer-item">
                                      Action2
                                    </a>
                                    <a href="#" class="card-footer-item">
                                      Action3
                                    </a>
                                  </footer>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}


              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}
