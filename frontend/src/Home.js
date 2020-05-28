import React, { Component } from "react";
import axios from "axios";
import { getHeaderToken } from "./Authentication/JwtConfig";
import Navbar from "./NavBar";
import Cookies from "js-cookie";
import "./Task/Home.scss";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      newItem:"",
      list: [],
    };

    axios
      .get("/protected", { headers: { Authorization: getHeaderToken() } })
      .then((res) => {
        this.setState({
          user: res.data,
        });
        Cookies.set("username", res.data['name']);
        Cookies.set("userid", res.data['id']);
      });


  }

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
      <div>
        <Navbar />
        <div>
          <section class="hero">
            <div class="hero-body">
              <div>
                <h1 class="title">
                  You are now logged in. This is the main dashboard.
                </h1>
                <p>Email: {this.state.user.email}</p>
                <p>Name: {this.state.user.name}</p>
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
