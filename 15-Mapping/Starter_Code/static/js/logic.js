document.addEventListener('DOMContentLoaded', function () {
    // Create a Leaflet map centered at a specific location
    const map = L.map('map').setView([0, 0], 2);
  
    // Add a base layer (e.g., OpenStreetMap) to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
  
    // Fetcin data from JSON URL
    fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson')
      .then(response => response.json())
      .then(data => {
        // Define a function to calculate marker radius based on magnitude
        function calculateRadius(magnitude) {
          return 5 * Math.pow(2, magnitude);
        }
  
        // Define a function to calculate marker color based on depth
        function calculateColor(depth) {
          if (depth < 10) {
            return 'green';
          } else if (depth < 50) {
            return 'yellow';
          } else if (depth < 100) {
            return 'orange';
          } else {
            return 'red';
          }
        }
  
        // Iterate through earthquake features and add markers to the map
        data.features.forEach(feature => {
          const coordinates = feature.geometry.coordinates;
          const magnitude = feature.properties.mag;
          const depth = coordinates[2]; // Depth is the third coordinate
          const place = feature.properties.place;
  
          // Create a marker for each earthquake with size and color based on magnitude and depth
          const marker = L.circleMarker([coordinates[1], coordinates[0]], {
            radius: calculateRadius(magnitude),
            fillColor: calculateColor(depth),
            color: 'black',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.7,
          })
            .bindPopup(`Magnitude: ${magnitude}<br>Depth: ${depth} km<br>Location: ${place}`)
            .addTo(map);
        });
  
        // Create a legend
        const legend = L.control({ position: 'bottomright' });
        legend.onAdd = function (map) {
          const div = L.DomUtil.create('div', 'info legend');
          const labels = ['<strong>Depth</strong>'];
          const depthValues = [0, 10, 50, 100];
          const colors = ['green', 'yellow', 'orange', 'red'];
  
          for (let i = 0; i < depthValues.length; i++) {
            div.innerHTML +=
              labels.push(
                '<i style="background:' + colors[i] + '"></i> ' +
                depthValues[i] + (depthValues[i + 1] ? '&ndash;' + depthValues[i + 1] + ' km' : '+ km')
              );
          }
          div.innerHTML = labels.join('<br>');
          return div;
        };
        legend.addTo(map);
      });
  });
  