// Store our API 
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request 
d3.json(queryUrl).then(function (data) {
  
  createFeatures (data.features)
    

  function getColor(magnitude){
    if (magnitude > 5) {
      return "#f52525"
    } else if (magnitude > 4) {
      return "#f59725"
    } else if (magnitude > 3){
      return "#f5f225"
    } else if (magnitude > 2){
      return "#b7f525"
    } else if (magnitude > 1) {
      return '#6ef525'
    } else {
      return "36f525"
    } 
  };

  function getRadius(magnitude){
    switch (true){
      case (magnitude >= 5):
          return 25;
          break;
      case (magnitude >= 4):
          return 13;
          break;
      case (magnitude >= 3):
          return 11;
          break;
      case (magnitude >= 2):
          return 7;
          break;
      case (magnitude >= 1):
          return 5;
          break;
      default:
          return 1;
          break;
    }
  };


});

function createFeatures(earthquakeData) {

  
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.title}</h3> <hr> <p>Date: ${new Date(feature.properties.time)}</p>`)
    };
    

 
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    }
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

 
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}