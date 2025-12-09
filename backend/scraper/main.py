import requests
from bs4 import BeautifulSoup
import json

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

# get_all_event_urls()
event_url = "https://www.ufc.com//event/ufc-321"
response = requests.get(event_url)
soup = BeautifulSoup(response.text, "html.parser")
print(json.dumps(get_event_info_dict(soup), indent=4))