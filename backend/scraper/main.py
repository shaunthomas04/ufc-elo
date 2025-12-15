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

def get_fight_info(soup, iframe_soup):
    output = {}

    # weight class
    weight_class_info = soup.find("div", class_="c-listing-fight__class-text")
    weight_class_text = weight_class_info.get_text(" ", strip=True)
    if "Women" in weight_class_text:
        output["weight_class"] = f"Women {weight_class_info.get_text(" ", strip=True).split(" ")[1]}"
    else:
        output["weight_class"] = f"Men {weight_class_info.get_text(" ", strip=True).split(" ")[0]}"

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
        matchup_info = soup.find_all("div", class_="c-listing-fight__content")

        # get iframe for additional info
        iframe = driver.find_element(By.CSS_SELECTOR, 'iframe[src^="/matchup/"]')
        driver.switch_to.frame(iframe)
        iframe_html = driver.page_source
        iframe_soup = BeautifulSoup(iframe_html, "html.parser")

        driver.switch_to.default_content()

        get_fight_info(matchup_info[i], iframe_soup)

driver = webdriver.Chrome()
driver.get("https://www.ufc.com/event/ufc-321")

click_fight_buttons(driver)

driver.quit()
