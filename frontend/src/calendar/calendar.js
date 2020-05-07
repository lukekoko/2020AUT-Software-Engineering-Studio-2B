import React, { Component } from "react";
import Cookies from "js-cookie";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { getToken } from "./JwtConfig";
import { Button, Header, Grid, Form } from "semantic-ui-react";
import Calendar from 'react-calendar'
// https://www.npmjs.com/package/react-calendar

class Calendar1 extends Component {

  render() {
        return (
            <Calendar />
        )
    }
}



export default withRouter(Calendar1);