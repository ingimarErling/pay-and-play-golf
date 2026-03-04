const map = L.map('map').setView([57.3, 14.5], 7);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

fetch("../../smaland.geojson")
.then(response => response.json())
.then(data => {

const tableBody = document.querySelector("#clubTable tbody");

data.features.forEach(feature => {

const p = feature.properties;
const coords = feature.geometry.coordinates;

const marker = L.marker([coords[1], coords[0]]).addTo(map);

marker.bindPopup(`
<strong>${p.name}</strong><br>
${p.municipality || ""}<br>
⛳ ${p.holes || "?"} hål
`);

const row = document.createElement("tr");

row.innerHTML = `
<td>${p.name}</td>
<td>${p.municipality || ""}</td>
<td>${p.holes || ""}</td>
<td>
${p.website ? `<a href="${p.website}" target="_blank">Besök</a>` : ""}
</td>
`;

tableBody.appendChild(row);

});

});
