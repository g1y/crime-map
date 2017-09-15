console.log("hello");

function addPins(map) {
	fetch('/entries').then(function(response) {
		return response.json();
	}).then(function(responseJson) {
		responseJson.map(function(entry) {
			if ("maps_geocode" in entry) {
				loc = entry.maps_geocode[0].geometry.location
				new google.maps.Marker({
					position: loc,
					map: map,
				});
			}
		});
	});
}

function initMap() {
		var uluru = {lat: 35.2827524, lng: -120.6596156};
		var map = new google.maps.Map(document.getElementById('map'), {
			zoom: 4,
			center: uluru,
		});

		addPins(map);

		var marker = new google.maps.Marker({
			position: uluru,
			map: map,
		});
}

window.initMap = initMap;
