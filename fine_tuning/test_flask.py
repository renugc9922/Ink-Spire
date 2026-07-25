import requests

try:
    response = requests.post(
        'http://localhost:5000/generate',
        json={'prompt': 'test', 'constraints': {}},
        headers={'Content-Type': 'application/json'}
    )
    print("Status:", response.status_code)
    print("Response:", response.text)
except Exception as e:
    print("Error:", e)
