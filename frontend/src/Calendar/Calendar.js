import React, { Component } from "react";
import Navbar from "../NavBar";
import { withRouter } from "react-router-dom";
import {
  Calendar,
  DateLocalizer,
  momentLocalizer,
  globalizeLocalizer,
  move,
  Views,
  Navigate,
  components,
} from 'react-big-calendar'
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
moment.locale("en-GB");
const localizer = momentLocalizer(moment)
const myEventsList = [] //empty object for now

class myCalendar extends Component{
 render()
 {
return(
  <div style={{ height: 700 }}>
    <Navbar></Navbar>
     <Calendar
        localizer={localizer}
        events={myEventsList}
        
        startAccessor="start"
        endAccessor="end"
      />
</div>
 
);
  }
}
export default withRouter(myCalendar);
 