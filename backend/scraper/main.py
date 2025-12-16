import requests
from bs4 import BeautifulSoup
import json
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium import webdriver
import time
import os
import string
import re
import traceback
from datetime import datetime
import hashlib

# function to get all of the fight links from the main page
def get_all_event_urls():
    output = []
    soup = click_through_events()
    h3_tags = soup.find_all("h3", class_="c-card-event--result__headline")

    for h3 in h3_tags:
        a_tag = h3.find("a")
        if a_tag and a_tag.has_attr("href"):
            output.append(f"https://www.ufc.com/{a_tag["href"]}")
            print(f"https://www.ufc.com/{a_tag["href"]}")

    os.makedirs("data", exist_ok=True)
    with open("data/event_urls.json", "w", encoding="utf-8") as f:
        json.dump(output, f, indent=4)

# function to get event location and date time
def get_event_info_dict(soup):
    output = {}
    
    # event name
    event_name_info = soup.find("div", class_="c-hero__header")
    output["event_name"] = event_name_info.get_text(" ", strip=True)

    # event date and time
    # TODO this needs to be fixed eventually to get actuall date info
    # TODO currently this does not get a full date as its not offered in this page
    date_time_info = soup.find("div", class_="c-hero__headline-suffix tz-change-inner")
    output["event_date"] = date_time_info.get_text(" ", strip=True)

    # venue, country, and city
    event_location_info = soup.find("div", class_="field field--name-venue field--type-entity-reference field--label-hidden field__item")
    event_location_info = event_location_info.get_text(" ", strip=True)
    cleaned_event_location = [line.strip().rstrip(",") for line in event_location_info.split("\n") if line.strip()]
    output["venue"] = cleaned_event_location[0]
    output["city"] = cleaned_event_location[1]
    output["country"] = cleaned_event_location[2]


    return output

def get_fight_info(soup, iframe_soup):
    output = {}

    # weight class
    weight_class_text = soup.find("div", class_="c-listing-fight__class-text").get_text(" ", strip=True)
    gender = "Women" if "Women" in weight_class_text or "Women's" in weight_class_text else "Men"
    weight = ' '.join([w for w in weight_class_text.split() if w.lower() not in ["men's","women's","men","women","bout","title"]])
    output["weight_class"] = f"{gender} {weight.title()}"

    # round, time, method
    fight_details_soup = iframe_soup.find("div", class_="c-matchup--results")
    fight_round_info = fight_details_soup.find("h4", class_="e-t5 round")
    fight_time_info = fight_details_soup.find("h4", class_="e-t5 time")
    fight_method_info = fight_details_soup.find("h4", class_="e-t5 method")
    output["round"] = fight_round_info.get_text(" ", strip=True)
    output["time_in_round"] = fight_time_info.get_text(" ", strip=True)
    output["finish_method"] = fight_method_info.get_text(" ", strip=True)

    # a fighter, b fighter
    fighter_details_soup = soup.find("div", class_="details-content__header")
    red_fighter_soup = fighter_details_soup.find("div", class_="details-content__name details-content__name--red")
    blue_fighter_soup = fighter_details_soup.find("div", class_="details-content__name details-content__name--blue")
    odds_details_soup = soup.find("div", class_="c-listing-fight__odds-wrapper")
    fighter_odds_soup = odds_details_soup.find_all("span", class_="c-listing-fight__odds-amount")

    # odds
    output["fighterA"] = red_fighter_soup.get_text(" ", strip=True)
    output["fighterB"] = blue_fighter_soup.get_text(" ", strip=True)
    output["odds_fighterA"] = fighter_odds_soup[0].get_text(" ", strip=True)
    output["odds_fighterB"] = fighter_odds_soup[1].get_text(" ", strip=True)

    # winner
    outcome_soup = soup.find("div", class_="c-listing-fight__corner--red")
    fighterA_outcome = outcome_soup.get_text(" ", strip=True)
    if fighterA_outcome == "NC":
        output["winner"] = "NC"
    elif fighterA_outcome == "Draw":
        output["winner"] = "DRAW"
    elif fighterA_outcome == "Win":
        output["winner"] = red_fighter_soup.get_text(" ", strip=True)
    else:
        output["winner"] = blue_fighter_soup.get_text(" ", strip=True)

    fight_stats_soup = iframe_soup.find("div", class_="c-stat-metric-compare-group")
    output["fight_stats"] = get_fight_stats_info(fight_stats_soup)

    return output
    

