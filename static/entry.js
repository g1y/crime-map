import ReactDOM from  'react-dom';
import React from 'react';
import Button from 'react-bootstrap/Button';

function addPins(map) {
	fetch('/entries').then(function(response) {
		return response.json();
	}).then(function(responseJson) {
		responseJson.map(function(entry) {
			if ("maps_geocode" in entry) {
				var loc = entry.maps_geocode[0].geometry.location
				var type = entry.type ? entry.type : "";
				var title = entry.call_comments ? type + ": " + entry.call_comments: "";
				var infoWindow = new google.maps.InfoWindow({
					content: title,
				});

				var marker = new google.maps.Marker({
					position: loc,
					map: map,
					title: title,
				});
				
				marker.addListener('click', function() {
					infoWindow.open(map, marker);
				});
			}
		});
	});
}

function addMapkitMarkers(map) {
	fetch('/entries').then(function(response) {
		return response.json();
	}).then(function(responseJson) {
		responseJson.map(function(entry) {
			if ("maps_geocode" in entry) {
				var loc = entry.maps_geocode[0].geometry.location
				var title = "type" in entry ? entry.type : "";
				title = title.substring(0, 1).toUpperCase() + title.substring(1).toLowerCase();
				var subtitle = "call_comments" in entry ? entry.call_comments: "";
				
				var crimeCoordinate = new mapkit.Coordinate(loc.lat, loc.lng);

				var crime = new mapkit.MarkerAnnotation(crimeCoordinate, {
					title: title,
					subtitle: subtitle
				})

				map.addAnnotation(crime);
			}
		});
	});
}

function initMapkitJS() {
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

	var map = new mapkit.Map("map");
	map.region = SLO;

	addMapkitMarkers(map);
}

function initMap() {
		var uluru = {lat: 35.2827524, lng: -120.6596156};
		var map = new google.maps.Map(document.getElementById('map'), {
			zoom: 10,
			center: uluru,
		});

		addPins(map);
}

//window.initMap = initMap;

initMapkitJS();

var button = <Button variant="primary">Report Info</Button>;
ReactDOM.render(button, document.getElementById("inner-map"));