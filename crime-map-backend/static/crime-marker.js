import Button from 'react-bootstrap/Button';
import React from 'react';

export let createCrimeMarker = function(entry) {
    if (!("maps_geocode" in entry)) {
        return null;
    }

    // At some point I was doing this as an array which is exactly what the geocoding API returns, but then I removed that. I may fix this
    // to match the geocoding API more closely.
    let location
    if (Array.isArray(entry.maps_geocode)) {
        location = entry.maps_geocode[0].geometry.location;
    } else {
        location = entry.maps_geocode.geometry.location
    }

    entry.type = entry.type.toLowerCase()

    let title = "type" in entry ? entry.type : "";
    title = title.substring(0, 1).toUpperCase() + title.substring(1).toLowerCase();
    const subtitle = "call_comments" in entry ? entry.call_comments: "";

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