from django.shortcuts import render
from .forms import UploadFileForm
from django.http import HttpResponseRedirect
from pypdf import PdfReader

def handle_uploaded_file(f):
        reader = PdfReader(f)
        page = reader.pages[0]
        text = page.extract_text() 
        print(text) 

def upload_file(request):
    if request.method == "POST":
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            handle_uploaded_file(request.FILES["file"])
            return HttpResponseRedirect(".")
    else:
        form = UploadFileForm()
    return render(request, "upload.html", {"form": form})