import mysql.connector
import mysql.connector
from mysql.connector import errorcode
import os
from dotenv import load_dotenv


def get_connection():
    # Load environment variables
    load_dotenv()
    DB_USER = os.getenv("DB_USER")
    DB_PASS = os.getenv("DB_PASS")
    DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
    DB_NAME = os.getenv("DB_NAME")
        
    
    return mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASS,
        database=DB_NAME
    )

def call_procedure(proc_name, args=()):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.callproc(proc_name, args)
    
    results = []
    for result in cursor.stored_results():
        results = result.fetchall()

    conn.commit()
    cursor.close()
    conn.close()
    return results
