from dotenv import load_dotenv
import requests
import os
import asyncio
load_dotenv() 
API_URL = "https://api-inference.huggingface.co/models/google/pegasus-xsum"
TOKEN = os.getenv("SUMMARIZER_API_TOKEN")
headers = {"Authorization": f"Bearer {TOKEN}"}

async def query(payload):
	response = requests.post(API_URL, headers=headers, json=payload)
	return response.json()