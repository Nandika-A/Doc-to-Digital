import requests
from dotenv import dotenv_values

env_vars = dotenv_values(".env")

def download_audio(text_to_convert,id,format):
    DEEPGRAM_URL = "https://api.deepgram.com/v1/speak?model=aura-orpheus-en"

    payload = {
        "text": f"{text_to_convert}"
    }

    headers = {
        "Authorization": "Token " + env_vars["DEEPGRAM_API_KEY"],
        "Content-Type": "application/json"
    }

    audio_file_path = f"media/audiofiles/{id}{format}"  # Path to save the audio file

    with open(audio_file_path, 'wb') as file_stream:
        response = requests.post(DEEPGRAM_URL, headers=headers, json=payload, stream=True)
        for chunk in response.iter_content(chunk_size=1024):
            if chunk:
                file_stream.write(chunk)

    print("Audio download complete")
