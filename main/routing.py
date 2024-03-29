from django.urls import path

from . import consumers

ws_urlpatterns = [
    path("ws/summary/", consumers.Consumer.as_asgi())
]