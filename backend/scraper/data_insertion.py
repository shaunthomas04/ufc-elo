import json
import mysql.connector
from mysql.connector import errorcode
import os
from dotenv import load_dotenv
import unicodedata
import json
from pathlib import Path
import unicodedata
import re
import hashlib
from unidecode import unidecode

# Load environment variables
load_dotenv()
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")
DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
DB_NAME = os.getenv("DB_NAME")

# Minimal cleaning function
def clean_text(s):
    if s is None:
        return None
    # Normalize unicode to ASCII, remove strange chars
    s = unicodedata.normalize('NFKD', str(s)).encode('ascii', 'ignore').decode('ascii')
    return s.strip()

# Prepare cleaned data
def clean_raw_fighter_json(raw_json):
    clean_json = {
        "fighter_id": clean_text(raw_json["fighter_id"]),
        "first_name": clean_text(raw_json["first_name"]),
        "last_name": clean_text(raw_json["last_name"]),
        "nickname": clean_text(raw_json.get("nickname")),
        "birth_date": raw_json.get("birth_date"),
        "weight_class": str(raw_json.get("weight_class")),
        "height_in": raw_json.get("height_in"),
        "reach_in": raw_json.get("reach_in"),
        "url": raw_json.get("url"),
        "record": raw_json.get("record").replace("Record: ", "")
    }

    return clean_json

# get all fighter json from local scraped data
def get_all_raw_fighter_json():
    directory = Path("data/fighter_info")
    json_objects = []

    for file_path in directory.glob("*.json"):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                json_objects.append(json.load(f))
        except json.JSONDecodeError as e:
            print(f"Skipping {file_path}: {e}")

    return json_objects

# uploads a raw json file into sql db
def upload_fighter_json_to_sql(conn, fighter_json):
    # Clean data before upload
    fighter_data = clean_raw_fighter_json(fighter_json)

    cursor = conn.cursor()
    try:
        cursor.callproc('AddFighter', [
            fighter_data["fighter_id"],
            fighter_data["first_name"],
            fighter_data["last_name"],
            fighter_data["nickname"],
            fighter_data["birth_date"],
            fighter_data["weight_class"],
            fighter_data["height_in"],
            fighter_data["reach_in"],
            fighter_data["url"]
        ])
        conn.commit()
        print(f"Fighter {fighter_data['first_name']} {fighter_data['last_name']} inserted successfully!")
    finally:
        cursor.close()

# upload all fighter json and log failed uploads with reason
def upload_fighters_sql():
    all_fighters_json = get_all_raw_fighter_json()
    failed_fighters_upload = []

    try:
        conn = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASS,
            database=DB_NAME
        )

        for fighter_data in all_fighters_json:
            try:
                upload_fighter_json_to_sql(conn, fighter_data)
            except Exception as e:
                print(f"Failed to upload {fighter_data.get('first_name')} {fighter_data.get('last_name')}: {e}")
                failed_fighters_upload.append({
                    "fighter_id": fighter_data.get("fighter_id"),
                    "first_name": fighter_data.get("first_name"),
                    "last_name": fighter_data.get("last_name"),
                    "error": str(e)
                })

    except mysql.connector.Error as err:
        print(f"Database connection error: {err}")
    finally:
        if conn:
            conn.close()

    # Save failed uploads to a JSON file
    if failed_fighters_upload:
        os.makedirs("data/failed", exist_ok=True)
        failed_file_path = "data/failed/failed_fighter_uploads.json"
        with open(failed_file_path, "w", encoding="utf-8") as f:
            json.dump(failed_fighters_upload, f, indent=4)
        print(f"Saved {len(failed_fighters_upload)} failed uploads to {failed_file_path}")


# uploads a raw json file into sql db
def upload_event_to_sql(conn, event_json):
    event_id = hashlib.sha256(event_json["event_name"].encode("utf-8")).hexdigest()

    cursor = conn.cursor()
        
    try:
        cursor.callproc('AddEvent', [
            event_id,
            event_json["event_name"],
            event_json["event_date"],
            event_json["venue"],
            event_json["city"],
            event_json["country"]
        ])
        conn.commit()
        print(f"Event {event_json['event_name']} inserted successfully!")
    finally:
        cursor.close()

