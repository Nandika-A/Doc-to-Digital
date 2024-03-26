from django.shortcuts import render
from .forms import UploadFileForm
from pypdf import PdfReader
import os
from hack.settings import BASE_DIR
from summarizer.summarizer import query
import multiprocessing
import time
from django.http import JsonResponse

def summary_per_page(text):   	
    output = query({
        "inputs": text,
    })
    return output

def process_text(text, result_queue):
    image_file = extract_tokens(text)
    summary = summary_per_page(text)
    audio_file = text_to_speech(summary)
    result_queue.put((audio_file, image_file))

def render_page_on_webpage(audio_file, image_file):
    """
    This function will render the audio and image on the webpage.
    """
    time.sleep(5)
    return JsonResponse({'audio_file': audio_file, 'image_file': image_file})

def index(request):
    if request.method == "POST":
        form = UploadFileForm(request.POST, request.FILES)

        if form.is_valid():
            file = request.FILES["file"]
            reader = PdfReader(file)
            result_queue = multiprocessing.Queue()
            processes = []
            for page in reader.pages:
                text = page.extract_text()
                process = multiprocessing.Process(target=process_text, args=(text, result_queue))
                process.start()
                processes.append(process)              
                audio_file, image_file = result_queue.get()
                render_page_on_webpage(audio_file, image_file)

            for process in processes:
                process.join()

            return render(request, "summary.html")
    else:
        form = UploadFileForm()
    return render(request, "upload.html", {"form": form})

def text_to_speech(summary):
    """
    This function gets the summary of each page and converts it to speech for each page.
    This will be modified such that as soon as it completes the speech for one page, it will start the speech for the next page.
    """
    pass

def extract_tokens(text):
    """
    This function extracts tokens from the text passed page by page.
    These tokens will be used for web scrapping the image for each page. 
    Extract 1 to 2 tokens per page at max and while generating pass them in the form of a list of 1 token to the scrapper.
    Return back the result of the scrapper.
    """
    token = []
    return scrapper(token)

def scrapper(tokens):
    """
    This function scraps the images for the tokens extracted from the text and downloads them in scrapped.
    """
    pass