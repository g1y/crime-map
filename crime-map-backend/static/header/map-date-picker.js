import React, { Component } from 'react';

import DatePicker from 'react-date-picker';

import './map-date-picker.css';

export default class MapDatePicker extends Component {
    constructor() {
        super();
        this.onChange = (date) => {this.setState({date: date})};
    }

    render() {
        if (!this.state) {
            this.state = {
                date: new Date(),
            };
        }
        return <DatePicker className="map-date-picker" onChange={this.onChange} value={this.state.date} />;
    }
}