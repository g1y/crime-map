import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';

import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

import Dropdown from './dropdown.js';

export default class Header extends Component {
    constructor(props) {
        super(props);
    }
    /**
     *
        <Dropdown/> <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-success">Search</Button>
        </Form>
    */

    render() {
        return <Navbar bg="light" expand="sm">
        <Navbar.Brand href="#home">Crime Map</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                <Nav.Link href="#home">Home</Nav.Link>
                <Button onClick={() => this.props.setMarkerColoring('type')} variant="link" >Color by Type</Button>
                <Button onClick={() => this.props.setMarkerColoring('severity')} variant="link" >Color by Severity</Button>
            </Nav>
        </Navbar.Collapse>
        </Navbar>;
    }
}

