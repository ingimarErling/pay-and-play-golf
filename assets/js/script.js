// ===============================
// CONFIG
// ===============================

const SWEDEN_CENTER = [62.5,16]
const SWEDEN_ZOOM = 5

const LANG = navigator.language && navigator.language.startsWith("sv") ? "sv" : "en"

let map
let geoLayer
let selectedMarker = null
let allFeatures = []


// ===============================
// TEXT DICTIONARY
// ===============================

const TEXT = {

sv: {
title: "Pay & Play Golf i Sverige",
subtitle: "Hitta golfbanor utan grönt kort i hela Sverige",
searchPlaceholder: "Sök stad eller klubb...",
allCourses: "Alla hål",
search: "Sök",
showAll: "Visa hela Sverige",
selectClub: "Välj en klubb",
clickMarker: "Klicka på en markering på kartan för mer information.",
holes: "hål",
results: "Antal träffar",
visitWebsite: "Besök hemsida"
},

en: {
title: "Pay & Play Golf in Sweden",
subtitle: "Find golf courses open to everyone (no handicap required)",
searchPlaceholder: "Search city or golf course...",
allCourses: "All courses",
search: "Search",
showAll: "Show all Sweden",
selectClub: "Select a course",
clickMarker: "Click a marker on the map for more information.",
holes: "holes",
results: "Results",
visitWebsite: "Visit website"
}

}

const T = TEXT[LANG]


// ===============================
// INIT MAP
// ===============================

map = L.map("map")

L.tileLayer(
"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
{
attribution:"© OpenStreetMap contributors"
}).addTo(map)


// ===============================
// MARKER CLUSTER GROUP
// ===============================

const markerCluster = L.markerClusterGroup({
spiderfyOnMaxZoom:true,
showCoverageOnHover:false,
maxClusterRadius:40
})

map.addLayer(markerCluster)


// ===============================
// MARKER ICONS
// ===============================

const icon9 = L.icon({
iconUrl:"https://maps.google.com/mapfiles/ms/icons/green-dot.png",
iconSize:[32,32]
})

const icon18 = L.icon({
iconUrl:"https://maps.google.com/mapfiles/ms/icons/red-dot.png",
iconSize:[32,32]
})


// ===============================
// APPLY LANGUAGE
// ===============================

function applyLanguage(){

document.querySelector("h1").textContent = T.title
document.querySelector(".subtitle").textContent = T.subtitle

document.getElementById("searchInput").placeholder = T.searchPlaceholder

document.querySelector("#holesFilter option[value='']").textContent = T.allCourses

document.querySelector(".btn-primary").textContent = T.search
document.querySelector(".btn-secondary").textContent = T.showAll

document.querySelector("#infoPanel h2").textContent = T.selectClub
document.querySelector("#infoPanel p").textContent = T.clickMarker

document.getElementById("resultCounter").textContent = `${T.results}: 0`

}


// ===============================
// TEXT NORMALIZATION
// ===============================

function normalizeText(text){

if(!text) return ""

return text
.toLowerCase()
.replace(/å/g,"a")
.replace(/ä/g,"a")
.replace(/ö/g,"o")
.replace(/-/g," ")
.trim()

}


// ===============================
// SYNONYMS
// ===============================

const synonyms = {

"sormland":"sodermanland",
"sodermanland":"sodermanland",

"skane":"skane",

"ostergotland":"ostergotland",

"vastra gotaland":"vastra gotaland",
"vast gotaland":"vastra gotaland",
"vastergotland":"vastra gotaland",

"goteborg":"vastra gotaland"

}


// ===============================
// GEOJSON FILES
// ===============================

const regionFiles = [

"geojson/blekinge.geojson",
"geojson/dalarna.geojson",
"geojson/estland.geojson",
"geojson/gavleborg.geojson",
"geojson/gotland.geojson",
"geojson/halland.geojson",
"geojson/jamtland.geojson",
"geojson/norrbotten.geojson",
"geojson/orebro.geojson",
"geojson/ostergotland.geojson",
"geojson/skane.geojson",
"geojson/smaland.geojson",
"geojson/sodermanland.geojson",
"geojson/stockholm.geojson",
"geojson/uppland.geojson",
"geojson/varmland.geojson",
"geojson/vasterbotten.geojson",
"geojson/vasternorrland.geojson",
"geojson/vastmanland.geojson",
"geojson/vastra-gotaland.geojson"

]


