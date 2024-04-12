from channels.generic.websocket import AsyncWebsocketConsumer
from pypdf import PdfReader
from .views import extract_tokens, summary_per_page, text_to_speech
import json
import asyncio
from mutagen.mp3 import MP3

class Consumer(AsyncWebsocketConsumer):
    length = 3
    async def connect(self):
        await self.accept()

    async def process_page(self, text):
        summary_task = asyncio.create_task(summary_per_page(text))
        image_task = asyncio.create_task(extract_tokens(text)) #multiple images
        audio_task = asyncio.create_task(text_to_speech(text))
        summary, image, audio = await asyncio.gather(summary_task, image_task, audio_task)
        self.length = MP3(audio).info.length
        await self.send_message(summary, image, audio)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        file = text_data_json['file']
        reader = PdfReader(file)
        for page in reader.pages:
            text = page.extract_text()
            asyncio.create_task(self.process_page(text))
            await asyncio.sleep(self.length) #wait for audio.length + 1 seconds

    async def send_message(self, summary, image, audio):
        # Send the message over WebSocket
        await self.send(text_data=json.dumps({
            "summary": summary,
            "image": image,
            "audio": audio
        }))