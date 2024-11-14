FROM python:3.12-slim

# Set working directory to /app
WORKDIR /app

# Copy the requirements file before copying all files to cache dependencies
COPY requirements.txt ./

RUN apt-get update && apt-get install -y ffmpeg

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire application code after installing dependencies to avoid re-installing dependencies on code changes
COPY . /app

# Run the Python script
CMD ["python", "main.py"]
