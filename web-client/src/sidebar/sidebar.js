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
`

export default class SideBar extends Component {
    constructor(props) {
        super(props)

        this.state = {
            alertList: [
                {'id': uuidv4(), time: null, name: 'Neighborhood Watch', type: 'watch'},
                {'id': uuidv4(), time: null, name: 'Friend\'s Place', type: 'watch'},
                {'id': uuidv4(), time: '13:50', name: '2 officers pulled over', type: 'event'},
            ]
        }
    }

    createAlertHandler() {
        const list = this.state.alertList
        list.push({
            id: uuidv4(),
            time: null,
            name: 'New Alert',
            type: null,
            new: true,
        })
        this.setState({alertList: list})
    }

    render() {
        const alertList = this.state.alertList.map((alertData) => {
            return <Alert key={alertData.id} id={alertData.id} time={alertData.time}
                name={alertData.name} type={alertData.type} new={alertData.new}></Alert>
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