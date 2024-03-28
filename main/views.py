from django.shortcuts import render
from .forms import UploadFileForm
from summarizer.summarizer import query
import os
from hack.settings import BASE_DIR
import asyncio

async def summary_per_page(text):   	
    output = query({
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

async def text_to_speech(summary):
    """
    This function gets the summary of each page and converts it to speech for each page.
    This will be modified such that as soon as it completes the speech for one page, it will start the speech for the next page.
    """
    return "hello"

async def extract_tokens(text):
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
    return "images/bg.jpg"