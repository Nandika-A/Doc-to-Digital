from channels.generic.websocket import AsyncWebsocketConsumer
from .views import get_llm_output
import json
import asyncio

class Consumer_llm(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def process_query(self, text):
        get_llm_task = asyncio.create_task(get_llm_output(text))
        #audio_task = asyncio.create_task(text_to_speech(text))
        #lip_sync_task = asyncio.create_task(get_lip_sync(text))
        output,audio_path,lip_sync_path = await asyncio.gather(get_llm_task)#, lip_sync_task, audio_task)
        await self.send_message(output, audio_path, lip_sync_path)

    async def receive(self, text_data):
        #text_data_json = json.loads(text_data)
        asyncio.create_task(self.process_query(text_data))
        
        await asyncio.sleep(3) #wait for audio.length + 1 seconds

    async def send_message(self, output, audio_path,lip_sync_path):
        # Send the message over WebSocket
        await self.send(text_data=json.dumps({
            "output": output,
            "audio_path": audio_path,
            "lip_sync_path": lip_sync_path
        }))