import React, { Component } from 'react';

import styled from 'styled-components';
import Button from 'react-bootstrap/Button';

import FontAwesome from 'react-fontawesome';

const Input = styled.input`
    border: none;

    &:focus {
        border-bottom: 1px solid black;
    }

    color: #555;
    background: #f8f9fa;

    margin-bottom: 10px;
    font-size: 24px;
`


const EditControls = styled.div`
    justify-content: flex-end;
    display: flex;

    .saveButton {
        margin: 20px;
    }

`

const StyledAlert = styled.div`
    &.editing {
        /* border-color: blue; */
        /* position: absolute; */
        width: 820px;
        height: 400px;
    }

    transition: height .1s, width .1s linear;
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
    justify-content: space-around;

    p {
        color: #888;
    }

`

export default class Alert extends Component {
    constructor(props) {
        super(props)

        this.state = {
            editing: this.props.new == true,
            saving: false,
            id: this.props.id,
            time: this.props.time,
            name: this.props.name,
            type: this.props.type,
            // TODO: Implement radius management
            radius: 1,
        }

        this.onChange = this.onChange.bind(this)
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
            radius: this.state.radius,
        }

        return fetch(`${__API_ROOT__}/alert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
    }

    // TODO Show error message when failed request.
    createWatch() {
        this.setState({saving: true})
        this.getLocation().then((pos) => {
            const crd = pos.coords;
            return crd
        }).then(this.sendWatchRequest.bind(this)).then(res => res.json())
            .then((data) => {}).then(() => {
            this.setState({
                saving: false,
                editing: false,
            })
        }).catch((err) => {
            console.warn(`ERROR(${err.code}): ${err.message}`);
            this.setState({
                saving: false,
            })

            throw err
        })
    }

    deleteAlert() {
        fetch(`${__API_ROOT__}/alert/${this.state.id}`, {
            method: 'DELETE',
        }).then(this.props.deleteSelf(this.state.id))
    }

    setEditing() {
        this.setState({
            'editing': true
        })
    }

    onChange(e) {
        this.setState({
            'name': e.currentTarget.value
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


        let saveButton, deleteButton = ""
        if (this.state.editing == true) {
            saveButton = <Button disabled={this.saving} className="saveButton"
                onClick={this.createWatch.bind(this)}>Save</Button>
            deleteButton = <Button onClick={this.deleteAlert.bind(this)} variant="danger" className="saveButton">Delete</Button>
        }

        // TODO: Loading spinner!
        /*<FontAwesome className='super-crazy-colors' name='rocket' size='2x' spin style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}/>*/
            /*<FontAwesome name='trash' size='10px' style={{ 'align-self': 'flex-end' }} />*/
        return <StyledAlert onClick={this.setEditing.bind(this)} className={this.state.editing ? "editing" : ""}>
            <Input onChange={this.onChange} type="text" value={this.state.name}></Input>
            {descriptionEl}
            {timeEl}


            <EditControls>
                {deleteButton}
                {saveButton}
            </EditControls>
        </StyledAlert>
    }
}