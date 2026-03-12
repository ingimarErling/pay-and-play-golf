// ===============================
// CONFIG
// ===============================

const SWEDEN_CENTER = [62.5,16]
const SWEDEN_ZOOM = 5

let map
let geoLayer
let selectedMarker=null
let allFeatures=[]


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

const synonyms={

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

const regionFiles=[

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

regionFiles.map(file=>

fetch(file)
.then(res=>res.json())
.catch(()=>({features:[]}))

)

).then(dataSets=>{

allFeatures=dataSets
.flatMap(d=>d.features)
.filter(f=>f?.properties?.name)

renderGeoJSON(allFeatures,true)
updateCounter(allFeatures.length)

})


// ===============================
// RENDER GEOJSON
// ===============================

function renderGeoJSON(features,fitBounds=true){

markerCluster.clearLayers()

geoLayer=L.geoJSON(features,{

pointToLayer:function(feature,latlng){

const p=feature.properties
const holes=p.holes||9
const icon=holes==18?icon18:icon9

const marker=L.marker(latlng,{icon})

marker.bindTooltip(
`<strong>${p.name}</strong><br>
${p.municipality||""}<br>
⛳ ${holes} hål`,
{direction:"top"}
)

marker.on("click",()=>{

showClubInfo(p)

if(selectedMarker){
selectedMarker.setOpacity(1)
}

marker.setOpacity(0.6)
selectedMarker=marker

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

let search=document
.getElementById("searchInput")
.value

search=normalizeText(search)

const holes=document
.getElementById("holesFilter")
.value

if(synonyms[search]){
search=synonyms[search]
}

const filtered=allFeatures.filter(f=>{

const p=f.properties

const name=normalizeText(p.name)
const municipality=normalizeText(p.municipality)
const region=normalizeText(p.region)

const matchSearch=

!search ||
name.includes(search) ||
municipality.includes(search) ||
region.includes(search)

const matchHoles=
!holes || p.holes==holes

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

<h2>Välj en klubb</h2>
<p>Klicka på en markering på kartan för mer information.</p>

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

el.innerHTML=`<strong>Antal träffar: ${count}</strong>`

}


// ===============================
// CLUB INFO
// ===============================

function showClubInfo(club){

const panel=document.getElementById("infoPanel")

panel.innerHTML=`

<h2>${club.name}</h2>

<p>📍 ${club.municipality||""}</p>

<p>⛳ ${club.holes||"?"} hål</p>

${club.website?
`<p>
<a href="${club.website}" target="_blank">
Besök hemsida
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

window.addEventListener("load",()=>{

if(!localStorage.getItem("cookiesAccepted")){
document.getElementById("cookieBanner").style.display="block"
}

})
