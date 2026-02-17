# ===============================
# LOOPA REGIONER MED PROGRESS
# ===============================

total_clubs = 0

# Räkna totala antal klubbar först
for file_name in region_files:
    if os.path.exists(file_name):
        with open(file_name, "r", encoding="utf-8") as f:
            data = json.load(f)
            total_clubs += len(data.get("features", []))

print(f"\nTotal clubs to check: {total_clubs}\n")

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

        # fallback http
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
