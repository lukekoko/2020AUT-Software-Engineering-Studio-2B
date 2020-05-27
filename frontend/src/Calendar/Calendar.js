import React, { Component } from "react";
import Navbar from "../NavBar";
import { withRouter } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
moment.locale("en-GB");
const localizer = momentLocalizer(moment);
const myEventsList = {} //empty object for now
class Calendar extends Component{
  constructor(){
   //will populate this function later
  }
  componentDidMount(){
   //will populate this function later
  }
  render(){
    return(
      <div>
      <Navbar />
      <Calendar
        localizer={localizer}
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
      />
      </div>
    )
  }
}
export default withRouter(Calendar);
 