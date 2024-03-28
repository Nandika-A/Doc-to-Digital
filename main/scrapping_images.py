from serpapi import GoogleSearch
import os, json

def search(query_list):
    image_results = []

    for query in query_list:
        params = {
            "engine": "google",               # search engine. Google, Bing, Yahoo, Naver, Baidu...
            "q": query,                       # search query
            "tbm": "isch",                    # image results
            "num": "1",                     # number of images per page
            "ijn": 0,                         # page number: 0 -> first page, 1 -> second...
            "api_key": os.getenv('SERPAPI_KEY')   # serpapi api key
        }

        search = GoogleSearch(params)         # where data extraction happens

        images_is_present = True
        while images_is_present:
            results = search.get_dict()       # JSON -> Python dictionary

            # checks for "Google hasn't returned any results for this query."
            if "error" not in results:
                for image in results["images_results"]:
                    if image["original"] not in image_results:
                        print(image["original"])
                        image_results.append(image["original"])
                
                # update to the next page
                params["ijn"] += 1
            else:
                images_is_present = False
                print(results["error"])

    return image_results