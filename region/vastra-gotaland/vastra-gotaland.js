// ===============================
// CONFIG
// ===============================

const REGION_CENTER = [57.7, 12];
const REGION_ZOOM = 7;
const GEOJSON_PATH = "../../vastra-gotaland.geojson";

// ===============================
// INIT MAP
// ===============================

const map = L.map('regionMap').setView(REGION_CENTER, REGION_ZOOM);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// ===============================
// ICONS
// ===============================

const icon9 = L.icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
    iconSize: [32, 32]
});

const icon18 = L.icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
    iconSize: [32, 32]
});

// ===============================
// LOAD GEOJSON
// ===============================

fetch(GEOJSON_PATH)
.then(res => res.json())
.then(data => {

    const geoLayer = L.geoJSON(data, {

        pointToLayer: function(feature, latlng) {

            const p = feature.properties;
            const holes = p.holes || 9;
            const icon = holes == 18 ? icon18 : icon9;

            const marker = L.marker(latlng, { icon });

            marker.bindPopup(`
                <strong>${p.name}</strong><br>
                ${p.municipality || ""}<br>
                ⛳ ${holes} hål<br>
                ${p.website ? `<a href="${p.website}" target="_blank">Besök hemsida</a>` : ""}
            `);

            return marker;
        }

    }).addTo(map);

    map.fitBounds(geoLayer.getBounds());

    // TABLE
    const table = document.getElementById("clubTable");

    data.features.forEach(feature => {

        const p = feature.properties;

        table.innerHTML += `
        <tr>
            <td>${p.name}</td>
            <td>${p.municipality || ""}</td>
            <td>${p.holes || "?"}</td>
            <td>
                ${p.website ? 
                    `<a href="${p.website}" target="_blank">Besök</a>` 
                    : "-"
                }
            </td>
        </tr>
        `;
    });

})
.catch(err => {
    console.error("Kunde inte ladda geojson:", err);
});
