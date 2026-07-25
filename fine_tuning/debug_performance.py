import time
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

model_name = "fine_tuning/merged_model"
device = "cuda" if torch.cuda.is_available() else "cpu"

print(f"Device: {device}")

start_load = time.time()
try:
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        torch_dtype=torch.float16,
        device_map=None,
        trust_remote_code=True
    ).to(device)
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    print(f"Model loaded in {time.time() - start_load:.2f}s")
except Exception as e:
    print(f"Error loading model: {e}")
    exit(1)

# Test prompts
prompts = [
    "It is Rahul's first day at office.",
    "The dragon flew over the castle.",
]

for prompt_text in prompts:
    print(f"\nPrompt: {prompt_text}")
    
    # Simple formatting test
    messages = [
        {"role": "system", "content": "You are a creative writer. Continue the story naturally. Do NOT use script format. Write 3 sentences."},
        {"role": "user", "content": prompt_text}
    ]
    
    input_text = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    inputs = tokenizer([input_text], return_tensors="pt").to(device)
    
    start_gen = time.time()
    with torch.no_grad():
        outputs = model.generate(
            **inputs, 
            max_new_tokens=100, 
            do_sample=True, 
            temperature=0.7,
            use_cache=True,
            pad_token_id=tokenizer.eos_token_id
        )
    end_gen = time.time()
    
    generated_text = tokenizer.decode(outputs[0][len(inputs.input_ids[0]):], skip_special_tokens=True)
    print(f"Time: {end_gen - start_gen:.4f}s")
    print(f"Output: {generated_text}")
