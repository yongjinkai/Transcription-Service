from fastapi import FastAPI, HTTPException, File, UploadFile
from pydantic import BaseModel
from setup_db import initialize_database
from transcriber import transcribe
import sqlite3
import uvicorn

DATABASE_PATH = "transcription.db"

initialize_database()  # initialises the database in the backend folder
app = FastAPI()


class Transcription(BaseModel):
    file_name: str
    transcription: str
    id: int = None
    created_at: str = None


def get_db_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row  # Enables dictionary-like access to rows
    return conn


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/transcribe", response_model=Transcription)
async def create_transcription(file: UploadFile = File(...)):
    file_content = await file.read()
    file_name = file.filename
    transcription = transcribe(file_content)

    conn = get_db_connection()
    cursor = conn.cursor()

    # returns existing record if filename exists
    cursor.execute(
        "SELECT * FROM transcriptions WHERE file_name = ?", (file_name,)
    )
    existing_record = cursor.fetchone()
    if existing_record:
        print("record exists!")
        return {
            "id":existing_record['id'],
            'file_name':existing_record['file_name'],
            'transcription':existing_record['transcription'],
            'created_at':existing_record['created_at']
        }
    
    cursor.execute(
        "INSERT INTO transcriptions (file_name, transcription) VALUES (?, ?)",
        (file_name, transcription),
    )
    conn.commit()
    new_id = cursor.lastrowid
    cursor.close()
    conn.close()

    return {
        "id": new_id,
        "file_name": file_name,
        "transcription": transcription,
        "created_at": "Just Now"
    }


@app.get("/transcriptions")
def get_all_transcriptions():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM transcriptions"
    )
    rows = cursor.fetchall()
    transcriptions = [dict(row) for row in rows]
    cursor.close()
    conn.close()
    return transcriptions


@app.get("/search")
def search_file_name(query: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    print(f"this is my query: {query}")
    cursor.execute(
        "SELECT * FROM transcriptions WHERE file_name LIKE ?", (f"%{query}%",)
    )
    rows = cursor.fetchall()
    if not rows:
        raise HTTPException(
            status_code=404, detail="No matching transcriptions found")
    transcriptions = [
        Transcription(
            id=row["id"],
            file_name=row["file_name"],
            transcription=row["transcription"],
            created_at=row["created_at"],
        )
        for row in rows
    ]
    return transcriptions


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
