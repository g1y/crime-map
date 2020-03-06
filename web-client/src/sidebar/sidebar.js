import React, { Component } from 'react';
import  styled from 'styled-components';

import CreateAlert from '../alerts/create-alert';
import Alert from '../alerts/alert';

import { v4 as uuidv4 } from 'uuid';

const StyledSideBar = styled.div`
    width: 100%;
    @media all and (min-width: 800px) {
        width: 50%;
    }

    @media all and (max-width: 800px) {
        display: none;
    }

    height: calc(100vh - 56px);
    right: 0;
    position: absolute;
    padding: 30px;

    h2 {
        margin-right: 20px;
        display: inline-block;
    }

    ul {
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        padding-left: 0;
    }

    overflow-y: scroll;
`

export default class SideBar extends Component {
    constructor(props) {
        super(props)

        this.state = {
            alertList: []
        }

        this.deleteAlert = this.deleteAlert.bind(this)
    }

    deleteAlert(id) {
        this.setState({
            alertList: this.state.alertList.filter(alert => alert._id != id),
        })
    }

    componentDidMount() {
        this.getAllAlerts()
    }

    getAllAlerts() {
        return fetch(`${__API_ROOT__}/alerts`)
        .then((res) => res.json())
        .then((json) => {
            this.setState({
                alertList: json
            })
        }).catch((err) => {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        })
    }

    createAlertHandler() {
        const list = this.state.alertList
        list.push({
            _id: uuidv4(),
            time: null,
            name: 'New Alert',
            type: null,
            new: true,
        })
        this.setState({alertList: list})
    }

    render() {
        const alertList = this.state.alertList.map((alertData) => {
            return <Alert key={alertData._id} id={alertData._id} time={alertData.time}
                name={alertData.name} type={alertData.type} new={alertData.new} deleteSelf={this.deleteAlert}></Alert>
        })

        return <StyledSideBar>
            <h2>Police Log Alerts</h2>
            <CreateAlert onSubmit={this.createAlertHandler.bind(this)}></CreateAlert>

            <ul>
                {alertList}
            </ul>
        </StyledSideBar>
    }
}