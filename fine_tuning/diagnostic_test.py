import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
import time

MODEL_PATH = "./fine_tuning/merged_model"

print(f"Testing Model Load from: {MODEL_PATH}")

try:
    start = time.time()
    tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_PATH, 
        device_map="cuda", 
        torch_dtype=torch.float16
    )
    print(f"Model Loaded in {time.time() - start:.2f}s")
    
    input_text = "Once upon a time"
    inputs = tokenizer(input_text, return_tensors="pt").to("cuda")
    
    print("Generating...")
    outputs = model.generate(**inputs, max_new_tokens=20)
    print(tokenizer.decode(outputs[0]))
    print("SUCCESS: Local LLM is working.")
    
except Exception as e:
    print(f"FAILURE: {e}")
