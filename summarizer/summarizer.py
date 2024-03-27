import requests

API_URL = "https://api-inference.huggingface.co/models/google/bigbird-pegasus-large-arxiv"
headers = {"Authorization": "Bearer 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"}

def query(payload):
	response = requests.post(API_URL, headers=headers, json=payload)
	return response.json()