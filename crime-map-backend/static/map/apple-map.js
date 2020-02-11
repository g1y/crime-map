import Map from './map.js';
import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';

import { createCrimeMarker } from '../crime-marker';

export default class AppleMap extends Component {
    constructor(props) {
        super(props);
        const self = this;
        this.state = {
            markers: [],
            filters: {},
            coloring: this.colorsBySeverity.bind(self),
            map: this.initMap(),
        };
    }

    colorsBySeverity(items) {
        const crimeCategories = {
            "assault": "severe",
            "burg": "severe",
            "theft": "severe",
            "dui": "severe",
            "graffiti": "severe",
            "vandalism": "severe",
            "sex": "severe",
            "loitering": "medium",
            "alcohol": "medium",
            "suspicious": "medium",
            "disorderly": "medium",
            "trespassing": "medium",
            "alarm": "info",
            "noise": "info",
            "animal": "info",
            "keep": "info",
            "deceased": "info",
            "towed": "info",
            "citizen": "info",
            "public": "info",
            "found": "info",
            "lost": "info",
            "assist": "info",
            "parking": "info",
            "traffic": "info",
            "welfare": "info",
            "aband": "info",
            "muni": "info",
            "coll": "info", // Collision
            "9": "info",
        }

        const severityToColor = {
            "severe": "#dc3545",
            "medium": "#ffcc00",
            "info": "#007bff",
        };

        items.forEach(item => {
            const {entry, marker} = item;
            const severity = entry.type in crimeCategories ? crimeCategories[entry.type] : "info";
            marker.color = severityToColor[severity];
        });
    }

    assignTypeColors(markerGroups) {
        // Keeps the type and color matched, so it is consistent
        const typeColorMappings = {
            'noise': "#ffcc00"
        };

        let colors = ["#ff3b30", "#ff9500", "#4cd964", "#5ac8fa", "#007aff", "#5856d6", "#ff2d55"];

        var colorIndex = 0;
        let assignColor = entry => {
            const [groupName, group] = entry

            let color;
            if (groupName in typeColorMappings) {
                color = typeColorMappings[groupName];
            } else {
                color = colors[colorIndex];
                colorIndex++;
            }

            group.forEach(item => {
                item.marker.color = color;
            })

            if (colorIndex == colors.length) {
                colorIndex = 0;
            }
        }

        Object.entries(markerGroups).forEach(assignColor);
    }

    colorMarkersByType(markers) {
        var typeGroups = markers.reduce(function(accumulator, current) {
            const type = current.entry.type.toLowerCase()
            if (current.entry.type in accumulator) {
                accumulator[type].push(current)
            } else {
                accumulator[type] = [current]
            }

            return accumulator;
        }, {});

        this.assignTypeColors(typeGroups);
    }

    addMarkers() {
        let map = this.state.map;
        let createMarkers = (responseJson) => {
            const crimeMarkers = responseJson.map(createCrimeMarker).filter(i => !!i);
            this.state.coloring(crimeMarkers);
            this.state.markers = crimeMarkers;

            map.addAnnotations(crimeMarkers.map(markers => markers.marker));
        }
        fetch('/entries?days=7').then(function(response) {
            console.log(response);
            return response.json();
        }).then(createMarkers);
    }

    initMap() {
        mapkit.init({
            authorizationCallback: function(done) {
                const xhr = new XMLHttpRequest();
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