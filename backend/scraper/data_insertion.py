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
import random
from datetime import datetime, timedelta

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

# helper function to find attempted number of strikes
def calculate_strikes_attempted(strikes_landed, strikes_percent):
    try:
        if strikes_percent is None or strikes_percent == "":
            return int(strikes_landed)
        percent = float(re.sub(r"[()%]", "", str(strikes_percent))) / 100
        if percent == 0:
            return int(strikes_landed)
        return round(int(strikes_landed) / percent)
    except Exception as e:
        print(f"Error calculating strikes_attempted: strikes_landed={strikes_landed}, strikes_percent={strikes_percent}, error={e}")
        return int(strikes_landed)

def normalize_and_hash_name(text):
    # Normalize unicode (Błachowicz → Blachowicz)
    text = unidecode(text)
    text = re.sub(r"[^a-zA-Z0-9]", "", text)
    text = text.lower()

    return hashlib.sha256(text.encode("utf-8")).hexdigest()

def safe_int(value, default=0):
    """Convert value to int safely, stripping non-digit characters."""
    if value is None:
        return default
    # Remove everything except digits
    cleaned = re.sub(r"[^\d]", "", str(value))
    return int(cleaned) if cleaned else default



# get all fighter json from local scraped data
def get_all_raw_event_json():
    directory = Path("data/event_info")
    json_objects = []

    for file_path in directory.glob("*.json"):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                json_objects.append(json.load(f))
        except json.JSONDecodeError as e:
            print(f"Skipping {file_path}: {e}")

    return json_objects

# Generate a random date in the past 5 years for placeholder data
def generate_placeholder_date():
    start_date = datetime.now() - timedelta(days=5*365)
    random_days = random.randint(0, 5*365)
    random_date = start_date + timedelta(days=random_days)
    return random_date.date()  


# TODO THIS NEEDS TO BE FIXED!! need to build new scraper to attach event date info from another source :(

# uploads a raw json file into sql db
def upload_event_to_sql(conn, event_json):
    event_id = hashlib.sha256(event_json["event_name"].encode("utf-8")).hexdigest()

    cursor = conn.cursor()
        
    try:
        cursor.callproc('AddEvent', [
            event_id,
            event_json["event_name"],
            # event_json["event_date"],
            generate_placeholder_date(),
            event_json["venue"],
            event_json["city"],
            event_json["country"]
        ])
        conn.commit()
        print(f"Event {event_json['event_name']} inserted successfully!")
    finally:
        cursor.close()


def get_fighter_id(name, broken_fighter_lookup):
    return broken_fighter_lookup.get(name) or normalize_and_hash_name(name)

# uploads fights to sql db 
def upload_fight_to_sql(conn, fight_json, event_name, broken_fighter_lookup):
    fight_id = hashlib.sha256(fight_json["fighterA"].encode("utf-8") + fight_json["fighterB"].encode("utf-8") + event_name.encode("utf-8")).hexdigest()
    event_id = hashlib.sha256(event_name.encode("utf-8")).hexdigest()
        
    if fight_json["fighterA"] in broken_fighter_lookup:
        fighterA_id = broken_fighter_lookup[fight_json["fighterA"]]
    else:
        fighterA_id = normalize_and_hash_name(fight_json["fighterA"])
    
    if fight_json["fighterB"] in broken_fighter_lookup:
        fighterB_id = broken_fighter_lookup[fight_json["fighterB"]]
    else:
        fighterB_id = normalize_and_hash_name(fight_json["fighterB"])
    
    if fight_json["winner"] in broken_fighter_lookup:
        winner_id = broken_fighter_lookup[fight_json["winner"]]
    elif fight_json["winner"] == "NC":
        winner_id = None
    elif fight_json["winner"] == "DRAW":
        winner_id = None 
    else:
        winner_id = normalize_and_hash_name(fight_json["winner"])

    cursor = conn.cursor()
        
    try:
        # CHECK FOR DUPLICATE FIRST
        cursor.execute("SELECT fight_id FROM Fights WHERE fight_id = %s", (fight_id,))
        if cursor.fetchone():
            print(f"⚠️  Fight already exists: {fight_json['fighterA']} vs {fight_json['fighterB']} - SKIPPING")
            return  
        
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

        upload_fight_stats_to_sql(conn, fight_json["fight_stats"], fight_id, fighterA_id, True)
        upload_fight_stats_to_sql(conn, fight_json["fight_stats"], fight_id, fighterB_id, False)

    finally:
        cursor.close()


def load_fighter_id_map(path="data/failed/bad_fighters_lookup.json"):
    """
    Loads fighter name → fighter_id mapping from JSON.
    Returns dict[str, str]
    """
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    fighter_map = {}

    for entry in data.get("fighters", []):
        name = entry.get("originalName")
        fighter_id = entry.get("id")

        if not name or not fighter_id:
            continue

        # normalize key for matching
        fighter_map[name] = fighter_id

    return fighter_map


