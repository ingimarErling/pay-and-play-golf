<!DOCTYPE html>
<html lang="sv">

<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Pay & Play Golf på Gotland – Spela utan grönt kort</title>

<meta name="description" content="Hitta Pay & Play golfbanor på Gotland. Se karta och lista över golfbanor där du kan spela golf utan grönt kort.">

<link rel="canonical" href="https://pay-and-play.org/region/gotland/">

<link rel="stylesheet" href="../../style.css">

<link rel="stylesheet"
href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>

<link rel="icon" type="image/x-icon" href="../../favicon.ico">

<style>

#regionMap{
height:520px;
margin-top:30px;
margin-bottom:40px;
border-radius:8px;
}

table{
width:100%;
border-collapse:collapse;
margin-top:30px;
font-size:15px;
}

th,td{
border:1px solid #ddd;
padding:10px;
}

th{
background:#f4f4f4;
}

tr:nth-child(even){
background:#fafafa;
}

</style>

</head>

<body>

<header class="site-header">

<h1>Pay & Play-banor på Gotland</h1>

<p class="subtitle">
Spela golf utan grönt kort på Gotland
</p>

</header>

<main style="max-width:1100px;margin:auto;padding:20px">

<h2>Golf utan grönt kort på Gotland</h2>

<p>
På Gotland finns flera golfbanor där du kan spela Pay & Play.
Du behöver inte vara medlem i en golfklubb och du behöver inget grönt kort.
</p>

<p>
Ön är ett av Sveriges mest populära golfresmål och flera banor är öppna för spontanspel.
</p>

<div id="regionMap"></div>

<h2>Lista över Pay & Play-banor på Gotland</h2>

<table>

<thead>
<tr>
<th>Golfbana</th>
<th>Kommun</th>
<th>Hål</th>
<th>Hemsida</th>
</tr>
</thead>

<tbody id="clubTable"></tbody>

</table>

</main>

<footer class="compact-footer">

<div class="footer-inner">

© 2026 Erlingsson – Pay & Play Golf Sverige |
<a href="../../index.html">Startsida</a> |
<a href="../../privacy-policy.html">Integritetspolicy</a>

</div>

</footer>

<script
src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js">
</script>

<script src="gotland.js"></script>

</body>
</html>
