print("Starting import...", flush=True)
import torch
print("Imported torch.", flush=True)
print(f"CUDA available: {torch.cuda.is_available()}", flush=True)
