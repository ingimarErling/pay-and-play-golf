// ===============================
// INIT MAP
// ===============================

let map = L.map('map').setView([62, 15], 5);
let markers = [];

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let clubs = [];

// ===============================
// CUSTOM ICONS (9 vs 18 hål)
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
// LOAD DATA
// ===============================

fetch('golfklubbar.json')
    .then(response => response.json())
    .then(data => {
        clubs = data;
        updateMap(clubs);
        updateCounter(clubs.length);
    });

// ===============================
// UPDATE MAP
// ===============================

function updateMap(filteredClubs) {

    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    if (filteredClubs.length === 0) {
        alert("Inga träffar hittades");
        return;
    }

    let bounds = [];

    filteredClubs.forEach(club => {

        let icon = club.holes == 18 ? icon18 : icon9;

        let marker = L.marker([club.lat, club.lng], { icon: icon });

        let popupContent = `
            <div style="min-width:200px">
                <strong style="font-size:16px">${club.name}</strong><br>
                📍 ${club.municipality}<br>
                ⛳ ${club.holes} hål<br>
                💰 ${club.price} kr<br>
                <a href="${club.website}" target="_blank">Besök hemsida</a>
            </div>
        `;

        marker.bindPopup(popupContent);

        // Hover popup
        marker.on('mouseover', function() {
            this.openPopup();
        });

        marker.on('mouseout', function() {
            this.closePopup();
        });

        marker.addTo(map);

        markers.push(marker);
        bounds.push([club.lat, club.lng]);
    });

    map.fitBounds(bounds);

    updateCounter(filteredClubs.length);
}

// ===============================
// FILTER FUNCTION
// ===============================

function applyFilters() {

    let searchText = document.getElementById('searchInput').value.toLowerCase();
    let maxPrice = document.getElementById('priceFilter').value;
    let holes = document.getElementById('holesFilter').value;

    let filtered = clubs.filter(club => {

        let matchesSearch =
            club.name.toLowerCase().includes(searchText) ||
            club.municipality.toLowerCase().includes(searchText) ||
            (club.region && club.region.toLowerCase().includes(searchText));

        let matchesPrice = maxPrice ? club.price <= maxPrice : true;
        let matchesHoles = holes ? club.holes == holes : true;

        return matchesSearch && matchesPrice && matchesHoles;
    });

    updateMap(filtered);
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
        counter.style.padding = "10px";
        counter.style.fontWeight = "bold";
        document.body.insertBefore(counter, document.getElementById("map"));
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
