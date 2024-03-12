from django.shortcuts import render
import main.scrapping_images as si
# Create your views here.

def index(request):
    query_list = ["cat", "dog", "bird"]
    si.search(query_list)
    return render(request, 'index.html')