import requests

from dotenv import dotenv_values

env_vars = dotenv_values(".env")

API_URL = "https://api-inference.huggingface.co/models/ml6team/keyphrase-extraction-kbir-inspec"
headers = {"Authorization": "Bearer " + env_vars["KEYWORD_API_TOKEN"]}

def query(payload):
	response = requests.post(API_URL, headers=headers, json=payload)
	return response.json()
	
output = query({
	"inputs": "Keyphrase extraction is a technique in text analysis where you extract the important keyphrases from a document.  Thanks to these keyphrases humans can understand the content of a text very quickly and easily without reading  it completely. Keyphrase extraction was first done primarily by human annotators, who read the text in detail  and then wrote down the most important keyphrases. The disadvantage is that if you work with a lot of documents,  this process can take a lot of time. Here is where Artificial Intelligence comes in. Currently, classical machine learning methods, that use statistical  and linguistic features, are widely used for the extraction process. Now with deep learning, it is possible to capture  the semantic meaning of a text even better than these classical methods. Classical methods look at the frequency,  occurrence and order of words in the text, whereas these neural approaches can capture long-term semantic dependencies  and context of words in a text.",
})

sorted_array = sorted(output, key=lambda x: x['score'], reverse=True)

for item in sorted_array:
    print(item['word'], item['score'])