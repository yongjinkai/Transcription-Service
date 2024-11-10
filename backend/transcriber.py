from transformers import pipeline

def transcribe(file):
    
    whisper = pipeline("automatic-speech-recognition",
                       model="openai/whisper-tiny")
    transcription = whisper(file)
    print("Transcription Text:", transcription["text"])
    return transcription["text"]

if __name__ == "__main__":
    filename = "../audio_samples/Sample_1.mp3"
    transcribe(filename)
