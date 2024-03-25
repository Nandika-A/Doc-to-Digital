from django.shortcuts import render
from .forms import UploadFileForm
from django.http import HttpResponseRedirect
from pypdf import PdfReader
import os
from hack.settings import BASE_DIR
from summarizer.summarizer import query

def summary_per_page(text):   	
    output = query({
        "inputs": text,
    })
    return output

def handle_uploaded_file(f):
    reader = PdfReader(f)
    path = os.path.join(BASE_DIR,'downloads')
    summary_pages = []
    if not os.path.exists(path):
        os.makedirs(path)

    for page in reader.pages:
        text = page.extract_text() 
        summary = summary_per_page(text) #pass this to text to speech
        speech(summary)
        #try to make it real time with websockets.
        #display summary as "notes" of the doc on a page
        summary_pages.append(summary)
        count = 0

        for image_file_object in page.images:
            with open(os.path.join(path, str(count) + image_file_object.name), "wb") as fp:
                fp.write(image_file_object.data)
                count += 1

    return summary_pages

def index(request):
    # if request.method == "POST":
    #     form = UploadFileForm(request.POST, request.FILES)
    #     if form.is_valid():
    #         summary_page = handle_uploaded_file(request.FILES["file"])
    #         return render(request, "summary.html", {"summary": summary_page})
    # else:
    #     form = UploadFileForm()
    # return render(request, "upload.html", {"form": form})
    return render(request, "test.html")

def speech(summary):
    """
    This function gets the summary of each page and converts it to speech for each page.
    This will be modified such that as soon as it completes the speech for one page, it will start the speech for the next page.
    """
    pass