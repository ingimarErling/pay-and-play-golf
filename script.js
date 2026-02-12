/* ===============================
   BAS
=============================== */

html, body {
    height: 100%;
}

body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background: #f5f7f6;
    display: flex;
    flex-direction: column;
}

/* ===============================
   RUBRIK
=============================== */

h1 {
    text-align: center;
    margin: 15px 0;
}

/* ===============================
   FILTERBAR
=============================== */

.filters {
    padding: 12px;
    text-align: center;
    background: #ffffff;
    border-bottom: 1px solid #ddd;
}

.filters input,
.filters select,
.filters button {
    margin: 5px;
    padding: 6px 10px;
    font-size: 14px;
}

/* ===============================
   HUVUDLAYOUT
=============================== */

.mainLayout {
    display: flex;
    flex: 1;                  /* fyller hela höjden */
    overflow: hidden;
}

/* ===============================
   KARTA
=============================== */

#map {
    flex: 3;                  /* mer plats för karta */
}

/* ===============================
   INFOPANEL
=============================== */

#infoPanel {
    flex: 1;
    max-width: 320px;         /* smalare panel */
    padding: 20px;
    background: #ffffff;
    border-left: 3px solid #2e7d32;
    box-shadow: -2px 0 6px rgba(0,0,0,0.05);
    overflow-y: auto;
}

#infoPanel h3 {
    margin-top: 0;
    color: #2e7d32;
    font-size: 18px;
}

#infoPanel p {
    margin: 8px 0;
    font-size: 14px;
}

#infoPanel a {
    color: #1565c0;
    text-decoration: none;
    font-weight: bold;
}

#infoPanel a:hover {
    text-decoration: underline;
}

/* ===============================
   RESULT COUNTER
=============================== */

#resultCounter {
    text-align: center;
    padding: 8px;
    font-weight: bold;
    background: #e8f5e9;
    border-bottom: 1px solid #c8e6c9;
}

/* ===============================
   FOOTER
=============================== */

footer {
    text-align: center;
    padding: 10px;
    background: #e8f5e9;
    font-size: 14px;
    border-top: 1px solid #c8e6c9;
}

/* ===============================
   MOBIL
=============================== */

@media (max-width: 768px) {

    .mainLayout {
        flex-direction: column;
    }

    #map {
        height: 50vh;
    }

    #infoPanel {
        max-width: 100%;
        border-left: none;
        border-top: 3px solid #2e7d32;
        box-shadow: none;
    }
}
