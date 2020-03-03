import React, { Component} from 'react';

import Button from 'react-bootstrap/Button';

import styled from 'styled-components'

const StyledButton = styled(Button)`
    display: inline-block;
`

export default class CreateAlert extends Component {
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
        return <StyledButton onClick={this.props.onSubmit} variant="light">Create Alert</StyledButton>
    }
}