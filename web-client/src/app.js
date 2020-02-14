import React from "react";
import './full-page.css';

import Header from './header/header.js';
import AppleMap from './map/apple-map.js';
import './report-info.css';
import './map.css';
import './full-page.css';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'markerColoring': 'severity',
        };

        this.mapRef = React.createRef();
    }

    setMarkerColoring(coloring, e) {
        if (coloring != this.state.markerColoring) {
            this.setState({
                'markerColoring': coloring,
            });

            this.mapRef.current.color(coloring);
        }
    }

    render() {
        return <>
            <AppleMap ref={this.mapRef} markerColoring={this.state.markerColoring}/>
            <Header color={AppleMap.color} setMarkerColoring={this.setMarkerColoring.bind(this)} />
        </>
    }
}