import requests
from bs4 import BeautifulSoup
import json
import os
import string
import re
import traceback
from datetime import datetime
import hashlib

# function for getting all fighters stats list pages
def get_all_pages_fighters_stats():
    output = []
    alphabet = string.ascii_lowercase
    for letter in alphabet:
        output.append(f"http://ufcstats.com/statistics/fighters?char={letter}&page=all")

    return output

# get every fighter url from every stats page
def get_all_fighter_urls():
    output = []

    fighter_stats_pages_urls = get_all_pages_fighters_stats()

    for page_url in fighter_stats_pages_urls:
        response = requests.get(page_url)
        soup = BeautifulSoup(response.text, "html.parser")
        a_tags = soup.find_all("a", class_="b-link b-link_style_black")
        for a_tag in a_tags:
            output.append(a_tag["href"])

    unique_urls = list(set(output))
    os.makedirs("data", exist_ok=True)
    with open("data/fighter_urls.json", "w", encoding="utf-8") as f:
        json.dump(unique_urls, f, indent=4)

    return unique_urls

# get fighter information json from a given url
def get_fighter_info(fighter_stats_url):
    output = {}
    response = requests.get(fighter_stats_url)
    soup = BeautifulSoup(response.text, "html.parser")

    # name, record, nickname
    name_soup = soup.find("span", class_="b-content__title-highlight")
    record_soup = soup.find("span", class_="b-content__title-record")
    nickname_soup = soup.find("p", class_="b-content__Nickname")
    nickname = nickname_soup.get_text(" ", strip=True)
    if nickname == "":
        nickname = None

    full_name = name_soup.get_text(" ", strip=True).split(" ")
    output["first_name"] = " ".join(full_name[:-1]) if len(full_name) > 1 else full_name[0]
    output["last_name"] = full_name[-1]
    output["record"] = record_soup.get_text(" ", strip=True)
    output["nickname"] = nickname

    # fighter dimensions
    fighter_dimensions_soup = soup.find_all("li", class_="b-list__box-list-item b-list__box-list-item_type_block")
    height_str = fighter_dimensions_soup[0].get_text(" ", strip=True)
    reach_str = fighter_dimensions_soup[2].get_text(" ", strip=True)
    dob_str = fighter_dimensions_soup[4].get_text(" ", strip=True)
    weight_str = fighter_dimensions_soup[1].get_text(" ", strip=True)

    if height_str != "Height: --":
        height_in = int(re.search(r"(\d+)'\s*(\d+)", height_str).group(1)) * 12 + int(re.search(r"(\d+)'\s*(\d+)", height_str).group(2))
        output["height_in"] = height_in
    else:
        output["height_in"] = None

    if reach_str != "Reach: --":
        reach_in = int(re.search(r"(\d+)", reach_str).group(1))
        output["reach_in"] = reach_in
    else:
        output["reach_in"] = None

    if dob_str != "DOB: --":
        dob = datetime.strptime(dob_str.replace("DOB:", "").strip(), "%b %d, %Y").date()
        output["birth_date"] = dob.strftime("%Y-%m-%d")
    else:
            output["birth_date"] = None

    if weight_str != "Weight: --":
        weight_lbs = int(re.search(r"\d+", weight_str).group())
        output["weight_class"] = weight_lbs
    else:
        output["weight_class"] = None

    # other values
    output["url"] = fighter_stats_url
    raw_id = output["first_name"] + output["last_name"]
    clean_id = re.sub(r"[^a-zA-Z0-9]", "", raw_id).lower()
    hashed_id = hashlib.sha256(clean_id.encode("utf-8")).hexdigest()
    output["fighter_id"] = hashed_id

    print(f"finished {fighter_stats_url}")

    return output

# fuction that saves valid fighter json locally and logs failed fighter info
def save_scraped_fighter_info():
    # Load remaining fighter URLs
    with open("data/fighter_urls.json", "r") as f:
        fighter_urls = json.load(f)

    os.makedirs("data/fighter_info", exist_ok=True)
    os.makedirs("data/failed", exist_ok=True)

    remaining_urls = []
    failed = []

    for url in fighter_urls:
        try:
            fighter_info = get_fighter_info(url)
            with open(f"data/fighter_info/{fighter_info["fighter_id"]}.json", "w", encoding="utf-8") as f:
                json.dump(fighter_info, f, indent=4, ensure_ascii=False)


        except Exception as e:
            print(f"Failed: {url}")

            failed.append({
                "url": url,
                "error": str(e),
                "traceback": traceback.format_exc()
            })

            remaining_urls.append(url)

    # Rewrite fighter_urls.json with ONLY remaining URLs
    with open("data/fighter_urls.json", "w", encoding="utf-8") as f:
        json.dump(remaining_urls, f, indent=4)

    # Save failed URLs + reasons
    with open("data/failed/failed_fighters.json", "w", encoding="utf-8") as f:
        json.dump(failed, f, indent=4)

    print(f"Remaining URLs: {len(remaining_urls)}")
    print(f"Failed URLs saved to data/failed/failed_fighters.json")

# save_scraped_fighter_info()
# get_all_fighter_urls()