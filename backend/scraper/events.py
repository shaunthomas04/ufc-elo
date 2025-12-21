import requests
from bs4 import BeautifulSoup
import json
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium import webdriver
import time
import os
import traceback
import re
import random

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

# function to get all fight info including stats from both fighters
def get_fight_info(soup, iframe_soup):
    print(f"Soup: {iframe_soup.prettify()}")
    os.makedirs("data/debug/html", exist_ok=True)

    # generate a random filename to save html
    filename = f"data/debug/html/{random.randint(100000, 999999)}.html"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(iframe_soup.prettify())
    
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
    
# get both fighter stats from a given fight in event
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

# selenium funnction that gets all of the fights and their info from given event
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
        # print(f"Clicked button {i + 1}/{len(buttons)}")
        
        time.sleep(20)
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

# selenium helper function to load page for all event urls
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

# function to tie everything togther to geet all of the info for a given event
def get_entire_event_information(url):
    output = {}

    # Set up headless Chrome driver
    chrome_options = Options()
    # chrome_options.add_argument("--headless")  
    # chrome_options.add_argument("--disable-gpu")  
    # chrome_options.add_argument("--no-sandbox") 

    driver = webdriver.Chrome(options=chrome_options)
    driver.get(url)


    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")

    output["url"] = url
    output["fights"] = get_all_event_fights_info_selenium(driver)
    output["event_info"] = get_event_info_dict(soup)
    driver.quit()

    return output

# function that saves valid event json locally and logs failed events info
def save_scraped_events_info():
    # Load remaining fighter URLs
    with open("data/event_urls.json", "r") as f:
        event_urls = json.load(f)

    os.makedirs("data/event_info", exist_ok=True)
    os.makedirs("data/failed", exist_ok=True)

    remaining_urls = []
    failed = []

    for url in event_urls:
        
        print(f"Starting: {url}")
        try:
            event_info = get_entire_event_information(url)

            # Clean event name to use as filename
            event_name = event_info["event_info"]["event_name"]
            event_name = re.sub(r'[^a-zA-Z0-9_-]', '_', event_name)

            with open(f"data/event_info/{event_name}.json", "w", encoding="utf-8") as f:
                json.dump(event_info, f, indent=4, ensure_ascii=False)

            print(f"Finished: {url}")

        except Exception as e:
            print(f"Failed: {url}")

            failed.append({
                "url": url,
                "error": str(e),
                "traceback": traceback.format_exc()
            })

            remaining_urls.append(url)

    # Rewrite fighter_urls.json with ONLY remaining URLs
    with open("data/event_urls.json", "w", encoding="utf-8") as f:
        json.dump(remaining_urls, f, indent=4)

    # Save failed URLs + reasons
    with open("data/failed/failed_events.json", "w", encoding="utf-8") as f:
        json.dump(failed, f, indent=4)

    print(f"Remaining URLs: {len(remaining_urls)}")
    print(f"Failed URLs saved to data/failed/failed_events.json")


save_scraped_events_info()

# get_entire_event_information("https://www.ufc.com//event/ufc-323")