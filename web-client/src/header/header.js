import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';

import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

import styled from 'styled-components';

import Dropdown from './dropdown.js';

const ColoringButton = styled(Button)`
    &.selected {
        color: #0056b3;
    }
`

export default class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            coloring: 'none'
        }
    }

    setColoring(coloring) {
        this.setState({'coloring': coloring})
        this.props.setMarkerColoring(coloring)
    }

    render() {
        return <Navbar bg="light" expand="sm">
        <Navbar.Brand href="#home">Crime Map</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                <Nav.Link href="#home">Home</Nav.Link>
                <ColoringButton className={ this.state.coloring == "type" ? "selected" : ""} onClick={() => this.setColoring('type')} variant="link" >Color by Type</ColoringButton>
                <ColoringButton className={ this.state.coloring == "severity" ? "selected" : ""} onClick={() => this.setColoring('severity')} variant="link" >Color by Severity</ColoringButton>
            </Nav>
        </Navbar.Collapse>
        </Navbar>;
    }
}