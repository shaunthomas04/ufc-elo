import json
import mysql.connector
from mysql.connector import errorcode
import os
from dotenv import load_dotenv
import unicodedata
import json
from pathlib import Path

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




# upload_fighters_sql()