# uploads either fighter a or b's stats into sql
def upload_fight_stats_to_sql(conn, fight_stats, fight_id, fighter_id, isFighterA):
    if isFighterA:
        s_landed = safe_int(fight_stats["fighterA_strikes_landed"])
        s_attempt = safe_int(calculate_strikes_attempted(s_landed, fight_stats["fighterA_strikes_percent"]))
        t_landed = safe_int(fight_stats["fighterA_takedowns_landed"])
        t_attempt = safe_int(fight_stats["fighterA_takedowns_attempted"])
        subs = safe_int(fight_stats["fighterA_submissions_attempted"])
        knockdowns = safe_int(fight_stats["fighterA_knockdowns"])
    else:
        s_landed = safe_int(fight_stats["fighterB_strikes_landed"])
        s_attempt = safe_int(calculate_strikes_attempted(s_landed, fight_stats["fighterB_strikes_percent"]))
        t_landed = safe_int(fight_stats["fighterB_takedowns_landed"])
        t_attempt = safe_int(fight_stats["fighterB_takedowns_attempted"])
        subs = safe_int(fight_stats["fighterB_submissions_attempted"])
        knockdowns = safe_int(fight_stats["fighterB_knockdowns"])


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

# uploads all local data event info into sql
def upload_all_events_with_fights():
    all_events_json = get_all_raw_event_json()
    failed_fights_upload = []
    failed_events_upload = []
    broken_fighter_lookup = load_fighter_id_map()

    try:
        conn = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASS,
            database=DB_NAME
        )

        for event_data in all_events_json:

            event_name = event_data["event_info"]["event_name"]
            try:
                upload_event_to_sql(conn, event_data["event_info"])
                fights = event_data["fights"]
                event_name = event_data["event_info"]["event_name"]
         
                for fight in fights:
                    try:
                        upload_fight_to_sql(conn, fight, event_name, broken_fighter_lookup)
                    except Exception as e:
                        failed_fights_upload.append({
                            "fighterA": fight["fighterA"],
                            "fighterB": fight["fighterB"],
                            "error": str(e),
                            "error_type": type(e).__name__,
                            "url": event_data["url"]
                        })       
            except Exception as e:
                print(f"Failed to upload {event_name}: {e}")
                failed_events_upload.append({
                    "event_name": event_name,
                    "error": str(e)
                })

    except mysql.connector.Error as err:
        print(f"Database connection error: {err}")
    finally:
        if conn:
            conn.close()

    # Save failed uploads to a JSON file
    if failed_fights_upload:
        os.makedirs("data/failed", exist_ok=True)
        failed_file_path = "data/failed/failed_fight_uploads.json"
        with open(failed_file_path, "w", encoding="utf-8") as f:
            json.dump(failed_fights_upload, f, indent=4)
        print(f"Saved {len(failed_fights_upload)} failed uploads to {failed_file_path}")

    if failed_events_upload:
        os.makedirs("data/failed", exist_ok=True)
        failed_file_path = "data/failed/failed_events_upload.json"
        with open(failed_file_path, "w", encoding="utf-8") as f:
            json.dump(failed_events_upload, f, indent=4)
        print(f"Saved {len(failed_events_upload)} failed uploads to {failed_file_path}")


