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
// LOAD DATA
// ===============================

fetch('golfklubbar.json')
    .then(response => response.json())
    .then(data => {
        clubs = data;
        updateMap(clubs);
    });

// ===============================
// UPDATE MAP
// ===============================

function updateMap(filteredClubs) {

    // Ta bort gamla markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    if (filteredClubs.length === 0) {
        alert("Inga träffar hittades");
        return;
    }

    let bounds = [];

    filteredClubs.forEach(club => {
        let marker = L.marker([club.lat, club.lng])
            .bindPopup(`
                <strong>${club.name}</strong><br>
                ${club.municipality}<br>
                ${club.holes} hål<br>
                ${club.price} kr<br>
                <a href="${club.website}" target="_blank">Hemsida</a>
            `)
            .addTo(map);

        markers.push(marker);
        bounds.push([club.lat, club.lng]);
    });

    // Auto-zoom till träffar
    map.fitBounds(bounds);
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
            club.municipality.toLowerCase().includes(searchText);

        let matchesPrice = maxPrice ? club.price <= maxPrice : true;
        let matchesHoles = holes ? club.holes == holes : true;

        return matchesSearch && matchesPrice && matchesHoles;
    });

    updateMap(filtered);
}

// ===============================
// ENTER KEY SUPPORT
// ===============================

document.getElementById("searchInput")
    .addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            applyFilters();
        }
    });

document.getElementById("priceFilter")
    .addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            applyFilters();
        }
    });

// ===============================
// SIMPLE GLOBAL VISITOR COUNTER
// ===============================

// Detta använder CountAPI (gratis, enkel, ingen tracking)
fetch("https://api.countapi.xyz/hit/pay-and-play.org/visits")
    .then(res => res.json())
    .then(res => {
        let counterElement = document.createElement("div");
        counterElement.style.textAlign = "center";
        counterElement.style.padding = "10px";
        counterElement.innerHTML = "Besökare: " + res.value;
        document.body.appendChild(counterElement);
    });
