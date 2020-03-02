import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';

import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';


import styled from 'styled-components';

const StyledBG = styled(ToggleButtonGroup)`
    margin: 0 20px 0 40px;
`

const ColoringButton = styled(Button)`
    &.selected {
        color: #0056b3;
    }
`

const LocationForm = styled.form`
    display: fixed;
`

const LocationDropdown = styled.div`
    color: red;
    width: 20rem;
    height: 50px;
    border: 2px solid #aaa;
    background: white;
    position: absolute;
    /* top: -100px;*/
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

    sendWatchRequest(crd) {
        const data = {
            'lat': crd.latitude,
            'lng': crd.longitude,
            'accuracy': crd.accuracy,
        }

        const url = __API_ROOT__ + "/watch"
        console.log("Sending request")
        return fetch(url, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data),
        })
    }

    createWatch() {
        this.getLocation().then((pos) => {
            const crd = pos.coords;
            return crd
        }).then(this.sendWatchRequest).then(res => res.json()).then((data) => {
            console.log("RESPONSE", data)
        }).catch((err) => {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        })
    }

    getLocation() {
        var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
         };

         return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, options);
         })
    }

    render() {
        return <Navbar bg="light" expand="sm">
        <Navbar.Brand href="#home">Crime Map</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                {/*<Nav.Link href="#home">Home</Nav.Link>*/}

                <StyledBG type="radio" name="options">
                    <ToggleButton value="type" onClick={() => this.setColoring('type')} >Color by Type</ToggleButton>
                    <ToggleButton value="severity" onClick={() => this.setColoring('severity')} >Color by Severity</ToggleButton>
                </StyledBG>


                <Button onClick={this.createWatch.bind(this)} variant="light">Sighted Activity</Button>
                <Button onClick={this.createWatch.bind(this)} variant="light">Watch Area</Button>
            </Nav>
        </Navbar.Collapse>
        </Navbar>;
    }
}