from dotenv import load_dotenv
import requests
import os
load_dotenv() 
API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"
TOKEN = os.getenv("SUMMARIZER_API_TOKEN")
headers = {"Authorization": f"Bearer {TOKEN}"}

def query(payload):
	response = requests.post(API_URL, headers=headers, json=payload)
	return response.json()