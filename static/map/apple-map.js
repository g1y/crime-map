import Map from './map.js';
import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';

import { createCrimeMarker } from '../crime-marker';

export default class AppleMap extends Component {
    constructor(props) {
        super(props);
        var self = this;
        this.state = {
            markers: [],
            filters: {},
            coloring: this.colorMarkersByType.bind(self),
            map: this.initMap(),
        };
    }

    assignMarkerGroupsColors(markerGroups) {
        let colors = ["#ff3b30", "#ff9500", "#ffcc00", "#4cd964", "#5ac8fa", "#007aff", "#5856d6", "#ff2d55"];
        var colorIndex = 0;
        let assignColor = group => {
            group.forEach(item => item.marker.color = colors[colorIndex]);
            colorIndex++;
            if (colorIndex == colors.length) {
                colorIndex = 0;
            }
        }

        Object.values(markerGroups).forEach(assignColor);
    }

    colorMarkersByType(markers) {
        var typeGroups = markers.reduce(function(accumulator, current) {
            if (current.entry.type in accumulator) {
                accumulator[current.entry.type].push(current)
            } else {
                accumulator[current.entry.type] = [current]
            }

            return accumulator;
        }, {});

        this.assignMarkerGroupsColors(typeGroups);
    }

    addMarkers() {
        let map = this.state.map;
        let createMarkers = (responseJson) => {
            var crimeMarkers = responseJson.map(createCrimeMarker).filter(i => !!i);
            this.state.coloring(crimeMarkers);
            this.state.markers = crimeMarkers;

            map.addAnnotations(crimeMarkers.map(markers => markers.marker));
        }
        fetch('/entries?days=10').then(function(response) {
            console.log(response);
            return response.json();
        }).then(createMarkers);
    }

    initMap() {
        mapkit.init({
            authorizationCallback: function(done) {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", "/services/jwt");
                xhr.addEventListener("load", function() {
                    done(this.responseText);
                });
                xhr.send();
            }
        });

        var SLO = new mapkit.CoordinateRegion(
            new mapkit.Coordinate(35.2827524, -120.6596156),
            new mapkit.CoordinateSpan(0.167647972, 0.354985255)
        );

        var map = new mapkit.Map("mapKit");
        map.region = SLO;

        return map;
    }
}