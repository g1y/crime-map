import React, { Component } from 'react';

import styled from 'styled-components';
import Button from 'react-bootstrap/Button';

const StyledAlert = styled.div`
    color: #555;
    margin: 10px 20px 10px 0;
    padding: 20px;
    border: 2px solid #eee;
    background: #f8f9fa;
    /* top: -100px;*/
    box-shadow: 2px 2px 4px #eee;

    min-height: 140px;
    width: 400px;

    display: flex;
    flex-direction: column;

    p {
        color: #888;
    }

    .saveButton {
        align-self: flex-end;
    }

`

export default class Alert extends Component {
    constructor(props) {
        super(props)

        let editing = false
        if (this.props.new == true) {
            editing = true
        }
        this.state = {
            editing: editing,
            id: this.props.id,
            time: this.props.time,
            name: this.props.name,
            type: this.props.type,
        }
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

    sendWatchRequest(crd) {
        const data = {
            lat: crd.latitude,
            lng: crd.longitude,
            accuracy: crd.accuracy,
            name: this.state.name,
            type: this.state.type,
            time: this.state.time,
        }

        return fetch(`{__API_ROOT__}/alerts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
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

    render() {
        let timeEl, descriptionEl
        if (this.props.time) {
           timeEl = <p>spotted around {this.props.time}</p>
           descriptionEl = <p>Event sighted</p>
        } else if (this.props.type == 'watch') {
           descriptionEl = <p>Persistent alert</p>
        } else {
           descriptionEl = <p>New Alert</p>
        }

        let saveButton = this.state.editing == true ? <Button className="saveButton">Save</Button> : ""

        return <StyledAlert>
            <h4>{this.props.name}</h4>
            {descriptionEl}
            {timeEl}

            {saveButton}
        </StyledAlert>
    }
}