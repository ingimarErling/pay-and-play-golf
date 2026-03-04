// ===============================
// CONFIG
// ===============================

const SWEDEN_CENTER = [62,15]
const SWEDEN_ZOOM = 5

let map
let selectedMarker = null
let geoLayer = null
let allFeatures = []

// ===============================
// INIT MAP
// ===============================

map = L.map("map").setView(SWEDEN_CENTER, SWEDEN_ZOOM)

L.tileLayer(
"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
{
attribution: "&copy; OpenStreetMap contributors"
}).addTo(map)

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
// LOAD GEOJSON
// ===============================

const swedenRegions = [

"dalarna",
"halland",
"norrland",
"orebro",
"ostergotland",
"skane",
"smaland",
"sodermanland",
"stockholm",
"uppland",
"varmland",
"vastmanland",
"vastra-gotaland"

].map(r=>`${r}.geojson`)


const balticRegions=[

"estland",
"lettland"

].map(r=>`baltikum/${r}.geojson`)


const regionFiles=[...swedenRegions,...balticRegions]


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

if(geoLayer){
map.removeLayer(geoLayer)
}

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

}).addTo(map)

if(fitBounds && features.length){
map.fitBounds(geoLayer.getBounds())
}

}

// ===============================
// FILTER
// ===============================

function applyFilters(){

let search=document
.getElementById("searchInput")
.value
.toLowerCase()
.trim()

const holes=document
.getElementById("holesFilter")
.value


// ===============================
// SYNONYMS
// ===============================

const synonyms={

"sörmland":"sodermanland",
"södermanland":"sodermanland",

"skåne":"skane",

"västra götaland":"vastra-gotaland",
"västergötland":"vastra-gotaland",

"östergötland":"ostergotland"

}

search = synonyms[search] || search


const filtered=allFeatures.filter(f=>{

const p=f.properties

const matchSearch=

!search ||
p.name?.toLowerCase().includes(search) ||
p.municipality?.toLowerCase().includes(search) ||
p.region?.toLowerCase().includes(search)

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

map.setView(SWEDEN_CENTER,SWEDEN_ZOOM)

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

document.getElementById("resultCounter").innerHTML=
`<strong>Antal träffar: ${count}</strong>`

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

<div class="ad-container">

<p>Annons</p>

<ins class="adsbygoogle"
style="display:block"
data-ad-client="ca-pub-6036839968490609"
data-ad-slot="7765842047"
data-ad-format="auto"
data-full-width-responsive="true"></ins>

</div>

`

setTimeout(()=>{

try{
(adsbygoogle=window.adsbygoogle||[]).push({})
}catch(e){}

},300)

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
