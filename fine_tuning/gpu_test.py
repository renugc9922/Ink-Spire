import torch
import bitsandbytes as bnb
from transformers import AutoModelForCausalLM, BitsAndBytesConfig

print(f"Testing CUDA basic operations...", flush=True)
try:
    x = torch.randn(10, 10).cuda()
    y = torch.randn(10, 10).cuda()
    z = torch.matmul(x, y)
    print("Basic Matmul: SUCCESS", flush=True)
    print(f"Result shape: {z.shape}", flush=True)
except Exception as e:
    print(f"Basic Matmul: FAILED - {e}", flush=True)

print(f"\nTesting 4-bit loading with bitsandbytes...", flush=True)
try:
    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.float16,
    )
    # We use a very small model or just check bnb functionality if possible, 
    # but loading the actual model is the best test.
    # We'll try loading the Qwen tokenizer/config first, but actual 4-bit needs model.
    model_id = "Qwen/Qwen2.5-0.5B-Instruct"
    print(f"Loading {model_id} in 4-bit...", flush=True)
    model = AutoModelForCausalLM.from_pretrained(
        model_id,
        quantization_config=bnb_config,
        device_map="auto",
        trust_remote_code=True
    )
    print("4-bit Load: SUCCESS", flush=True)
except Exception as e:
    print(f"4-bit Load: FAILED - {e}", flush=True)
