import requests
import time
import json

API_URL = "http://localhost:5000/generate"

def test_inference(prompt, constraints=None):
    print(f"\n--- Testing: {prompt[:50]}... ---")
    payload = {
        "prompt": prompt,
        "constraints": constraints or {}
    }
    
    start_time = time.time()
    try:
        response = requests.post(API_URL, json=payload)
        end_time = time.time()
        
        if response.status_code == 200:
            data = response.json()
            text = data.get("text", "")
            duration = end_time - start_time
            print(f"[OK] Success!")
            print(f"Latency: {duration:.4f} seconds")
            print(f"Output: {text[:200]}...")  # Preview
            return True
        else:
            print(f"[FAIL] Error: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"[FAIL] Connection Failed: {e}")
        return False

if __name__ == "__main__":
    print("Running Inference Speed Test on Local Server...")
    
    # Warm-up
    test_inference("Hello, are you ready?", {})
    
    # Correct constraints for our 0.5B model
    test_inference(
        "A robot discovers a flower in a scrapyard.",
        {"genre": "Sci-Fi", "tone": "Emotional", "style": "Descriptive"}
    )
    
    test_inference(
        "The detective walked into the rainy alley.",
        {"genre": "Noir", "tone": "Dark", "style": "Gritty"}
    )
