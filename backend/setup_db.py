# setup_db.py
import sqlite3
import os
def initialize_database():
    db_filename = os.path.join(os.path.dirname(__file__), "transcription.db")
    if not os.path.exists(db_filename): 
        conn = sqlite3.connect(db_filename)
        cursor = conn.cursor()
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS transcriptions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            file_name TEXT NOT NULL,
            transcription TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)
        conn.commit()
        conn.close()

if __name__ == "__main__":
    initialize_database()
    print("Database initialized successfully.")
