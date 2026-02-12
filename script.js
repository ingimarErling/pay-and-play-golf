let map = L.map('map').setView([62, 15], 5);
let markers = [];

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let clubs = [];

fetch('golfklubbar.json')
    .then(response => response.json())
    .then(data => {
        clubs = data;
        updateMap(clubs);
    });

function updateMap(filteredClubs) {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

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
    });
}

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
