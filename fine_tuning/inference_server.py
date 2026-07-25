print("Importing Torch...", flush=True)
import torch
print("Importing Flask...", flush=True)
from flask import Flask, request, jsonify
print("Importing Transformers...", flush=True)
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
print("Importing Peft...", flush=True)
from peft import PeftModel
print("Importing OS...", flush=True)
import os

app = Flask(__name__)

# SWITCHING TO 0.5B TURBO MODEL FOR INSTANT SPEED
BASE_MODEL = "fine_tuning/merged_model" 
# ADAPTER_PATH = "fine_tuning/outputs/checkpoint-100" # DISABLED (Merged)
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

print(f"Initializing Inference Server on {DEVICE}...", flush=True)

# Global model/tokenizer
tokenizer = None
model = None

def load_model():
    global model, tokenizer
    print(f"Loading base model: {BASE_MODEL}...", flush=True)
    
    # 0.5B is tiny, we don't even need 4-bit, but we can keep it for absolute minimal VRAM.
    # Let's run it in FP16 for max speed since it fits easily.
    
    try:
        model = AutoModelForCausalLM.from_pretrained(
            BASE_MODEL,
            # quantization_config=bnb_config,
            torch_dtype=torch.float16,
            # Force single GPU for 0.5B model to avoid CPU offload overhead
            device_map=None, 
            trust_remote_code=True,
            local_files_only=False
        ).to(DEVICE) # Explicitly move to CUDA
        tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)
    except Exception as e:
        print(f"FATAL: Error loading base model: {e}")
        return False

    # Check for adapter (though for now likely using base model)
    # Check for adapter (though for now likely using base model)
    # Adapter is now MERGED into base model, so we don't need this block.
    print("Using Merged Fine-Tuned Model (Optimized).")
    return True

    # if os.path.exists(ADAPTER_PATH) and os.path.exists(os.path.join(ADAPTER_PATH, "adapter_config.json")):
    #    try:
    #        print("Loading LoRA adapter...")
    #        model = PeftModel.from_pretrained(model, ADAPTER_PATH)
    #        print("Adapter loaded successfully.")
    #    except Exception as e:
    #        print(f"Error loading adapter: {e}. Serving base model.")
    # else:
    #    print("Using Base Model (Optimized).")
        
    # return True

# Load on startup
if not load_model():
    print("Failed to load model.")
    exit(1)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ready", "model": BASE_MODEL})

@app.route('/generate', methods=['POST'])
def generate():
    import json
    print(f"--- NEW REQUEST ---")
    print(f"Headers: {request.headers}")
    
    raw_data = request.data
    print(f"Raw Data: {raw_data}")
    
    try:
        # Decode bytes to string, then parse manually
        if raw_data:
            data = json.loads(raw_data.decode('utf-8'))
        else:
            # Fallback for form data / standard json
            data = request.get_json(force=True, silent=True)
            
        if data is None:
            raise ValueError("No data found")
            
    except Exception as e:
        print(f"Failed to decode JSON: {e}")
        return jsonify({"error": f"Invalid JSON data: {e}"}), 400
        
    prompt_text = data.get('prompt', '')
    prompt_text = data.get('prompt', '')
    
    # Optional constraints from request
    constraints = data.get('constraints', {})
    genre = constraints.get('genre', 'Fantasy')
    tone = constraints.get('tone', 'Adventure')
    style = constraints.get('style', 'Descriptive')
    pov = constraints.get('pov', 'Third Person')
    
    print(f"Generating for prompt: {prompt_text[:50]}...")

    # USE CHAT TEMPLATE - Fixes "s=tone" artifacts
    messages = [
        {"role": "system", "content": f"You are a creative novelist. Write in standard narrative prose. Do NOT use script format (e.g. 'Scene:', 'Character:'). Write {genre} style in {tone} tone. Return only the story text."},
        {"role": "user", "content": prompt_text}
    ]
    
    try:
        # Apply strict chat template
        text = tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True
        )
        
        inputs = tokenizer([text], return_tensors="pt").to(model.device)
        
        with torch.no_grad():
            outputs = model.generate(
                **inputs, 
                max_new_tokens=256, 
                temperature=0.7, 
                do_sample=True,
                top_p=0.9,
                use_cache=True,
                pad_token_id=tokenizer.eos_token_id
            )
        
        # Decode only the new tokens
        generated_ids = [
            output_ids[len(input_ids):] for input_ids, output_ids in zip(inputs.input_ids, outputs)
        ]
        response_part = tokenizer.batch_decode(generated_ids, skip_special_tokens=True)[0]

        return jsonify({"text": response_part, "full_generation": response_part})
        
    except Exception as e:
        print(f"Generation Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
