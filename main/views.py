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
    print(output)

def handle_uploaded_file(f):
    reader = PdfReader(f)
    path = os.path.join(BASE_DIR,'downloads')

    if not os.path.exists(path):
        os.makedirs(path)

    for page in reader.pages:
        text = page.extract_text() 
        summary_per_page(text)
        count = 0

        for image_file_object in page.images:
            with open(os.path.join(path, str(count) + image_file_object.name), "wb") as fp:
                fp.write(image_file_object.data)
                count += 1

def index(request):
    if request.method == "POST":
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            handle_uploaded_file(request.FILES["file"])
            return HttpResponseRedirect(".")
    else:
        form = UploadFileForm()
    return render(request, "upload.html", {"form": form})