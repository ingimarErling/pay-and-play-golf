// ===============================
// INIT MAP
// ===============================

let map = L.map('map').setView([62, 15], 5);
let selectedMarker = null;
let allFeatures = [];
let geoLayer = null;

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// ===============================
// CUSTOM ICONS
// ===============================

let icon9 = L.icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
    iconSize: [32, 32]
});

let icon18 = L.icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
    iconSize: [32, 32]
});

// ===============================
// LOAD GEOJSON
// ===============================

fetch('golfklubbar.geojson')
    .then(response => response.json())
    .then(data => {

        allFeatures = data.features;
        renderGeoJSON(allFeatures);
        updateCounter(allFeatures.length);
    });

// ===============================
// RENDER GEOJSON
// ===============================

function renderGeoJSON(features) {

    if (geoLayer) {
        map.removeLayer(geoLayer);
    }

    geoLayer = L.geoJSON(features, {

        pointToLayer: function (feature, latlng) {

            let holes = feature.properties.holes || 9;
            let icon = holes == 18 ? icon18 : icon9;

            let marker = L.marker(latlng, { icon: icon });

            // Hover tooltip
            marker.bindTooltip(
                `<strong>${feature.properties.name}</strong><br>
                 ${feature.properties.municipality || ""}<br>
                 ⛳ ${holes} hål<br>
                 💰 ${feature.properties.price || "?"} kr`,
                { direction: "top", offset: [0, -10], opacity: 0.9 }
            );

            // Click → info panel
            marker.on('click', function () {

                showClubInfo(feature.properties);

                if (selectedMarker) {
                    selectedMarker.setOpacity(1);
                }

                marker.setOpacity(0.6);
                selectedMarker = marker;
            });

            return marker;
        }

    }).addTo(map);

    map.fitBounds(geoLayer.getBounds());
}

// ===============================
// INFO PANEL
// ===============================

function showClubInfo(club) {

    let panel = document.getElementById("infoPanel");

    panel.innerHTML = `
        <h3>${club.name}</h3>
        <p>📍 ${club.municipality || ""}</p>
        <p>⛳ ${club.holes || "?"} hål</p>
        <p>💰 ${club.price || "Ej angivet"} kr</p>
        ${club.website ? `<p><a href="${club.website}" target="_blank">Besök hemsida</a></p>` : ""}
    `;
}

// ===============================
// FILTER FUNCTION
// ===============================

function applyFilters() {

    let searchText = document.getElementById('searchInput').value.toLowerCase();
    let maxPrice = document.getElementById('priceFilter').value;
    let holes = document.getElementById('holesFilter').value;

    let filtered = allFeatures.filter(feature => {

        let p = feature.properties;

        let matchesSearch =
            (p.name && p.name.toLowerCase().includes(searchText)) ||
            (p.municipality && p.municipality.toLowerCase().includes(searchText)) ||
            (p.region && p.region.toLowerCase().includes(searchText));

        let matchesPrice = maxPrice ? (p.price && p.price <= maxPrice) : true;
        let matchesHoles = holes ? p.holes == holes : true;

        return matchesSearch && matchesPrice && matchesHoles;
    });

    renderGeoJSON(filtered);
    updateCounter(filtered.length);
}

// ===============================
// ENTER SUPPORT
// ===============================

["searchInput", "priceFilter"].forEach(id => {
    document.getElementById(id).addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            applyFilters();
        }
    });
});

// ===============================
// RESULT COUNTER
// ===============================

function updateCounter(count) {

    let counter = document.getElementById("resultCounter");

    if (!counter) {
        counter = document.createElement("div");
        counter.id = "resultCounter";
        counter.style.textAlign = "center";
        counter.style.padding = "8px";
        counter.style.fontWeight = "bold";
        document.body.insertBefore(counter, document.querySelector(".mainLayout"));
    }

    counter.innerHTML = `Antal träffar: ${count}`;
}

// ===============================
// GLOBAL VISITOR COUNTER
// ===============================

fetch("https://api.countapi.xyz/hit/pay-and-play-golf-sweden/visits")
    .then(res => res.json())
    .then(res => {
        let visitCounter = document.createElement("div");
        visitCounter.style.textAlign = "center";
        visitCounter.style.padding = "10px";
        visitCounter.innerHTML = "Totala besök: " + res.value;
        document.body.appendChild(visitCounter);
    });