def get_fight_stats_info(soup):
    output = {}

    # strikes
    strikes_soup = soup.find("div", class_="c-stat-metric-compare total_strikes")
    output["fighterA_strikes_landed"] = strikes_soup.find("span", "c-stat-metric-compare__value c-stat-metric-compare__number").get_text(" ", strip=True)
    output["fighterB_strikes_landed"] = strikes_soup.find("span", "c-stat-metric-compare__value_2 c-stat-metric-compare__number").get_text(" ", strip=True)
    output["fighterA_strikes_percent"] = strikes_soup.find("span", "c-stat-metric-compare__percent percent").get_text(" ", strip=True)
    output["fighterB_strikes_percent"] = strikes_soup.find("span", "c-stat-metric-compare__percent_2 percent").get_text(" ", strip=True)
    
    # signficant strikes
    submissions_soup = soup.find("div", class_="c-stat-metric-compare sig_strikes")
    output["fighterA_significant_strikes"] = submissions_soup.find("span", "c-stat-metric-compare__value c-stat-metric-compare__number").get_text(" ", strip=True)
    output["fighterB_significant_strikes"] = submissions_soup.find("span", "c-stat-metric-compare__value_2 c-stat-metric-compare__number").get_text(" ", strip=True)

    # takedowns
    takedowns_soup = soup.find("div", class_="c-stat-metric-compare takedowns")
    output["fighterA_takedowns_landed"] = takedowns_soup.find("span", "c-stat-metric-compare__value c-stat-metric-compare__number").get_text(" ", strip=True)
    output["fighterB_takedowns_landed"] = takedowns_soup.find("span", "c-stat-metric-compare__value_2 c-stat-metric-compare__number").get_text(" ", strip=True)
    if takedowns_soup.find("span", "c-stat-metric-compare__value_of attempted"):
        if takedowns_soup.find("span", "c-stat-metric-compare__value_of attempted").get_text(" ", strip=True) != "":
            output["fighterA_takedowns_attempted"] = takedowns_soup.find("span", "c-stat-metric-compare__value_of attempted").get_text(" ", strip=True).replace("of ", "")
        else:
            output["fighterA_takedowns_attempted"] = 0
    else:
        output["fighterA_takedowns_attempted"] = 0

    if takedowns_soup.find("span", "c-stat-metric-compare__value_2_of attempted"):
        if takedowns_soup.find("span", "c-stat-metric-compare__value_2_of attempted").get_text(" ", strip=True) != "":
            output["fighterB_takedowns_attempted"] = takedowns_soup.find("span", "c-stat-metric-compare__value_2_of attempted").get_text(" ", strip=True).replace("of ", "")
        else:
            output["fighterB_takedowns_attempted"] = 0
    else:
        output["fighterB_takedowns_attempted"] = 0

    # submissions
    submissions_soup = soup.find("div", class_="c-stat-metric-compare sub_attempts")
    output["fighterA_submissions_attempted"] = submissions_soup.find("span", "c-stat-metric-compare__value c-stat-metric-compare__number").get_text(" ", strip=True)
    output["fighterB_submissions_attempted"] = submissions_soup.find("span", "c-stat-metric-compare__value_2 c-stat-metric-compare__number").get_text(" ", strip=True)
    
    # knockdowns
    knockdowns_soup = soup.find("div", class_="c-stat-metric-compare knockdowns")
    output["fighterA_knockdowns"] = knockdowns_soup.find("span", "c-stat-metric-compare__value c-stat-metric-compare__number").get_text(" ", strip=True)
    output["fighterB_knockdowns"] = knockdowns_soup.find("span", "c-stat-metric-compare__value_2 c-stat-metric-compare__number").get_text(" ", strip=True)
    
    return output

def get_all_event_fights_info_selenium(driver):
    output = []
    
    wait = WebDriverWait(driver, 15)
    # Wait until buttons are present and get them
    wait.until(EC.presence_of_all_elements_located(
        (By.CSS_SELECTOR, "button.c-listing-fight__expand-button")
    ))
    buttons = driver.find_elements(By.CSS_SELECTOR, "button.c-listing-fight__expand-button")

    for i in range(len(buttons)):
        # Re-find buttons each loop to avoid stale element errors
        buttons = driver.find_elements(By.CSS_SELECTOR, "button.c-listing-fight__expand-button")
        button = buttons[i]

        # Click the button using JS (safe with overlays)
        driver.execute_script("arguments[0].click();", button)
        print(f"Clicked button {i + 1}/{len(buttons)}")
        
        time.sleep(5)
        html = driver.page_source
        soup = BeautifulSoup(html, "html.parser")
        matchup_info = soup.find_all("div", class_="c-listing-fight__content")

        # get iframe for additional info
        iframe = driver.find_element(By.CSS_SELECTOR, 'iframe[src^="/matchup/"]')
        driver.switch_to.frame(iframe)
        iframe_html = driver.page_source
        iframe_soup = BeautifulSoup(iframe_html, "html.parser")

        driver.switch_to.default_content()

        output.append(get_fight_info(matchup_info[i], iframe_soup))

    return output

def click_through_events():
    driver = webdriver.Chrome()
    wait = WebDriverWait(driver, 10)

    driver.get("https://www.ufc.com/events")

    # Click "Past" tab
    past_tab = wait.until(
        EC.element_to_be_clickable(
            (By.CSS_SELECTOR, 'li.horizontal-tab-button[data-horizontaltabbutton="1"] a')
        )
    )
    driver.execute_script("arguments[0].click();", past_tab)
    time.sleep(2)

    html = None

    while True:
        try:
            # Scroll to bottom so the button becomes clickable
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(2)

            load_more = wait.until(
                EC.presence_of_element_located(
                    (By.CSS_SELECTOR, 'a.button[title="Load more items"]')
                )
            )

            driver.execute_script("arguments[0].click();", load_more)
            print("Clicked Load More")
            time.sleep(2)

        except:
            print("No more Load More button")
            break

    html = driver.page_source
    driver.quit()
    return BeautifulSoup(html, "html.parser")

def get_entire_event_information(url):
    output = {}
    driver = webdriver.Chrome()
    driver.get(url)

    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")

    output["url"] = url
    output["fights"] = get_all_event_fights_info_selenium(driver)
    output["event_info"] = get_event_info_dict(soup)
    driver.quit()


    return output


def get_all_pages_fighters_stats():
    output = []
    alphabet = string.ascii_lowercase
    for letter in alphabet:
        output.append(f"http://ufcstats.com/statistics/fighters?char={letter}&page=all")

    return output

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

save_scraped_fighter_info()
# get_all_fighter_urls()