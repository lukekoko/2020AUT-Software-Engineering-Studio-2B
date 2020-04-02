import React, { Component } from "react";
import ReactDOM from 'react-dom';
//import logo from './logo.svg';
//import './App.css';
import Login from './login';

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
      data: []
    };
    fetch('http://127.0.0.1:5000/')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      this.setState({'data': data})
      console.log(data);
    });
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
    
  }

  renderLogin = () => {
    ReactDOM.render(<Login/>, document.getElementById('root'));
  }

  todoTableRows = () => this.state.data.map(item =>
    <tr key={ item.id }>
    <td>{ item.email}</td>
    <td>{item.name}</td>
    </tr> );

  render() {
    return (
      <div>
        {this.state.userName}'s To Do List ({this.state.todoItems.length} items)
        <input class="input" type="text" placeholder="Item Name" value={this.state.newItemText} onChange={this.updateNewTextValue}></input>
        <button className="button" onClick={this.createNewTodo}>
          Add Item
        </button>
        <button className="button" onClick={this.getUser}>Get Users</button>
        <table>
                    <thead>
                        <tr><th>Email</th><th>Name</th></tr>
                    </thead>
                    <tbody>{ this.todoTableRows() }</tbody>
                </table>
        <button className="button" onClick={this.renderLogin}>Login</button>
      </div>
    );
  }
}
