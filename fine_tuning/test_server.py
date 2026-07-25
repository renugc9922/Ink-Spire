import requests
import json

url = "http://localhost:5000/generate"
payload = {
    "prompt": "Once upon a time",
    "constraints": {"genre": "Fantasy"}
}

try:
    response = requests.post(url, json=payload)
    print("Status Code:", response.status_code)
    print("Response:", json.dumps(response.json(), indent=2))
except Exception as e:
    print("Error:", e)
