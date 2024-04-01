from django.urls import path

from . import consumers
from llm_character.consumers import Consumer_llm

ws_urlpatterns = [
    path("ws/summary/", consumers.Consumer.as_asgi()),
    path("ws/pirate/", Consumer_llm.as_asgi()),
]