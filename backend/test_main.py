from fastapi.testclient import TestClient
from main import app,transcribe,initialize_database
import pytest
import os

@pytest.fixture(scope="module")
def setup_db():
    # Setup database fixture to initialize or clean the database before tests run
    initialize_database("./transcription.db")
    yield

# 1st test: Check for API response
def test_health_check():
    client = TestClient(app)
    response=client.get("/health")
    data = response.json()
    assert data["status"] == "healthy"

# 2nd test: To check if server is working and correctly transcribes given audio file.
# You can change to any mp3 audio file and change the last assert statement accordingly
def test_create_transcription(setup_db):
    audiofilepath = "audio_samples/Sample 1.mp3"

    with open(audiofilepath,"rb") as file:
        client = TestClient(app)
        response = client.post(
            "/transcribe", 
            files={"files": ("Sample 1.mp3", file, "audio/mp3")}  
        )
    assert response.status_code == 200
    data = response.json()
    assert "My name is Ethan" in data[0]["transcription"]

# 3rd test: to test if search by filename returns the correct responses and data
def test_search_file_name(setup_db):
    audiofilepath = "audio_samples/Sample 1.mp3"
    client = TestClient(app)
    with open(audiofilepath,"rb") as file:
        client = TestClient(app)
        response = client.post(
            "/transcribe", 
            files={"files": ("Sample 1.mp3", file, "audio/mp3")}  
        )
    query1 = "doesNotExist"
    query2 = "Sample 1" #Change query2 to any filename that exists in the database
    response1 = client.get(f"/search?query={query1}")
    response2 = client.get(f"/search?query={query2}")
    data2 = response2.json()
    assert response1.status_code == 404
    assert response2.status_code == 200
    assert "Sample 1" in data2[0]["file_name"] 
    