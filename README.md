# Transcription-Service

## Introduction

Transcription Service is a simple app where the user can upload single/batched audio files, and receive an English transcription. Data is saved locally, and the user can search back on previously transcribed audio files easily.

Source code is separated into 2 folders: frontend and backend. Audio_samples folder included in backend folder for testing purposes. Architecture.pdf is to describe service components.

## Initial Docker configuration 

Inside the backend folder, perform the following:

1. Build backend docker image with the name transcribe-be (or any other name):  
   `docker build -t transcriber-be .`
2. Run the image:  
   `docker run --name backend-container -p 8000:8000 transcriber-be`

Inside the frontend folder, perform the following:

1. Build frontend docker image:  
   `docker build -t transcriber-fe .`
2. Run the image:  
   `docker run --name frontend-container -p 3000:3000 transcriber-fe`

The app should then be accessible on http://localhost:3000 .

## Unit tests
Unit tests instructions are written to be ran inside the docker container. However, if all the required modules are installed, one can run the tests without the docker container.

### Frontend  
Tests are located in frontend/src/App.test.js . Run the frontend Docker image. In another terminal, run `docker exec -it frontend-container npm test` to run the 3 tests.

### Backend

Tests are located in backend/test_main.py . Run the backend Docker image. In another terminal, run `docker exec -it backend-container pytest` to run the 3 tests.
