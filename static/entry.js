import ReactDOM from 'react-dom';
import React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';

import MapDatePicker from './map-date-picker.js';

import './report-info.css';
import './map.css';
import './full-page.css';

import './filters.css'

function addPins(map) {
	fetch('/entries?days=1').then(function(response) {
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
	fetch('/entries?days=10').then(function(response) {
		console.log(response);
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
				});

				map.addAnnotation(crime);
				crime.addEventListener('select', (event) => {
					var button = <Button variant="primary" id="report-info">Report Info</Button>;
					//ReactDOM.render(button, event.target.element);
				}, crime.element);
			}
		});
	});
}

function addTable() {
	fetch('/categories').then(function(response) {
		if (response.status != '200') {
			var error = "There was an issue with retrieving table data";
			console.error(error, response);
			throw error
		}
		return response.json();
	}).then(function(responseJson) {
		var table = <Table Type of event>
			<thead>
				<tr>
					<th>Type</th>
				</tr>
			</thead>
			<tbody>
				{responseJson.map((type) => <tr><td>{type}</td></tr>)}
			</tbody>
		</Table>;
		ReactDOM.render(table, document.getElementById("header"));
	});
}

function getDate() {

}

function headerBar() {
	var handleChange = function(value, formattedValue) {
		this.setState({
		  value: value, // ISO String, ex: "2016-11-19T12:00:00.000Z"
		  formattedValue: formattedValue // Formatted String, ex: "11/19/2016"
		});
	};
	var dateSelectors = <ButtonToolbar aria-label="Toolbar with button groups">
		<ButtonGroup className="mr-sm-2" aria-label="First group">
			<Button>1</Button>
			<Button>2</Button>
			<Button>3</Button>
			<Button>4</Button>
		</ButtonGroup>
	</ButtonToolbar>;

	var nav = <Navbar bg="light" expand="lg">
	<Navbar.Brand href="#home">Crime Map</Navbar.Brand>
	<Navbar.Toggle aria-controls="basic-navbar-nav" />
	<Navbar.Collapse id="basic-navbar-nav">
		<Nav className="mr-auto">
			<Nav.Link href="#home">Home</Nav.Link>
			<Nav.Link href="#link">My Reports</Nav.Link>
		</Nav>
		<NavDropdown title="Filters" id="basic-nav-dropdown" className="mr-sm-2">
			<NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
			<NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
			<NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
			<NavDropdown.Divider />
			<NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
			<NavDropdown.Divider />
			<NavDropdown.Item href="#action/3.4">{dateSelectors}</NavDropdown.Item>
			<NavDropdown.Divider />
			<MapDatePicker className="map-date-picker" id="example-datepicker" />
			<NavDropdown.Divider />
			<NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
		</NavDropdown>
		<Form inline>
		<FormControl type="text" placeholder="Search" className="mr-sm-2" />
		<Button variant="outline-success">Search</Button>
		</Form>
	</Navbar.Collapse>
	</Navbar>;

	ReactDOM.render(nav, document.getElementById("header"))
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

	var map = new mapkit.Map("mapKit");
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
headerBar();
////addTable();
console.log();