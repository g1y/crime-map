import Button from 'react-bootstrap/Button';
import React from 'react';

export let createCrimeMarker = function(entry) {
    if (!("maps_geocode" in entry)) {
        return null;
    }

    var location = entry.maps_geocode[0].geometry.location;
    var title = "type" in entry ? entry.type : "";
    title = title.substring(0, 1).toUpperCase() + title.substring(1).toLowerCase();
    var subtitle = "call_comments" in entry ? entry.call_comments: "";

    var crimeCoordinate = new mapkit.Coordinate(location.lat, location.lng);

    var marker = new mapkit.MarkerAnnotation(crimeCoordinate, {
        title: title,
        subtitle: subtitle
    });

    marker.addEventListener('select', (event) => {
        var button = <Button variant="primary" id="report-info">Report Info</Button>;
        //ReactDOM.render(button, event.target.element);
    }, marker.element);

    return {
        entry: entry,
        marker: marker
    };
};