import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="password",
        database="ufc_elo"
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
