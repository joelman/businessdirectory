
// var mymap = L.map('mapid').setView([42.2477157, -72.4718267], 8.4);
var mymap = L.map('mapid').setView([42.247, -72], 8);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery Â© <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: token
}).addTo(mymap);

var neighborhoods = ['Boston', 'Allston', 'Back Bay', 'Bay Village', 'Beacon Hill', 'Brighton', 'Charlestown', 'Chinatown',
		     'Dorchester', 'Dorchester Center', 'Downtown', 'East Boston', 'Fenway-Kenmore (includes Longwood)',
		     'Hyde Park', 'Jamaica Plain', 'Mattapan', 'Mission Hill', 'North End', 'Roslindale', 'Roxbury',
		     'Roxbury Crossing', 'South Boston', 'South End', 'West End', 'West Roxbury', 'Wharf District']

var boston = L.latLng(42.3601, -71.0589);

var length = businesses.length;
var radius = 50;
var inboston = 0;
var not = 0;
var satellite = 0;

var points = [];

var corner1 = L.latLng(41, -74),
    corner2 = L.latLng(43, -70),
    maxBounds = L.latLngBounds(corner1, corner2);

for(i = 0; i < length; i++) {
    var row = businesses[i].split('\t');
    [lat, lon, name, locality] = row;
    
    lat = parseFloat(lat)
    lon = parseFloat(lon)
    
    // errors
    if(!maxBounds.contains([lat, lon])) {
	console.log(`out of bounds: ${row}`);
	continue;
    }

    points.push({
	lat: lat,
	lon: lon,
	name: name,
	locality: locality
    });
}

var bostonPoints = points.filter(x => x.locality == 'Boston');

length = points.length;
for(var i = 0; i < length; i++) {

    var point = points[i]
    
    var color;
    if(neighborhoods.includes(point.locality)) {
	inboston++;
	color = "red"
    } else {
	var sat = bostonPoints.filter(x => point.name == x.name);

	if(sat.length) {
//	    console.log(sat);
	    satellite++;
	    color = "purple";
//	    console.log(`${point.name} satellite of ${sat[0].name}`);
	} else {
	    not++;
	    color = "blue";
	}
    }
    
    var circle = L.circle([point.lat, point.lon], {
	color: color,
	fillColor: color,
	fillOpacity: 1,
	radius: radius
    });

    var l = L.latLng(point.lat, point.lon);
    var dist = mymap.distance(boston, l) / 1609;
    dist = Math.round(dist);
    circle.bindPopup(`${point.name} - ${point.locality} (${dist}mi)`).openPopup();
    
    circle.addTo(mymap);
}

document.getElementById('inboston').innerHTML = `${inboston} In Boston`;
document.getElementById('not').innerHTML = `${not} Not`;
document.getElementById('satellite').innerHTML = `${satellite} Satellite`;
document.getElementById('total').innerHTML = `${inboston + not + satellite} Total`;
