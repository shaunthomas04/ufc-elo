import requests
from bs4 import BeautifulSoup
import json
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium import webdriver
import time

base_url = "https://www.ufc.com"


# function to get all of the fight links from the main page
def get_all_event_urls():
    output = []
    response = requests.get(f"{base_url}/events")
    soup = BeautifulSoup(response.text, "html.parser")
    h3_tags = soup.find_all("h3", class_="c-card-event--result__headline")

    for h3 in h3_tags:
        a_tag = h3.find("a")
        if a_tag and a_tag.has_attr("href"):
            output.append(f"{base_url}/{a_tag["href"]}")
            print(f"{base_url}/{a_tag["href"]}")

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

def get_fight_info(soup):
    output = {}

    # weight class
    weight_class_info = soup.find("div", class_="c-listing-fight__class-text")
    output["weight_class"] = weight_class_info.get_text(" ", strip=True).split(" ")[0]


    # round, time, method
    fight_round_info = soup.find("div", class_="e-t5 round")
    fight_time_info = soup.find("div", class_="e-t5 time")
    fight_method_info = soup.find("div", class_="e-t5 method")
    output["round"] = fight_round_info.get_text(" ", strip=True)
    output["time_in_round"] = fight_time_info.get_text(" ", strip=True)
    output["finish_method"] = fight_method_info.get_text(" ", strip=True)


    # a fighter, b fighter, and weightclass
    # names_and_weight_info = soup.find("div", class_="details-content__header")

    print(output)
    

def selenium_fight_info(soup):
    fight_buttons_clickable = soup.find_all("button", class_="c-listing-fight__expand-button")
    print(len(fight_buttons_clickable))




def click_fight_buttons(driver):
    wait = WebDriverWait(driver, 15)

    # Wait until buttons are present and get them
    wait.until(EC.presence_of_all_elements_located(
        (By.CSS_SELECTOR, "button.c-listing-fight__expand-button")
    ))
    buttons = driver.find_elements(By.CSS_SELECTOR, "button.c-listing-fight__expand-button")
    print(f"Found {len(buttons)} fight buttons")

    for i in range(len(buttons)):
        # Re-find buttons each loop to avoid stale element errors
        buttons = driver.find_elements(By.CSS_SELECTOR, "button.c-listing-fight__expand-button")
        button = buttons[i]

        # Click the button using JS (safe with overlays)
        driver.execute_script("arguments[0].click();", button)
        print(f"✅ Clicked button {i + 1}/{len(buttons)}")
        time.sleep(5)
        html = driver.page_source
        soup = BeautifulSoup(html, "html.parser")
        # matchup_info = soup.find_all("li", class_="l-listing__item")
        # print(matchup_info[i].prettify())
        # matchup_info = soup.find("div", class_="c-matchup--results")
        # print(matchup_info.prettify())



driver = webdriver.Chrome()
driver.get("https://www.ufc.com/event/ufc-321")

click_fight_buttons(driver)

driver.quit()

# get_all_event_urls()
event_url = "https://www.ufc.com//event/ufc-321"
response = requests.get(event_url)
soup = BeautifulSoup(response.text, "html.parser")
selenium_fight_info(soup)
# print(json.dumps(get_event_info_dict(soup), indent=4))