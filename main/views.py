from django.shortcuts import render
from .forms import UploadFileForm
from django.http import HttpResponseRedirect

def handle_uploaded_file(f):
        for chunk in f.chunks():
            print(chunk)


def index(request):
    if request.method == "POST":
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            handle_uploaded_file(request.FILES["file"])
            return HttpResponseRedirect(".")
    else:
        form = UploadFileForm()
    return render(request, "upload.html", {"form": form})