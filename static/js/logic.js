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
  
    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    // L.control.layers(baseMaps, overlayMaps, {
    //   collapsed: false
    // }).addTo(map);
  }
  
  function createMarkers(response) {

    // Pull the earthquake data from response.
    let quakes = response.features;
    console.log(response)

    // Initialize an array to hold earthquake markers.
    let quakeMarkers = [];
  
    // Loop through the quakes array.
    for (let index = 0; index < quakes.length; index++) {
      let quake = quakes[index];
      console.log(quake)
      console.log(quake.geometry.coordinates[0])  
      // For each earthquake, create a marker, and bind a popup with the description.
      let quakeMarker = L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: quake.geometry.coordinates[2] * 500
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
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson").then(createMarkers);
