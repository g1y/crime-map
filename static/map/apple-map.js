import Map from './map.js';

export default class AppleMap extends Map {
    constructor() {
        super();
    }

    addMarkers() {
        let map = this.map;

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