import React, { Component } from "react";
import React, {Component} from "react-beautiful-dnd"; 
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
    };

    var btn = document.querySelector('.add');
    var remove = document.querySelector('.draggable');
    var dragSrcEl=null; 

    function dragStart(event) {
      this.style.oppacity = '0.4';
      dragSrcEl = this;
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/html', this.innerHTML)
    };

    function dragEnter(event){
      this.classList.add('over');
    }

    function dragLeave(event){
      event.StopPopagation();
      this.classList.remove('over');
    }

    function dragOver(event){
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    }

    function dragDrop(event){
      if (dragSrcEl != this){
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = event.dataTransfer.getData('text/html');
      }
      return false; 
    }

    function dragEnd(event){
      var listItems = document.querySelectorAll('.draggable');
      [].forEach.call(listItems, function(item) {
        item.classList.remove('over');
      });
      this.style.opacity = '1';
    }

    function Elements(element) {
      element.addEventListener('dragStart', dragStart, false);
      element.addEventListener('dragenter', dragEnter, false);
      element.addEventListener('dragover', dragOver, false);
      element.addEventListener('dragleave', dragLeave, false);
      element.addEventListener('drop', dragDrop, false);
      element.addEventListener('dragend', dragEnd, false);

    }

    var listItems = document.querySelectorAll('.draggable');
    [].forEach.call(listItems, function(item){
      Elements(item);
    });

     function addNewItem(){
      var newItem = document.querySelector('.input').value;
      if (newItem != '') {
        document.querySelector('.input').value = '';
          var li = document.createElement('li');
          var attr = document.createAttribute('draggable');
          var ul = document.querySelector('ul');
            li.className = 'draggable';
            attr.value = 'true';
            li.setAttributeNode(attr);
            li.appendChild(document.createTextNode(newItem));
            ul.appendChild(li);
              Elements(li);
      } 
    } //btn.addEventListener('click', addNewItem);
    

    // function onDragStart(event){
    //   event.dataTransfer.setData('text/plain', event.target.id);
  
  
    //   event .currentTarget.style.backgroundColor = 'yellow';
    // }   

    // function onDragOver(event){
    //   event.preventDefault();
    //   //event.dataTransfer.dropEffect = 'move'; 
    // }

    // function onDrop(event){
    //   const id = event.dataTransfer.getData('text/plain');

    //   const draggableElement = document.getElementById(id);
    //   const dropzone = event.target; 

    //   dropzone.appendChild(draggableElement);

    //   event.dataTransfer.clearData(); 

    // }

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
            </div>
          </section>
              {/* <div class = 'parent'>
                <span id= 'dragableSpan' 
                  draggable ='true'
                  ondragstart = 'onDragStart(event);'>
                   To-Do
                </span>
                <span ondragover = 'onDragOver(event);'
                ondrop = 'onDrop(event);'>
                    Done
                </span>
          </div> */}

          <div class = 'list'>
            <input type = 'text' class = 'input' placeholder = 'Add item'/>
            <span class = "add">+</span>
          </div>
          <ul>
          <li class="draggable" draggable="true">task 1</li>
          <li class="draggable" draggable="true">task 2</li>
          <li class="draggable" draggable="true">task 3</li>
          <li class="draggable" draggable="true">task 4</li>
          <li class="draggable" draggable="true">task 5</li>
          </ul>
            
        </div>
      </div>
    );
  }
}
