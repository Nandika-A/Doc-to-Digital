from django.urls import path
from main import views

urlpatterns = [
    path('', views.upload_file, name="upload_file"),
]