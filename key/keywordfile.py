import requests
import asyncio

from dotenv import dotenv_values

env_vars = dotenv_values(".env")

API_URL = "https://api-inference.huggingface.co/models/ml6team/keyphrase-extraction-kbir-inspec"
headers = {"Authorization": "Bearer " + env_vars["KEYWORD_API_TOKEN"]}

async def keywordfunc(payload):
	response = requests.post(API_URL, headers=headers, json=payload)
	return response.json()