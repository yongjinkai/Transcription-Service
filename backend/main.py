from fastapi import FastAPI, HTTPException, File, UploadFile
from pydantic import BaseModel
from setup_db import initialize_database
from transcriber import transcribe
import sqlite3,os
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
DATABASE_PATH = "transcription.db"

app = FastAPI()

# enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
db_filename = os.path.join(os.path.dirname(__file__), "transcription.db")

initialize_database(db_filename)  # initialises the database in the backend folder


class Transcription(BaseModel):
    file_name: str
    transcription: str
    id: int = None
    created_at: str = None


def get_db_connection(path):
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row  # Enables dictionary-like access to rows
    return conn


@app.get("/health")
def health_check():
    return {"status": "healthy"}

# POST method for single/batched file transcription. Expected return is a list of Transcription objects
@app.post("/transcribe", response_model=list[Transcription])
async def create_transcription(files: list[UploadFile] = File(...)):
    transcriptions = []
    conn = get_db_connection(DATABASE_PATH)
    cursor = conn.cursor()
    
    for file in files:
       
        file_content = await file.read()
        file_name = file.filename
        print(file_name)

        # fetches existing record from database if filename exists
        cursor.execute(
            "SELECT * FROM transcriptions WHERE file_name = ?", (file_name,)
        )
        existing_record = cursor.fetchone()
        if existing_record:
            transcriptions.append({
                "id": existing_record['id'],
                'file_name': existing_record['file_name'],
                'transcription': existing_record['transcription'],
                'created_at': existing_record['created_at']
            })
        else:
            try:
                transcription = transcribe(file_content)
            #whisper endpoint throws ValueError if filetype cannot be transcribed
            except ValueError: 
                raise HTTPException(status_code=400, detail="invalid file")
            cursor.execute(
                "INSERT INTO transcriptions (file_name, transcription) VALUES (?, ?)",
                (file_name, transcription),
            )

            new_id = cursor.lastrowid
            transcriptions.append({
                "id": new_id,
                "file_name": file_name,
                "transcription": transcription,
                "created_at": "Just Now"
            })
    conn.commit()
    cursor.close()
    conn.close()

    return transcriptions

#GET method to get all transcriptions
@app.get("/transcriptions")
def get_all_transcriptions():
    conn = get_db_connection(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM transcriptions"
    )
    rows = cursor.fetchall()
    transcriptions = [dict(row) for row in rows]
    cursor.close()
    conn.close()
    return transcriptions

# Search method to search database by filename
@app.get("/search")
def search_file_name(query: str):
    conn = get_db_connection(DATABASE_PATH)
    cursor = conn.cursor()

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

# Main function call to start backend server on local host port 8000
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
