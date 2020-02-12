import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';

import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

import Dropdown from './dropdown.js';

export default class Header extends Component {
    render() {
        return <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">Crime Map</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                <Nav.Link href="#home">Home</Nav.Link>
                <Nav.Link href="#link">My Reports</Nav.Link>
            </Nav>
            <Dropdown/>
            <Form inline>
                <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                <Button variant="outline-success">Search</Button>
            </Form>
        </Navbar.Collapse>
        </Navbar>;
    }
}