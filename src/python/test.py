# Test

import requests
import random
import string
import json
import math
#import numpy as np
from http.server import BaseHTTPRequestHandler, HTTPServer

PORT = 5000
CLIENT_INPUTS = {}
SESSION_RESULTS = {}
SESSION_DONE = False
N_RESTAURANTS = 2

# Henrik
API_KEY = "key"

class Handler(BaseHTTPRequestHandler):

    def do_GET(self):
        if self.path == '/test':
            self.test()
        elif self.path == '/get_restaurants':
            self.test_get_restaurants()

    def do_POST(self):
        content_len = int(self.headers.get('Content-Length'))
        body = self.rfile.read(content_len)
        #print(body.decode())
        #print(self.headers)
        print("path:", self.path)
        print("body:", body)
        if self.path == '/test':
            self.test_post(body)
        elif self.path == '/get_restaurants':
            # Input data ar ett objekt:
            # {client_id: string, no_of_clients: int, location: string ("latitude,longitude"), likes: array, dislikes: array, price: int}
            self.get_restaurants(body)            

    def test(self):
        print('Test: Det funkar!')
        self.send_response(200)
        self.send_header('Content-Type', 'text/html')
        self.end_headers()

    def test_get_restaurants(self):
        print('Get restaurants: Det funkar!')
        self.send_response(200)
        self.send_header('Content-Type', 'text/html')
        self.end_headers()

    def test_post(self, body):
        # print("Body:", body.decode())
        print("Body:", body)
        print(type(body))
        # data = body.decode('utf-8')
        # print("data:", data)
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

        output = {'restaurants': [{'formatted_address': 'Testgatan 1', 'latitude': 2, 'longitude': 2, 'distance': 700, 'name': 'thaisty', 'place_id': 'idtest123', 'price_level': 3, 'rating': 4.2, 'user_ratings_total': 1000},
            {'formatted_address': 'Testgatan 1', 'latitude': 2, 'longitude': 2, 'distance': 700, 'name': 'shushami', 'place_id': 'idtest123', 'price_level': 3, 'rating': 4.2, 'user_ratings_total': 1000}]}
        output = json.dumps(output)
        print("output:", output)
        self.wfile.write(output.encode('utf-8'))

    # def get_restaurants(self, body):
    #     print("Get_restaurants:")
    #     global CLIENT_INPUTS
    #     data = json.loads(body.decode('utf-8'))        
    #     location = "59.346560691105815,18.073297622001412"
    #     CLIENT_INPUTS[0] = data

    def get_restaurants(self, body):
        global CLIENT_INPUTS, SESSION_DONE
        print("Get_restaurants:")
        data = json.loads(body.decode('utf-8'))
        # print("data:", data)
        # data = json.loads(body)
        print("data:", data)
        # data = body
        # TODO: Nr of clients
        # TODO: Client ID
        client_n = int(data.get("numMembers", 1))
        
        # Generate random string
        letters = string.ascii_lowercase
        client_id = ''.join(random.choice(letters) for i in range(10))
        print(client_id)
        
        location = "59.346560691105815,18.073297622001412"
        CLIENT_INPUTS[client_id] = data
        print("Data length:",len(CLIENT_INPUTS), "client_n:", client_n)
        
        if len(CLIENT_INPUTS) >= client_n:
            # Run the algorithm
            query, max_price = build_query(CLIENT_INPUTS)
            res = text_search(query, location, max_price)
            res = extract_API_info(res, location)
            # Clean the results and save them in SESSION_RESULTS
            print("Output:", res)
            SESSION_RESULTS = res
            SESSION_DONE = True
       
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
            
        if SESSION_DONE:
            self.wfile.write(json.dumps(SESSION_RESULTS).encode('utf-8'))
            CLIENT_INPUTS = {}
            SESSION_RESULTS = {}
            SESSION_DONE = False
        else:
            self.wfile.write(json.dumps({"message": "Data accepted!"}).encode('utf-8'))

# Haversine formula
def get_distance(location, lat1, lng1):
    # Parse location:
    loc_split = location.split(",")
    lat0 = math.radians(float(loc_split[0]))
    lng0 = math.radians(float(loc_split[1]))

    lat1 = math.radians(lat1)
    lng1 = math.radians(lng1)

    R = 6370
    dlng = lng1 - lng0
    dlat = lat1 - lat0

    f = math.sin(dlat / 2)**2 + math.cos(lat0) * math.cos(lat1) * math.sin(dlng / 2)**2
    g = 2 * math.atan2( math.sqrt(f), math.sqrt(1-f) )

    distance = int(round(R * g * 1000))
    return distance