// ===============================
// LOAD GEOJSON
// ===============================

Promise.all(

regionFiles.map(file =>

fetch(file)
.then(res => res.json())
.catch(() => ({features:[]}))

)

).then(dataSets => {

allFeatures = dataSets
.flatMap(d => d.features)
.filter(f => f?.properties?.name)

renderGeoJSON(allFeatures,true)
updateCounter(allFeatures.length)

})


// ===============================
// RENDER GEOJSON
// ===============================

function renderGeoJSON(features,fitBounds=true){

markerCluster.clearLayers()

geoLayer = L.geoJSON(features,{

pointToLayer:function(feature,latlng){

const p = feature.properties
const holes = p.holes || 9
const icon = holes == 18 ? icon18 : icon9

const marker = L.marker(latlng,{icon})

marker.bindTooltip(
`<strong>${p.name}</strong><br>
${p.municipality||""}<br>
⛳ ${holes} ${T.holes}`,
{direction:"top"}
)

marker.on("click",()=>{

showClubInfo(p)

if(selectedMarker){
selectedMarker.setOpacity(1)
}

marker.setOpacity(0.6)
selectedMarker = marker

})

return marker

}

})

markerCluster.addLayer(geoLayer)

if(fitBounds && features.length){
map.fitBounds(geoLayer.getBounds(),{padding:[30,30]})
}

}


// ===============================
// FILTER
// ===============================

function applyFilters(){

let search = document
.getElementById("searchInput")
.value

search = normalizeText(search)

const holes = document
.getElementById("holesFilter")
.value

if(synonyms[search]){
search = synonyms[search]
}

const filtered = allFeatures.filter(f => {

const p = f.properties

const name = normalizeText(p.name)
const municipality = normalizeText(p.municipality)
const region = normalizeText(p.region)

const matchSearch =

!search ||
name.includes(search) ||
municipality.includes(search) ||
region.includes(search)

const matchHoles =
!holes || p.holes == holes

return matchSearch && matchHoles

})

renderGeoJSON(filtered,true)
updateCounter(filtered.length)

}


// ===============================
// RESET
// ===============================

function resetMap(){

document.getElementById("searchInput").value=""
document.getElementById("holesFilter").value=""

selectedMarker=null

renderGeoJSON(allFeatures,true)

updateCounter(allFeatures.length)

document.getElementById("infoPanel").innerHTML=`

<h2>${T.selectClub}</h2>
<p>${T.clickMarker}</p>

`

}


// ===============================
// COUNTER
// ===============================

function updateCounter(count){

const el=document.getElementById("resultCounter")

if(!document.body.classList.contains("dev")){
el.style.display="none"
return
}

el.innerHTML=`<strong>${T.results}: ${count}</strong>`

}


// ===============================
// CLUB INFO
// ===============================

function showClubInfo(club){

const panel=document.getElementById("infoPanel")

panel.innerHTML=`

<h2>${club.name}</h2>

<p>📍 ${club.municipality||""}</p>

<p>⛳ ${club.holes||"?"} ${T.holes}</p>

${club.website?
`<p>
<a href="${club.website}" target="_blank">
${T.visitWebsite}
</a>
</p>`:""}

`

}


// ===============================
// COOKIE BANNER
// ===============================

function acceptCookies(){

localStorage.setItem("cookiesAccepted","true")
document.getElementById("cookieBanner").style.display="none"

}


// ===============================
// PAGE INIT
// ===============================

document.addEventListener("DOMContentLoaded",()=>{

applyLanguage()

if(!localStorage.getItem("cookiesAccepted")){
document.getElementById("cookieBanner").style.display="block"
}

})
