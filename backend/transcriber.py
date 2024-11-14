from transformers import pipeline

# Function to transcribe audio file using whisper-tiny model
def transcribe(file):
    whisper = pipeline("automatic-speech-recognition",
                       model="openai/whisper-tiny")
    transcription = whisper(file)
    return transcription["text"]


if __name__ == "__main__":
    filename = "../audio_samples/Sample_1.mp3"
    transcribe(filename)
