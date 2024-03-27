from channels.generic.websocket import AsyncWebsocketConsumer
from pypdf import PdfReader
from .views import extract_tokens, summary_per_page, text_to_speech
import json
import asyncio

class Consumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        file = text_data_json['file']
        reader = PdfReader(file)
        for page in reader.pages:
            text = page.extract_text()
            image_file = await extract_tokens(text)
            summary = await summary_per_page(text)
            audio_file = await text_to_speech(summary)
            print(image_file, summary, audio_file)
            await self.send(text_data=json.dumps({
                "image": image_file,
                "summary": summary,
                "audio": audio_file,
            }))