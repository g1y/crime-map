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
import Row from 'react-bootstrap/Row';

import MapDatePicker from './map-date-picker.js';
import AppleMap from './map/apple-map.js';

import './report-info.css';
import './map.css';
import './full-page.css';


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

function headerBar() {
	var handleChange = function(value, formattedValue) {
		this.setState({
		  value: value, // ISO String, ex: "2016-11-19T12:00:00.000Z"
		  formattedValue: formattedValue // Formatted String, ex: "11/19/2016"
		});
	};

	var nav = <Navbar bg="light" expand="lg">
	<Navbar.Brand href="#home">Crime Map</Navbar.Brand>
	<Navbar.Toggle aria-controls="basic-navbar-nav" />
	<Navbar.Collapse id="basic-navbar-nav">
		<Nav className="mr-auto">
			<Nav.Link href="#home">Home</Nav.Link>
			<Nav.Link href="#link">My Reports</Nav.Link>
		</Nav>
		<NavDropdown title="Map Options" id="basic-nav-dropdown" className="mr-sm-1">
			<NavDropdown.Item href="#action/3.4">Heatmap</NavDropdown.Item>

			<NavDropdown.Divider />
			<NavDropdown.Header href="#action/3.4">Color Coding</NavDropdown.Header>
			<NavDropdown.Item href="#action/3.4">Crime Types</NavDropdown.Item>
			<NavDropdown.Item href="#action/3.4">Officer Name</NavDropdown.Item>
			<NavDropdown.Item href="#action/3.4"># of Responders</NavDropdown.Item>

			<NavDropdown.Divider />
			<NavDropdown.Header>By Date</NavDropdown.Header>
			<MapDatePicker className="map-date-picker" id="example-datepicker" />

			<NavDropdown.Divider />
			<NavDropdown.Item><Button variant="primary" block>Apply</Button></NavDropdown.Item>
		</NavDropdown>
		<Form inline>
		<FormControl type="text" placeholder="Search" className="mr-sm-2" />
		<Button variant="outline-success">Search</Button>
		</Form>
	</Navbar.Collapse>
	</Navbar>;

	ReactDOM.render(nav, document.getElementById("header"))
}

//window.initMap = initMap;
let map = new AppleMap();
map.addMarkers();
headerBar();