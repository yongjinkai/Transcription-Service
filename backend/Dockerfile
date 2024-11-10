FROM python:3.12-slim

WORKDIR /app
COPY . /app
COPY requirements.txt .

# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

#install dependencies
RUN pip install -r requirements.txt


CMD ["python", "main.py"]