# extract information from API response:
# Will initially return 5 restaurants!
def extract_API_info(response, location):
    global N_RESTAURANTS, API_KEY
    print("Extract API-info")
    # print(response[0])
    # res = response.text
    print(response.text)
    response = response.json()

    # print(data["result"])
    output = {"restaurants" : []}
    print("RESPONSE", response["results"])
    for i in range(N_RESTAURANTS):

        # Extract distance:
        restaurant = response["results"][i]
        lng = float(restaurant["geometry"]["location"]["lng"])
        lat = float(restaurant["geometry"]["location"]["lat"])
        distance = get_distance(location, lat, lng)

        # Photo preparation:
        photo_reference = str(restaurant["photos"][0]["photo_reference"])
        maxwidth = 400
        photo_url = "https://maps.googleapis.com/maps/api/place/photo?maxwidth={}&photo_reference={}&key={}".format(maxwidth, photo_reference, API_KEY)
        # print((str(restaurant["formatted_address"]))
        option = {
            "name" : restaurant["name"],
            "formatted_address" : restaurant["formatted_address"],
            "lat" : str(restaurant["geometry"]["location"]["lat"]),  
            "lng" : str(restaurant["geometry"]["location"]["lng"]),
            "distance": str(distance),
            "price_level" : str(restaurant["price_level"]),
            "rating" : str(restaurant["rating"]),
            "user_ratings_total" : str(restaurant["user_ratings_total"]),
            "place_id" : str(restaurant["place_id"]),
            "photo_reference" : str(restaurant["photos"][0]["photo_reference"]),
            "photo_url" : photo_url
            }
        output["restaurants"].append(option)
    return output
        

# Processess CLIENT_INPUTs into a format for tokenize:
def preprocess(data):
    queries = []
    for key in data.keys():
        user_input = {}
        user_input["user_id"] = key
        for key2 in data[key]:
            # try:
            #     user_input[str(key2)] = int(data[key][key2])
            # except:
            user_input[str(key2)] = str(data[key][key2])
        queries.append(user_input)
    return queries

def tokenize(queries):
    tokenized_queries = []
    # Create mapping:
    likes = {}; dislikes = {}
    # Reverse mapping:
    rev_likes = {}; rev_dislikes = {}

    like_ctr = 0; dislike_ctr = 0
    for count, query in enumerate(queries):
        # print("count:", count, "query:", query)
        tokenized_query = {}
        query_like = query["like"]
        query_dislike = query["dislike"]
        if query_like not in likes.keys():
            likes[query_like] = like_ctr
            rev_likes[like_ctr] = query_like
            like_ctr += 1

        if query_dislike not in dislikes.keys():
            dislikes[query_dislike] = dislike_ctr
            rev_dislikes[dislike_ctr] = query_dislike
            dislike_ctr += 1

        tokenized_query["dislike"] = dislikes[query_dislike]
        tokenized_query["like"] = likes[query_like]
        tokenized_query["price"] = query["price"]

        tokenized_queries.append(tokenized_query)
    mapping = {
        "text_to_num_likes": likes, 
        "text_to_num_dislikes": dislikes,
        "num_to_text_likes": rev_likes, 
        "num_to_text_dislikes": rev_dislikes
        }
    return tokenized_queries, mapping

def count(inputs):
    like_counts = {}
    dislike_counts = {}
    prices = []
    for entry in inputs.values():
        likes = entry.get("like")
        dislikes = entry.get("dislike")
        print("TEST", entry.get("price"))
        prices.append(int(entry.get("price")))

        for like in likes:
            if like not in like_counts.keys():
                like_counts[like] = 0
            like_counts[like] = like_counts[like] + 1
            
        for dislike in dislikes:
            if dislike not in dislike_counts.keys():
                dislike_counts[dislike] = 0
            dislike_counts[dislike] = dislike_counts[dislike] + 1

    #print(like_counts, dislike_counts)
    return like_counts, dislike_counts, prices

# User input:
def build_query(inputs):
    #processed_inputs = preprocess(inputs)
    #queries, mapping = tokenize(processed_inputs)
    #print("Tokenized_queries\n", queries)

    # 1) Food interested in
    # 3) Not interested in

    #for user_input in inputs.values():
    #    queries.append(user_input)

    query = ""

    TEST = True 
    if TEST:
        query_terms = []
        likes, dislikes, prices = count(inputs)

        for food in likes.keys():
            sum = max(likes.get(food, 0) - dislikes.get(food, 0), 0)
            for i in range(sum):
                query_terms.append(food)

        query = '%20'.join(query_terms)
        max_price = max(prices)

    return query, max_price

def text_search(query, location, maxprice, minprice=0, radius=1000):
    print("Text search:")
    url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query={}&location={}&radius={}&minprice={}&maxprice={}&opennow=true&type=restaurant&key={}".format(
        query, 
        location,
        radius,
        minprice,
        maxprice, 
        API_KEY)

    payload={}
    headers = {}

    response = requests.request("GET", url, headers=headers, data=payload)
    # print("Response:", response.text)
    return response

def main():
    server = HTTPServer(('', PORT), Handler)
    print('Server running on port', PORT)
    server.serve_forever()

def old_main():
    # Dummy inputs:
    inputs = [{"like":"sushi","dislike":"pizza","price":"2"},
    {"like":"kebab","dislike":"sushi","price":"3"},
    {"like":"sushi","dislike":"indian","price":"3"},
    {"like":"pizza","dislike":"sushi","price":"1"},
    {"like":"kebab","dislike":"pasta","price":"3"}
    ]

    location = "59.346560691105815,18.073297622001412"
    query, max_price = build_query(inputs)
    res = text_search(query, location, max_price)

    # Get photo
    url = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference={}&key={}".format()

    # Clean up results 
    step1 = []

    for field in step1:
        res.pop(field)
    
    print(res)

    
if __name__ == "__main__":
    main()
