import json
import os
import csv
import requests
from requests.exceptions import RequestException
from urllib.parse import urlparse

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

# ===============================
# INSTÄLLNINGAR
# ===============================

TIMEOUT = 8
HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; GolfChecker/1.0)"
}

results = []

# ===============================
# FUNKTIONER
# ===============================

def check_url(url):
    try:
        response = requests.get(
            url,
            timeout=TIMEOUT,
            headers=HEADERS,
            allow_redirects=True
        )
        return response.status_code, response.url
    except RequestException as e:
        return f"ERROR: {type(e).__name__}", None


def normalize_url(url):
    if not url:
        return None

    parsed = urlparse(url)

    if parsed.scheme:
        return url

    return "https://" + url


# ===============================
# RÄKNA TOTALA KLUBBAR
# ===============================

total_clubs = 0

for file_name in region_files:
    if os.path.exists(file_name):
        with open(file_name, "r", encoding="utf-8") as f:
            data = json.load(f)
            total_clubs += len(data.get("features", []))

print(f"\nTotal clubs to check: {total_clubs}\n")

# ===============================
# LOOPA MED PROGRESS
# ===============================

current = 0

for file_name in region_files:

    if not os.path.exists(file_name):
        print(f"File missing: {file_name}")
        continue

    print(f"\n=== Checking file: {file_name} ===")

    with open(file_name, "r", encoding="utf-8") as f:
        data = json.load(f)

    for feature in data.get("features", []):
        props = feature.get("properties", {})
        name = props.get("name")
        website = props.get("website")

        current += 1
        print(f"[{current}/{total_clubs}] Checking {name} ...", end=" ")

        if not website:
            print("NO WEBSITE")
            results.append({
                "club": name,
                "region": file_name,
                "website": None,
                "status": "NO WEBSITE",
                "final_url": None
            })
            continue

        website = normalize_url(website)
        status, final_url = check_url(website)

        # fallback till http
        if isinstance(status, str) and website.startswith("https://"):
            fallback = website.replace("https://", "http://")
            status, final_url = check_url(fallback)
            website = fallback

        print(status)

        results.append({
            "club": name,
            "region": file_name,
            "website": website,
            "status": status,
            "final_url": final_url
        })


# ===============================
# SPARA RAPPORT
# ===============================

with open("website_report.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

with open("website_report.csv", "w", newline="", encoding="utf-8") as csvfile:
    writer = csv.DictWriter(
        csvfile,
        fieldnames=["club", "region", "website", "status", "final_url"]
    )
    writer.writeheader()
    writer.writerows(results)

print("\n----------------------------------")
print("Finished checking websites.")
print(f"Total checked: {current}")
print("Report saved as website_report.json and website_report.csv")
print("----------------------------------")
