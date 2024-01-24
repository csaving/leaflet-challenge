function createMap(earthquakes) {

  // Create the tile layer that will be the background of our map.
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });


  // Create a baseMaps object to hold the streetmap layer.
  let baseMaps = {
    "Street Map": streetmap
  };

  // Create an overlayMaps object to hold the earthquake layer.
  let overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create the map object with options.
  let map = L.map("map", {
    center: [0, 0],
    zoom: 2,
    layers: [streetmap, earthquakes]
  });

}

// Function to get color based on depth
function getColor(d) {
  return d > 90 ? '#800026' :
          d > 70  ? '#BD0026' :
          d > 50  ? '#E31A1C' :
          d > 30  ? '#FC4E2A' :
          d > 10   ? '#FD8D3C' :
                    '#FFEDA0';
}

function createMarkers(response) {

  // Pull the features data from response.
  let quakes = response.features;
  console.log(response)

  // Initialize an array to hold earthquake markers.
  let quakeMarkers = [];

  // Loop through the quakes array.
  for (let index = 0; index < quakes.length; index++) {
    let quake = quakes[index]; 
    
    // For each earthquake, create a marker, and bind a popup with the description.
    let quakeMarker = L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], {
      color: getColor(quake.geometry.coordinates[2]),
      fillColor: getColor(quake.geometry.coordinates[2]),
      fillOpacity: 0.5,
      radius: quake.properties.mag * 5000
    }).bindPopup("<h3>" + quake.properties.title + 
                  "</h3><h3>Depth: " + quake.geometry.coordinates[2] + "</h3>");

    // Add the marker to the quakeMarkers array.
    quakeMarkers.push(quakeMarker);
  }

  // Create a layer group that's made from the earthquake markers array, and pass it to the 
  // createMap function.
  createMap(L.layerGroup(quakeMarkers));
}

// Perform an API call to the USGS Earthquake API to get the station information. 
// Call createMarkers when it completes.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson").then(createMarkers);
