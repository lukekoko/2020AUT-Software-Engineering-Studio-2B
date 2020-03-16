import React, { Component } from "react";
//import logo from './logo.svg';
//import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "Adam",
      todoItems: [
        { action: "Buy Flowers", done: false },
        { action: "Get Shoes", done: false },
        { action: "Collect Tickets", done: true },
        { action: "Call Joe", done: false }
      ],
      newItemText: "",
      data: {}
    };
    
  }

  updateNewTextValue = event => {
    this.setState({ newItemText: event.target.value });
  };

  createNewTodo = () => {
    if (
      !this.state.todoItems.find(item => item.action === this.state.newItemText)
    ) {
      this.setState({
        todoItems: [
          ...this.state.todoItems,
          { action: this.state.newItemText, done: false }
        ],
        newItemText: ""
      });
    }
  };

  getUser = () => {
    fetch('http://127.0.0.1:5000/')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      this.setState({'data': data})
      console.log(data);
    });
  }

  render() {
    return (
      <div>
        {this.state.userName}'s To Do List ({this.state.todoItems.length} items)
        <input class="input" type="text" placeholder="Item Name" value={this.state.newItemText} onChange={this.updateNewTextValue}></input>
        <button className="button" onClick={this.createNewTodo}>
          Add Item
        </button>
        <button className="button" onClick={this.getUser}>Get Users</button>
      </div>
    );
  }
}
