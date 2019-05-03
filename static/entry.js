import ReactDOM from 'react-dom';
import React from 'react';
import Table from 'react-bootstrap/Table';

import AppleMap from './map/apple-map.js';

import './report-info.css';
import './map.css';
import './full-page.css';

import Header from './header/header.js';

function addTable() {
	fetch('/categories').then(function(response) {
		if (response.status != '200') {
			var error = "There was an issue with retrieving table data";
			console.error(error, response);
			throw error
		}
		return response.json();
	}).then(function(responseJson) {
		var table = <Table>
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

//window.initMap = initMap;
let map = new AppleMap();
map.addMarkers();

var header = new Header();
ReactDOM.render(header.render(), document.getElementById("header"));