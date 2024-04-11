from channels.generic.websocket import AsyncWebsocketConsumer
from .views import get_llm_output
import json
import asyncio
import concurrent.futures

class Consumer_llm(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def process_query(self, text):
        loop = asyncio.get_event_loop()
        get_llm_task = loop.run_in_executor(concurrent.futures.ThreadPoolExecutor(), get_llm_output, text)
        output, audio_path, lip_sync_path,animation_no = await get_llm_task
        print("ans here",output, audio_path, lip_sync_path,animation_no)#, lip_sync_task, audio_task)
        await self.send_message(output, audio_path, lip_sync_path,animation_no)

    async def receive(self, text_data):
        #text_data_json = json.loads(text_data)
        asyncio.create_task(self.process_query(text_data))
        
        await asyncio.sleep(3) #wait for audio.length + 1 seconds

    async def send_message(self, output, audio_path,lip_sync_path,animation_no):
        # Send the message over WebSocket
        await self.send(text_data=json.dumps({
            "output": output,
            "audio_path": audio_path,
            "lip_sync_path": lip_sync_path,
            "animation_no": animation_no,
        }))