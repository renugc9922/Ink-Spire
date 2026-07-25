from huggingface_hub import snapshot_download
import sys
import time

repo_id = "Qwen/Qwen2.5-1.5B-Instruct"

print(f"Starting download for {repo_id}...", flush=True)

try:
    path = snapshot_download(
        repo_id=repo_id, 
        ignore_patterns=["*.msgpack", "*.h5", "*.ot"],
        resume_download=True
    )
    print(f"SUCCESS: Model downloaded to {path}", flush=True)
except Exception as e:
    print(f"ERROR: Download failed - {e}", flush=True)
    sys.exit(1)
