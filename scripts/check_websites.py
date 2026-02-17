import json
import os
import requests
from requests.exceptions import RequestException
from urllib.parse import urlparse

# ===============================
# REGIONFILER (alla dina)
# ===============================

region_files = [
    "dalarna.geojson",
    "halland.geojson",
    "norrland.geojson",
    "orebro.geojson",
    "ostergotland.geojson",
    "skane.geojson",
    "smaland.geojson",
    "sodermanland.geojson",
    "stockholm.geojson",
    "uppland.geojson",
    "varmland.geojson",
    "vastmanland.geojson",
    "vastra-gotaland.geojson"
]

# ===============================
# INSTÄLLNINGAR
# ===============================

TIMEOUT = 8
HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; GolfChecker/1.0)"
}

results = []

# ===============================
# FUNKTION FÖR ATT KOLLA URL
# ===============================

def check_url(url):
    try:
        response = requests.get(url, timeout=TIMEOUT, headers=HEADERS, allow_redirects=True)
        return response.status_code
    except RequestException as e:
        return f"ERROR: {str(e)}"


# ===============================
# LOOPA ALLA REGIONER
# ===============================

for file_name in region_files:

    if not os.path.exists(file_name):
        print(f"⚠ Fil saknas: {file_name}")
        continue

    print(f"\n🔍 Läser {file_name}")

    with open(file_name, "r", encoding="utf-8") as f:
        data = json.load(f)

    for feature in data.get("features", []):
        props = feature.get("properties", {})
        name = props.get("name")
        website = props.get("website")

        if not website:
            results.append({
                "club": name,
                "region": file_name,
                "website": None,
                "status": "NO WEBSITE"
            })
            continue

        # Lägg till https om saknas
        parsed = urlparse(website)
        if not parsed.scheme:
            website = "https://" + website

        status = check_url(website)

        print(f"{name}: {status}")

        results.append({
            "club": name,
            "region": file_name,
            "website": website,
            "status": status
        })

# ===============================
# SPARA RAPPORT
# ===============================

with open("website_report.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print("\n✅ Klar! Rapport sparad som website_report.json")
