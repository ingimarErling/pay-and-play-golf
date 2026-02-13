// ===============================
// INIT MAP
// ===============================

const SWEDEN_CENTER = [62, 15];
const SWEDEN_ZOOM = 5;

let map = L.map('map').setView(SWEDEN_CENTER, SWEDEN_ZOOM);
let selectedMarker = null;
let allFeatures = [];
let geoLayer = null;

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);


// ===============================
// HOME BUTTON (Leaflet Control)
// ===============================

const homeControl = L.control({ position: 'topleft' });

homeControl.onAdd = function () {
    const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
    div.innerHTML = '<a href="#" title="Visa hela Sverige">🏠</a>';

    div.onclick = function (e) {
        e.preventDefault();
        resetMap();
    };

    return div;
};

homeControl.addTo(map);


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
// LOAD ALL REGION FILES
// ===============================

const regionFiles = [
    "stockholm.geojson",
    "vastra-gotaland.geojson",
    "skane.geojson",
    "smaland.geojson",
    "ostergotland.geojson",
    "halland.geojson",
    "norrland.geojson"
];

Promise.all(
    regionFiles.map(file =>
        fetch(file)
            .then(res => res.json())
            .catch(err => {
                console.error("Kunde inte ladda:", file, err);
                return { features: [] };
            })
    )
)
.then(datasets => {

    allFeatures = datasets
        .flatMap(data => data.features)
        .filter(feature =>
            feature &&
            feature.type === "Feature" &&
            feature.geometry &&
            feature.geometry.type === "Point" &&
            feature.geometry.coordinates &&
            feature.properties &&
            feature.properties.name &&
            feature.properties.name.trim() !== ""
        );

    renderGeoJSON(allFeatures, true);
    updateCounter(allFeatures.length);
})
.catch(error => {
    console.error("GeoJSON load error:", error);
});


// ===============================
// RENDER GEOJSON
// ===============================

function renderGeoJSON(features, fitToBounds = true) {

    if (geoLayer) {
        map.removeLayer(geoLayer);
    }

    if (!features || features.length === 0) {
        updateCounter(0);
        return;
    }

    geoLayer = L.geoJSON(features, {

        pointToLayer: function (feature, latlng) {

            let p = feature.properties;
            let holes = p.holes || 9;
            let icon = holes == 18 ? icon18 : icon9;

            let marker = L.marker(latlng, { icon: icon });

            marker.bindTooltip(
                `<strong>${p.name}</strong><br>
                 ${p.municipality || ""}<br>
                 ⛳ ${holes} hål<br>
                 💰 ${p.price || "?"} kr`,
                { direction: "top", offset: [0, -10], opacity: 0.9 }
            );

            marker.on('click', function () {

                showClubInfo(p);

                if (selectedMarker) {
                    selectedMarker.setOpacity(1);
                }

                marker.setOpacity(0.6);
                selectedMarker = marker;
            });

            return marker;
        }

    }).addTo(map);

    if (fitToBounds && geoLayer.getBounds().isValid()) {
        map.fitBounds(geoLayer.getBounds());
    }
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
        ${club.website ? `<p><a href="${club.website}" target="_blank" rel="noopener">Besök hemsida</a></p>` : ""}
    `;
}


// ===============================
// FILTER FUNCTION
// ===============================

function applyFilters() {

    let searchText = document.getElementById('searchInput').value.toLowerCase().trim();
    let maxPrice = document.getElementById('priceFilter').value;
    let holes = document.getElementById('holesFilter').value;

    let filtered = allFeatures.filter(feature => {

        let p = feature.properties;

        let matchesSearch =
            !searchText ||
            (p.name && p.name.toLowerCase().includes(searchText)) ||
            (p.municipality && p.municipality.toLowerCase().includes(searchText)) ||
            (p.region && p.region.toLowerCase().includes(searchText));

        let matchesPrice =
            !maxPrice ||
            (p.price && Number(p.price) <= Number(maxPrice));

        let matchesHoles =
            !holes ||
            p.holes == holes;

        return matchesSearch && matchesPrice && matchesHoles;
    });

    renderGeoJSON(filtered);
    updateCounter(filtered.length);
}


// ===============================
// RESET MAP
// ===============================

function resetMap() {

    document.getElementById('searchInput').value = "";
    document.getElementById('priceFilter').value = "";
    document.getElementById('holesFilter').value = "";

    document.getElementById("infoPanel").innerHTML = `
        <h2>Välj en klubb</h2>
        <p>Klicka på en markering på kartan för mer information.</p>

        <div class="seo-inline">
            <h3>Golf utan grönt kort</h3>
            <p>
                På Pay & Play Golf Sverige hittar du golfbanor där du kan spela utan grönt kort.
                Vår katalog täcker hela landet – från Skåne till Norrland.
            </p>
        </div>
    `;

    selectedMarker = null;

    renderGeoJSON(allFeatures, false);
    updateCounter(allFeatures.length);

    map.setView(SWEDEN_CENTER, SWEDEN_ZOOM);
}


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
// VISITOR COUNTER
// ===============================

fetch("https://api.countapi.xyz/hit/pay-and-play-golf-sweden/visits")
    .then(res => res.json())
    .then(res => {

        let footer = document.querySelector("footer");

        if (footer) {
            let visitCounter = document.createElement("div");
            visitCounter.style.fontSize = "12px";
            visitCounter.style.marginTop = "5px";
            visitCounter.innerHTML = "Totala besök: " + res.value;
            footer.appendChild(visitCounter);
        }

    })
    .catch(err => {
        console.log("Visitor counter error:", err);
    });
