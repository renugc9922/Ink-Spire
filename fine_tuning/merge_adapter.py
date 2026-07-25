import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel
import os

# Paths
BASE_MODEL = "Qwen/Qwen2.5-0.5B-Instruct"
ADAPTER_PATH = "fine_tuning/outputs/checkpoint-100"
OUTPUT_DIR = "fine_tuning/merged_model"

def merge_model():
    print(f"Loading base model: {BASE_MODEL}...")
    base_model = AutoModelForCausalLM.from_pretrained(
        BASE_MODEL,
        torch_dtype=torch.float16,
        device_map="cpu", # Load on CPU to merge, then save. Avoids VRAM fragmentation.
        trust_remote_code=True
    )
    
    print(f"Loading adapter from {ADAPTER_PATH}...")
    model = PeftModel.from_pretrained(base_model, ADAPTER_PATH)
    
    print("Merging adapter into base model...")
    model = model.merge_and_unload()
    
    print(f"Saving merged model to {OUTPUT_DIR}...")
    model.save_pretrained(OUTPUT_DIR)
    
    print("Saving tokenizer...")
    tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)
    tokenizer.save_pretrained(OUTPUT_DIR)
    
    print("DONE. Merged model is ready for instant inference.")

if __name__ == "__main__":
    merge_model()
