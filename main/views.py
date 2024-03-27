from django.shortcuts import render
from .forms import UploadFileForm
from pypdf import PdfReader
from summarizer.summarizer import query

def summary_per_page(text):   	
    output = query({
        "inputs": text,
    })
    return output

def index(request):
    if request.method == "POST":
        form = UploadFileForm(request.POST, request.FILES)

        if form.is_valid():
            file = request.FILES["file"]
            reader = PdfReader(file)
            for page in reader.pages:
                text = page.extract_text()
                image_file = extract_tokens(text)
                summary = summary_per_page(text)
                audio_file = text_to_speech(summary)

            return render(request, "summary.html")
    else:
        form = UploadFileForm()
    return render(request, "upload.html", {"form": form})

def text_to_speech(summary):
    """
    This function gets the summary of each page and converts it to speech for each page.
    This will be modified such that as soon as it completes the speech for one page, it will start the speech for the next page.
    """
    return summary

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
    return "hi"