import React, { Component } from "react";
//import ReactDOM from "react-dom";
import axios from "axios";
import { getHeaderToken } from "./Authentication/JwtConfig";
import Navbar from "./NavBar";
import TeamList from "./TeamList/TeamsList";
import Cookies from "js-cookie";
import "./Task/Home.scss";
import "./banner.PNG"
//import { getHeaderToken } from "../Authentication/JwtConfig";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const getItems = (count, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k + offset}`,
    content: `item ${k + offset}`,
  }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "#c3effa" : "white",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "#ddd1e6" : "#b5a3c2",
  padding: grid,
  width: 350,
});

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      newItem:"",
      list: [],
      items:getItems(10),
      selected: getItems(5, 10),
    };
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
        // this.getCreatedTasks();
      });
  }

  /**
   * A semi-generic way to handle multiple lists. Matches
   * the IDs of the droppable container to the names of the
   * source arrays stored in the state.
   */
  id2List = {
    droppable: "items",
    droppable2: "selected",
  };

  getList = (id) => this.state[this.id2List[id]];

  onDragEnd = (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index
      );

      let state = { items };

      if (source.droppableId === "droppable2") {
        state = { selected: items };
      }

      this.setState(state);
    } else {
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );

      this.setState({
        items: result.droppable,
        selected: result.droppable2,
      });
    }
  };

  updateInput(key, value){
    //update react state
    this.setState({
      [key]: value
    });
  }

  addItem(){
    //Create item with unique id

    const newItem={
      id: 1+ Math.random(),
      value: this.state.newItem.slice()
    };

    //copy of current list of items
    const list = [...this.state.list];

    //add new item to list
    list.push(newItem);

    //update state with new list and reset newitem input

    this.setState({
      list,
      newItem:""
    });

  }
  deleteItem(id){
    //copy current list of items
    const list = [...this.state.list];

    //filter out item being deleted 
    const updatedList = list.filter(item => item.id !== id);

    this.setState({list: updatedList});


  }

  render() {
    return (
      <div >
        <Navbar />
        {/* added the background picture */}
        <div style={{ backgroundImage: `url(${require("./gray.jpg")})` }}>
          <section class="hero">
            <div class="hero-body">
              <div>
                <h1 class="title" align ="center" text="bold">Welcome to the Main Board :)</h1><br/>
                {/* <p>Email: {this.state.user.email}</p>
                <p>Name: {this.state.user.name}</p> */}

                {/* {this.state.tasks.length == 0 ? (
                  "No Tasks"
                ) : ( */}

                {/* list one */}

                <div className="center-me">
                  <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="droppable">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          style={getListStyle(snapshot.isDraggingOver)}
                        >
                          {/* title for list - 1  */}
                          <h1
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                            class="title"
                          >
                            To Do
                          </h1>

                          {this.state.items.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                  )}
                                >
                                  {item.content}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>

                    {/* List two */}

                    <Droppable droppableId="droppable2">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          style={getListStyle(snapshot.isDraggingOver)}
                        >
                          {/* title for list - 2  */}
                          <h1
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                            class="title"
                          >
                            Doing
                          </h1>
                          {this.state.selected.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                  )}
                                >
                                  {item.content}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>

                    {/* List three */}

                    <Droppable droppableId="droppable3">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          style={getListStyle(snapshot.isDraggingOver)}
                        >
                          {/* title for list - 3  */}
                          <h1
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                            class="title"
                          >
                            Done 
                          </h1>
                          {this.state.selected.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                  )}
                                >
                                  {item.content}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              </div>


              {/* start here */}

              <div className="Home">
                <div>
                  Add an Item..
                  <br/>
                  <input
                    type="text"
                    placeholder="Type item here..."
                    value={this.state.newItem}
                    onChange={e => this.updateInput("newItem",e.target.value)}
                  />
                  <button
                    onClick={() => this.addItem()}
                  >
                    Add
                  </button>
                  <br/>
                  <ul>
                  {this.state.list.map(item => {
                    return(
                      <li key={item.id}>
                        {item.value}
                        <button
                          onClick={() => this.deleteItem(item.id)}
                        >
                        x 
                        </button>
                      </li>
                    )
                  })}  
                  </ul>

                </div>

              </div>
            
            </div>
          </section>
        </div>
      </div>
    );
  }
}
