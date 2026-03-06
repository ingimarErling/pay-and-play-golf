import json
import os
import csv
import requests
from requests.exceptions import RequestException
from urllib.parse import urlparse
import sys
import time

# ===============================
# REGIONFILER
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

TIMEOUT = 6
HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; GolfChecker/1.0)"
}

results = []


def check_url(url):
    try:
        response = requests.get(
            url,
            timeout=TIMEOUT,
            headers=HEADERS,
            allow_redirects=True
        )
        return response.status_code
    except RequestException as e:
        return f"ERROR ({type(e).__name__})"


def normalize_url(url):
    parsed = urlparse(url)
    if parsed.scheme:
        return url
    return "https://" + url


# ===============================
# RÄKNA KLUBBAR
# ===============================

total = 0
for file_name in region_files:
    if os.path.exists(file_name):
        with open(file_name, "r", encoding="utf-8") as f:
            data = json.load(f)
            total += len(data.get("features", []))

print(f"\nTotal clubs: {total}")
print("-" * 40)
sys.stdout.flush()

current = 0

# ===============================
# LOOP MED LIVE PROGRESS
# ===============================

for file_name in region_files:

    if not os.path.exists(file_name):
        print(f"Missing file: {file_name}")
        sys.stdout.flush()
        continue

    print(f"\nProcessing file: {file_name}")
    sys.stdout.flush()

    with open(file_name, "r", encoding="utf-8") as f:
        data = json.load(f)

    for feature in data.get("features", []):
        current += 1

        props = feature.get("properties", {})
        name = props.get("name")
        website = props.get("website")

        print(f"[{current}/{total}] {name}", end=" -> ")
        sys.stdout.flush()

        if not website:
            print("NO WEBSITE")
            sys.stdout.flush()
            results.append({
                "club": name,
                "region": file_name,
                "website": None,
                "status": "NO WEBSITE"
            })
            continue

        website = normalize_url(website)
        status = check_url(website)

        print(status)
        sys.stdout.flush()

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

print("\nFinished.")
print(f"Checked {current} clubs.")
print("Report saved as website_report.json")