# uploads all fights from an event into sql db
# {
#             "weight_class": "Men Bantamweight",
#             "round": "5",
#             "time_in_round": "5:00",
#             "finish_method": "Decision - Unanimous",
#             "fighterA": "Merab Dvalishvili",
#             "fighterB": "Petr Yan",
#             "odds_fighterA": "-485",
#             "odds_fighterB": "+370",
#             "winner": "Petr Yan",
#             "fight_stats": {
#                 "fighterA_strikes_landed": "196",
#                 "fighterB_strikes_landed": "159",
#                 "fighterA_strikes_percent": "(43%)",
#                 "fighterB_strikes_percent": "(63%)",
#                 "fighterA_significant_strikes": "134",
#                 "fighterB_significant_strikes": "139",
#                 "fighterA_takedowns_landed": "2",
#                 "fighterB_takedowns_landed": "5",
#                 "fighterA_takedowns_attempted": "29",
#                 "fighterB_takedowns_attempted": "9",
#                 "fighterA_submissions_attempted": "2",
#                 "fighterB_submissions_attempted": "0",
#                 "fighterA_knockdowns": "0",
#                 "fighterB_knockdowns": "0"
#             }


def upload_fight_to_sql(conn, fight_json, event_name):
    fight_id = hashlib.sha256(fight_json["fighterA"].encode("utf-8") + fight_json["fighterB"].encode("utf-8") + event_name.encode("utf-8")).hexdigest()
    event_id = hashlib.sha256(event_name.encode("utf-8")).hexdigest()
    fighterA_id = normalize_and_hash_name(fight_json["fighterA"])
    fighterB_id = normalize_and_hash_name(fight_json["fighterB"])
    winner_id = normalize_and_hash_name(fight_json["winner"])

    cursor = conn.cursor()
        
    try:
        cursor.callproc('AddFight', [
            fight_id,
            event_id,
            fighterA_id,
            fighterB_id,
            winner_id,
            fight_json["finish_method"],
            fight_json["round"],
            fight_json["time_in_round"],
            fight_json["weight_class"],
            fight_json["odds_fighterA"],
            fight_json["odds_fighterB"]
        ])
        conn.commit()
        print(f"Fight {fight_id} inserted successfully!")
    finally:
        cursor.close()


def upload_fight_stats_to_sql(conn, fight_stats, fight_id, fighter_id, isFighterA):
    if isFighterA:
        s_landed = fight_stats["fighterA_strikes_landed"]
        s_attempt = calculate_strikes_attempted(s_landed, fight_stats["fighterA_strikes_percent"])
        t_landed = fight_stats["fighterA_takedowns_landed"]
        t_attempt = fight_stats["fighterA_takedowns_attempted"]
        subs = fight_stats["fighterA_submissions_attempted"]
        knockdowns = fight_stats["fighterA_knockdowns"]
    
    else:
        s_landed = fight_stats["fighterB_strikes_landed"]
        s_attempt = calculate_strikes_attempted(s_landed, fight_stats["fighterB_strikes_percent"])
        t_landed = fight_stats["fighterB_takedowns_landed"]
        t_attempt = fight_stats["fighterB_takedowns_attempted"]
        subs = fight_stats["fighterB_submissions_attempted"]
        knockdowns = fight_stats["fighterB_knockdowns"]
    
    
    cursor = conn.cursor()
        
    try:
        cursor.callproc('AddFightStats', [
            fight_id,
            fighter_id,
            s_landed,
            s_attempt,
            t_landed,
            t_attempt,
            subs,
            knockdowns,
        ])
        conn.commit()
    finally:
        cursor.close()


def calculate_strikes_attempted(strikes_landed, strikes_percent):
    # Remove parentheses and % and convert to float fraction
    percent = float(re.sub(r"[()%]", "", strikes_percent)) / 100
    if percent == 0:  # avoid division by zero
        return strikes_landed
    return round(strikes_landed / percent)

def normalize_and_hash_name(text):
    # Normalize unicode (Błachowicz → Blachowicz)
    text = unidecode(text)
    text = re.sub(r"[^a-zA-Z0-9]", "", text)
    text = text.lower()

    return hashlib.sha256(text.encode("utf-8")).hexdigest()





# upload_fighters_sql()