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
# URL CHECK
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

    # prova https först
    return "https://" + url


# ===============================
# LOOPA REGIONER
# ===============================

total_clubs = 0

for file_name in region_files:

    if not os.path.exists(file_name):
        print(f"File missing: {file_name}")
        continue

    print(f"\nChecking {file_name}")

    with open(file_name, "r", encoding="utf-8") as f:
        data = json.load(f)

    for feature in data.get("features", []):
        props = feature.get("properties", {})
        name = props.get("name")
        website = props.get("website")

        total_clubs += 1

        if not website:
            print(f"{name}: NO WEBSITE")
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

        # fallback till http om https failar
        if isinstance(status, str) and website.startswith("https://"):
            fallback = website.replace("https://", "http://")
            status, final_url = check_url(fallback)
            website = fallback

        print(f"{name}: {status}")

        results.append({
            "club": name,
            "region": file_name,
            "website": website,
            "status": status,
            "final_url": final_url
        })


# ===============================
# SPARA JSON
# ===============================

with open("website_report.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

# ===============================
# SPARA CSV
# ===============================

with open("website_report.csv", "w", newline="", encoding="utf-8") as csvfile:
    writer = csv.DictWriter(
        csvfile,
        fieldnames=["club", "region", "website", "status", "final_url"]
    )
    writer.writeheader()
    writer.writerows(results)


# ===============================
# SUMMARY
# ===============================

ok = sum(1 for r in results if r["status"] == 200)
errors = sum(1 for r in results if isinstance(r["status"], str))
missing = sum(1 for r in results if r["status"] == "NO WEBSITE")

print("\n----------------------------------")
print(f"Total clubs checked: {total_clubs}")
print(f"OK (200): {ok}")
print(f"Errors: {errors}")
print(f"Missing website: {missing}")
print("----------------------------------")
print("Report saved as website_report.json and website_report.csv")
