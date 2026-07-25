print("Start", flush=True)
import torch
print("Imported Torch", flush=True)
print(f"CUDA Available: {torch.cuda.is_available()}", flush=True)
if torch.cuda.is_available():
    print(f"Device: {torch.cuda.get_device_name(0)}", flush=True)
