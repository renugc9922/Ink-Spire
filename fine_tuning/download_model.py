from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import sys

MODEL_NAME = "Qwen/Qwen2.5-1.5B-Instruct"

print(f"Downloading {MODEL_NAME}...", flush=True)

try:
    print("Downloading Tokenizer...", flush=True)
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, trust_remote_code=True)
    tokenizer.save_pretrained("./fine_tuning/model_cache")
    
    print("Downloading Model (this may take time)...", flush=True)
    # We download to cache but also load to verify
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_NAME, 
        trust_remote_code=True,
        torch_dtype=torch.float16
    )
    # save to local dir to be 100% sure? No, cache is fine if we can load it.
    
    print("Download Complete!", flush=True)
except Exception as e:
    print(f"Error: {e}", flush=True)
    sys.exit(1)
