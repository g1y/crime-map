import React, { Component } from 'react';

import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import MapDatePicker from './map-date-picker.js';

export default class Dropdown extends Component {
    render() {
        return <NavDropdown title="Map Options" id="basic-nav-dropdown" className="mr-sm-1">
            <NavDropdown.Item href="#action/3.4">Heatmap</NavDropdown.Item>

            <NavDropdown.Divider />
            <NavDropdown.Header href="#action/3.4">Color Coding</NavDropdown.Header>
            <NavDropdown.Item href="#action/3.4">Crime Types</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.4">Officer Name</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.4"># of Responders</NavDropdown.Item>

            <NavDropdown.Divider />
            <NavDropdown.Header>By Date</NavDropdown.Header>
            <MapDatePicker className="map-date-picker" id="example-datepicker" />

            <NavDropdown.Divider />
            <NavDropdown.Item><Button variant="primary" block>Apply</Button></NavDropdown.Item>
        </NavDropdown>
    }
}