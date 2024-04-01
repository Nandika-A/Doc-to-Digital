import os
from django.shortcuts import render
from .forms import UploadFileForm
from summarizer.summarizer import query
import os
from hack.settings import BASE_DIR
import asyncio
import requests
import main.scrapping_images as si
from key.keywordfile import keywordfunc
from gtts import gTTS
import pygame
from texttospeech.tts import download_audio 
import uuid

async def summary_per_page(text):   	
    output = await query({
        "inputs": text,
    })
    return output

def index(request):
    if request.method == "POST":
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            file = request.FILES["file"]
            path = os.path.join(BASE_DIR,'uploads')
            if not os.path.exists(path):
                os.makedirs(path)
            file_path = os.path.join(path, file.name)
            with open(file_path, "wb") as f:
                f.write(file.read())
            return render(request, "summary.html", context={"file": file_path})
    else:
        form = UploadFileForm()
    return render(request, "upload.html", {"form": form})

audionum = 3

def play_mp3(file_path):
    pygame.init()
    pygame.mixer.init()
    pygame.mixer.music.load(file_path)
    pygame.mixer.music.play()
    while pygame.mixer.music.get_busy():
        pygame.time.Clock().tick(10)

async def text_to_speech(summary):
    # global audionum 
    # tts = gTTS(f'{summary}',tld ='us',slow=False)
    # mp3_path = f'media/audiofiles/audio{audionum}.mp3'
    # tts.save(mp3_path)
    # audionum = audionum + 1

    """
    This function gets the summary of each page and converts it to speech for each page.
    After converting the text to speech, save the audio file in audio_files folder and return the path of the audio file.
    To play the audio file run play_mp3 function
    """
    # play_mp3(mp3_path)
    # print(mp3_path)
    id = uuid.uuid4()  
    download_audio(summary,id,".mp3")
    return f"media/audiofiles/{id}.mp3"

async def extract_tokens(text):
    """
    This function extracts tokens from the text passed page by page.
    These tokens will be used for web scrapping the image for each page. 
    Extract 1 to 2 tokens per page at max and while generating pass them in the form of a list of 1 token to the scrapper.
    Return back the result of the scrapper.
    """
    output = await keywordfunc({
	    "inputs": f"{text}",
    })
    sorted_array = sorted(output, key=lambda x: x['score'], reverse=True)
    if sorted_array:
        if len(sorted_array) >= 2 and sorted_array[0]['word'] != sorted_array[1]['word']:
            tokens = [sorted_array[0]['word'], sorted_array[1]['word']]
        else:
            tokens = [sorted_array[0]['word']]
    else:
        tokens = [] 

    print(tokens)
    return ["media/Latte_and_dark_coffee.jpg", "media/NationalGeographic_2572187_square.jpg","media/Latte_and_dark_coffee.jpg", "media/NationalGeographic_2572187_square.jpg"]
    # return scrapper(tokens)

def scrapper(tokens):
    """
    This function scraps the images for the tokens extracted from the text and downloads them in scrapped folder.
    returns 2 images per token
    """
    path = os.path.join(BASE_DIR, 'media')
    images = []
    for token in tokens:
        query_list = [token]
        image_result = si.search(query_list)
        for i in [0, 2]:
            img_url = image_result[i]
            response = requests.get(img_url)
            filename = img_url.split("/")[-1]
            img_path = os.path.join(path, filename)
            images.append('media/' + filename)
            fp = open(img_path, 'wb')
            fp.write(response.content)
            fp.close()
    return images
