from channels.generic.websocket import WebsocketConsumer
from pypdf import PdfReader
from .views import extract_tokens, summary_per_page, text_to_speech
import json

class Consumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        file = text_data_json['file']
        reader = PdfReader(file)
        for page in reader.pages:
            text = page.extract_text()
            image_file = extract_tokens(text)
            summary = summary_per_page(text)
            audio_file = text_to_speech(summary)
            self.send(text_data=json.dumps({
                "image": image_file,
                "summary": summary,
                "audio": audio_file,
            }))