# function that goes through all fighters and aggregates their career stats
def generate_fighter_stats():

    try:
        conn = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASS,
            database=DB_NAME
        )
        
        cursor = conn.cursor(dictionary=True)

        # 1. Get all fighters
        cursor.execute("SELECT fighter_id FROM Fighters")
        fighters = cursor.fetchall()

        for fighter in fighters:
            fighter_id = fighter["fighter_id"]

            # 2. Aggregate fight-level stats
            cursor.execute("""
                SELECT fs.*, f.winner_id, f.finish_method
                FROM FightStats fs
                JOIN Fights f ON f.fight_id = fs.fight_id
                WHERE fs.fighter_id = %s
            """, (fighter_id,))
            fights = cursor.fetchall()

            # accumulators
            total_wins = total_losses = total_draws = 0
            ko_wins = sub_wins = decision_wins = 0
            strikes_landed = strikes_attempted = 0
            takedowns_landed = takedowns_attempted = 0
            submissions_attempted = knockdowns = 0

            for fight in fights:
                # Fight stats sums
                strikes_landed += int(fight.get("strikes_landed", 0) or 0)
                strikes_attempted += int(fight.get("strikes_attempted", 0) or 0)
                takedowns_landed += int(fight.get("takedowns_landed", 0) or 0)
                takedowns_attempted += int(fight.get("takedowns_attempted", 0) or 0)
                submissions_attempted += int(fight.get("submissions_attempted", 0) or 0)
                knockdowns += int(fight.get("knockdowns", 0) or 0)

                # Wins / losses / draws
                winner_id = fight.get("winner_id")
                finish_method = fight.get("finish_method") or ""

                if winner_id == fighter_id:
                    total_wins += 1
                    if "KO" in finish_method.upper():
                        ko_wins += 1
                    elif "SUB" in finish_method.upper():
                        sub_wins += 1
                    else:
                        decision_wins += 1
                elif winner_id is None:
                    total_draws += 1
                else:
                    total_losses += 1

            # 3. Insert or update FighterStats
            cursor.execute("""
                INSERT INTO FighterStats (
                    fighter_id, wins, losses, draws,
                    ko_wins, sub_wins, decision_wins,
                    strikes_landed, strikes_attempted,
                    takedowns_landed, takedowns_attempted
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE
                    wins = VALUES(wins),
                    losses = VALUES(losses),
                    draws = VALUES(draws),
                    ko_wins = VALUES(ko_wins),
                    sub_wins = VALUES(sub_wins),
                    decision_wins = VALUES(decision_wins),
                    strikes_landed = VALUES(strikes_landed),
                    strikes_attempted = VALUES(strikes_attempted),
                    takedowns_landed = VALUES(takedowns_landed),
                    takedowns_attempted = VALUES(takedowns_attempted)
            """, (
                fighter_id, total_wins, total_losses, total_draws,
                ko_wins, sub_wins, decision_wins,
                strikes_landed, strikes_attempted,
                takedowns_landed, takedowns_attempted
            ))

        conn.commit()
        print(f"FighterStats generated for {len(fighters)} fighters!")
    
    except mysql.connector.Error as err:
        print(f"Database connection error: {err}")
    finally:
        cursor.close()
        if conn:
            conn.close()
        



# upload_fighters_sql()
# upload_all_events_with_fights()
# generate_fighter_stats()


def create_bad_names_lookup(failed_file_path="data/failed/failed_fight_uploads.json",
                            output_file_path="data/failed/bad_fighters_lookup.json"):
    """
    Reads a failed fights JSON, extracts all fighterA and fighterB names,
    creates a set of unique names, and writes a JSON file with
    [{"originalName": name, "id": ""}, ...]
    """
    unique_names = set()
    
    # Read the failed fights file
    with open(failed_file_path, "r", encoding="utf-8") as f:
        try:
            failed_data = json.load(f)
        except json.JSONDecodeError as e:
            print(f"Error reading JSON: {e}")
            return

    # Collect fighterA and fighterB names
    for fight in failed_data:
        if "fighterA" in fight and fight["fighterA"]:
            unique_names.add(fight["fighterA"].strip())
        if "fighterB" in fight and fight["fighterB"]:
            unique_names.add(fight["fighterB"].strip())
    
    # Prepare output list
    output_list = [{"originalName": name, "id": ""} for name in sorted(unique_names)]
    
    # Write to JSON
    with open(output_file_path, "w", encoding="utf-8") as out_f:
        json.dump({"fighters": output_list}, out_f, indent=4)
    
    print(f"Saved {len(unique_names)} unique fighter names to {output_file_path}")




# elo rating functions

# Returns a list of dicts, one per row in the Fights table.
def get_all_fights(conn):
    cursor = conn.cursor(dictionary=True)

    # Join Fights with Events to get the event date
    query = """
        SELECT f.*, e.event_date
        FROM Fights f
        JOIN Events e ON f.event_id = e.event_id
        ORDER BY e.event_date ASC
    """
    cursor.execute(query)
    fights = cursor.fetchall()

    cursor.close()
    # conn.close()

    return fights



# Returns number of months inactive before current_event_date.
def months_between(d1, d2):
    return (d2.year - d1.year) * 12 + (d2.month - d1.month)

def get_months_inactive(conn, fighter_id, current_event_date):
    query = """
        SELECT MAX(e.event_date) AS last_fight_date
        FROM Fights f
        JOIN Events e ON f.event_id = e.event_id
        WHERE (f.fighterA_id = %s OR f.fighterB_id = %s)
          AND e.event_date < %s;
    """
    cursor = conn.cursor(dictionary=True)
    cursor.execute(query, (fighter_id, fighter_id, current_event_date))
    row = cursor.fetchone()


    print(row)
    last_fight_date = row["last_fight_date"]
    cursor.close()


    # Debut fight
    if last_fight_date is None:
        return 0

    return months_between(last_fight_date, current_event_date)




# def insert_elo_one_fight():









def insert_all_elo_records():
    try:
        conn = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASS,
            database=DB_NAME
        )
        
        first_fight = get_all_fights(conn)[300]
        # print(first_fight)
  
        print(get_months_inactive(conn, first_fight["fighterA_id"], first_fight['event_date']))
        

    except mysql.connector.Error as err:
        print(f"Database connection error: {err}")
    finally:
        if conn:
            conn.close()





insert_all_elo_records()
# print(json.dumps(load_fighter_id_map(), indent=4))

# create_bad_names_lookup()






