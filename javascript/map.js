
// var mymap = L.map('mapid').setView([42.2477157, -72.4718267], 8.4);
var mymap = L.map('mapid').setView([42.247, -72], 8);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
maxZoom: 18,
id: 'mapbox/streets-v11',
tileSize: 512,
zoomOffset: -1,
accessToken: 'pk.eyJ1Ijoiam9lbG1hbiIsImEiOiJja2praTZrc2MyNTR3MnVwODg2ZDg2MDBlIn0.lCStPSDt-yVoHjHSl9adUQ'
}).addTo(mymap);

var neighborhoods = ['Boston', 'Allston', 'Back Bay', 'Bay Village', 'Beacon Hill', 'Brighton', 'Charlestown', 'Chinatown–Leather District', 'Dorchester', 'Downtown', 'East Boston', 'Fenway-Kenmore (includes Longwood)', 'Hyde Park', 'Jamaica Plain', 'Mattapan', 'Mission Hill', 'North End', 'Roslindale', 'Roxbury', 'South Boston', 'South End', 'West End', 'West Roxbury', 'Wharf District']

var boston = L.latLng(42.3601, -71.0589);

var length = businesses.length;
var radius = 50;
var inboston = 0;
var not = 0;

var minLat = 100;
var maxLat = 0;
var minLon = 0;
var maxLon = -100;	  

var corner1 = L.latLng(41.43536151749563, -73.74355142136532),
corner2 = L.latLng(42.907075756871656, -70.0461509660558),
maxBounds = L.latLngBounds(corner1, corner2);

for(i = 0; i < length; i++) {
  var row = businesses[i].split('\t');
  [lat, lon, name, locality] = row;
  
  lat = parseFloat(lat)
  lon = parseFloat(lon)
  
  // errors
  if(!maxBounds.contains([lat, lon]))
	continue;
  
	if(lat < minLat) {				
		minLat = lat;
	}
	
	if(lat > maxLat) {			
		maxLat = lat;
	}

	if(lon < minLon) {
		minLon = lon;
	}

	if(lon > maxLon ) {
		maxLon = lon;
	}

  var circle;
  if(neighborhoods.includes(locality)) {
	  inboston++;
	  circle = L.circle([lat, lon], {
	  color: 'red',
	  fillColor: 'red',
	  fillOpacity: 1,
	  radius: radius
	  });
  } else {
	  not++
	  circle = L.circle([lat, lon], {
	  color: 'blue',
	  fillColor: 'blue',
	  fillOpacity: 1,
	  radius: radius
	  })
  }

	var l = L.latLng(lat, lon);
	var dist = mymap.distance(boston, l) / 1609;
	dist = Math.round(dist);
  circle.bindPopup(`${name} - ${locality} (${dist}mi)`).openPopup();
  
  circle.addTo(mymap);
}

console.log([minLat, minLon], [maxLat, maxLon]);

corner1 = L.latLng(minLat, minLon);
corner2 = L.latLng(maxLat, maxLon);
bounds = L.latLngBounds(corner1, corner2);

mymap.fitBounds(bounds, { padding: [0,0] });

document.getElementById('inboston').innerHTML = `${inboston} In Boston`;
document.getElementById('not').innerHTML = `${not} Not`;
