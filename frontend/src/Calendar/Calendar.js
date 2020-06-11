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
const myEventsList = [
 
  {
    id: 0,
    title: 'Assessment 2-2',
    start: new Date(2020, 5, 5),
    end: new Date(2020, 5, 5, 23, 59),
},
{
  id: 0.5,
  title: '8th Journal',
  start: new Date(2020, 5, 5),
  end: new Date(2020, 5, 5, 23, 59),
},
{
    id: 1,
    title: 'Website Demo',
    start: new Date(2020, 5, 11, 16),
    end: new Date(2020, 5, 11, 18),
},
{
  id: 0,
  title: 'Group meeting',
  start: new Date(2020, 5, 1),
  end: new Date(2020, 5, 1),
}

] 


class myCalendar extends Component{
 render()
 {
return(
  <div style={{ height: 700 }}>
    <Navbar></Navbar>
     <Calendar
        localizer={localizer}
        events={myEventsList}
        selectable={true}
        startAccessor="start"
        endAccessor="end"
      />
</div>
 
);
  }
}
export default withRouter(myCalendar);
 