from django.shortcuts import render
import main.scrapping_images as si
import requests
import os
# Create your views here.

def index(request):
    query_list = ["cat"]
    image_result = si.search(query_list)
    img_url = image_result[0]
    response = requests.get(img_url)
    path = os.path.join(BASE_DIR, 'scraped_images')
    filename = img_url.split("/")[-1]
    fp = open(os.path.join(path, filename), 'wb')
    fp.write(response.content)
    fp.close()
    return render(request, 'index.html')