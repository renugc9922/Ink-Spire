import torch
import transformers
import peft
import accelerate

print(f"Torch Version: {torch.__version__}")
print(f"CUDA Available: {torch.cuda.is_available()}")
if torch.cuda.is_available():
    print(f"CUDA Device: {torch.cuda.get_device_name(0)}")
    print(f"CUDA Version: {torch.version.cuda}")

print(f"Transformers Version: {transformers.__version__}")
print(f"Peft Version: {peft.__version__}")
print(f"Accelerate Version: {accelerate.__version__}")

try:
    import bitsandbytes
    print(f"BitsAndBytes Version: {bitsandbytes.__version__}")
except ImportError:
    print("BitsAndBytes not installed")
except Exception as e:
    print(f"BitsAndBytes error: {e}")
