// ===============================
// CONFIG
// ===============================

const SWEDEN_CENTER = [62, 15];
const SWEDEN_ZOOM = 5;

// ===============================
// INIT MAP
// ===============================

let map = L.map('map').setView(SWEDEN_CENTER, SWEDEN_ZOOM);
let selectedMarker = null;
let allFeatures = [];
let geoLayer = null;

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// ===============================
// HOME BUTTON (Leaflet)
// ===============================

const homeControl = L.control({ position: 'topleft' });

homeControl.onAdd = function () {
    const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
    div.innerHTML = '<a href="#" title="Visa hela Sverige">🏠</a>';

    L.DomEvent.on(div, 'click', function (e) {
        L.DomEvent.stop(e);
        resetMap();
    });

    return div;
};

homeControl.addTo(map);

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
// LOAD GEOJSON FILES
// ===============================

const regionFiles = [
    "stockholm.geojson",
    "vastra-gotaland.geojson",
    "skane.geojson",
    "smaland.geojson",
    "ostergotland.geojson",
    "halland.geojson",
    "norrland.geojson",
    "sodermanland.geojson",
    "uppland.geojson",
    "varmnalnd.geojson",
    "vastmanland.geojson"
];

Promise.all(
    regionFiles.map(file =>
        fetch(file)
            .then(res => res.json())
            .catch(err => {
                console.error("Kunde inte ladda:", file);
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
            feature.properties &&
            feature.properties.name
        );

    renderGeoJSON(allFeatures, true);
    updateCounter(allFeatures.length);
});

// ===============================
// RENDER GEOJSON
// ===============================

function renderGeoJSON(features, fitBounds = true) {

    if (geoLayer) {
        map.removeLayer(geoLayer);
    }

    if (!features.length) {
        updateCounter(0);
        return;
    }

    geoLayer = L.geoJSON(features, {

        pointToLayer: function (feature, latlng) {

            const p = feature.properties;
            const holes = p.holes || 9;
            const icon = holes == 18 ? icon18 : icon9;

            const marker = L.marker(latlng, { icon });

            marker.bindTooltip(
                `<strong>${p.name}</strong><br>
                 ${p.municipality || ""}<br>
                 ⛳ ${holes} hål`,
                { direction: "top", offset: [0, -10] }
            );

            marker.on('click', function () {
                showClubInfo(p);

                if (selectedMarker) selectedMarker.setOpacity(1);
                marker.setOpacity(0.6);
                selectedMarker = marker;
            });

            return marker;
        }

    }).addTo(map);

    if (fitBounds) {
        map.fitBounds(geoLayer.getBounds());
    }
}



// ===============================
// FILTERS
// ===============================

function applyFilters() {

    const searchText = document.getElementById('searchInput').value.toLowerCase().trim();
    const holes = document.getElementById('holesFilter').value;

    const filtered = allFeatures.filter(feature => {

        const p = feature.properties;

        const matchSearch =
            !searchText ||
            p.name.toLowerCase().includes(searchText) ||
            (p.municipality && p.municipality.toLowerCase().includes(searchText));

        const matchHoles =
            !holes ||
            p.holes == holes;

        return matchSearch && matchHoles;
    });

    renderGeoJSON(filtered);
    updateCounter(filtered.length);
}

// ===============================
// RESET
// ===============================

function resetMap() {

    document.getElementById('searchInput').value = "";
    document.getElementById('holesFilter').value = "";

    selectedMarker = null;

    renderGeoJSON(allFeatures, false);
    updateCounter(allFeatures.length);

    map.setView(SWEDEN_CENTER, SWEDEN_ZOOM);

    document.getElementById("infoPanel").innerHTML = `
        <h2>Välj en klubb</h2>
        <p>Klicka på en markering på kartan för mer information.</p>
    `;
}

// ===============================
// RESULT COUNTER
// ===============================

function updateCounter(count) {
    document.getElementById("resultCounter").innerHTML =
        `<strong>Antal träffar: ${count}</strong>`;
}


// ===============================
// INFO PANEL
// ===============================

function showClubInfo(club) {

    const panel = document.getElementById("infoPanel");

    panel.innerHTML = `
        <h2>${club.name}</h2>
        <p>📍 ${club.municipality || ""}</p>
        <p>⛳ ${club.holes || "?"} hål</p>
        ${club.website ? `
            <p>
                <a href="${club.website}" target="_blank" rel="noopener">
                    Besök hemsida
                </a>
            </p>
        ` : ""}

        <div class="ad-container" style="margin-top:20px;">
            <p style="font-size:12px;color:#777;">Annons</p>

            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-6036839968490609"
                 data-ad-slot="7765842047"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
        </div>
    `;

    //  Viktigt: trigga annonsen efter att den lagts in i DOM
    if (window.adsbygoogle && typeof adsbygoogle.push === "function") {
    try {
        adsbygoogle.push({});
    } catch (e) {
        console.log("AdSense redan laddad eller blockerad.");
    }
  }

}
// ===============================
// COOKIE BANNER
// ===============================

function acceptCookies() {
    localStorage.setItem("cookiesAccepted", "true");
    document.getElementById("cookieBanner").style.display = "none";
}

window.addEventListener("load", function () {
    if (!localStorage.getItem("cookiesAccepted")) {
        document.getElementById("cookieBanner").style.display = "block";
    }
});


