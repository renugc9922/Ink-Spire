import os
import torch
from datasets import load_dataset
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    TrainingArguments,
    Trainer,
    DataCollatorForLanguageModeling
)
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training, TaskType

# Configuration
MODEL_ID = "Qwen/Qwen2.5-0.5B-Instruct"
# Paths assuming script is run from project root
TRAIN_FILE = "fine_tuning/train_data.jsonl"
VALID_FILE = "fine_tuning/valid_data.jsonl"
OUTPUT_DIR = "fine_tuning/outputs"
MAX_LENGTH = 1024

def main():
    print("Loading tokenizer...")
    try:
        tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
        tokenizer.pad_token = tokenizer.eos_token 
    except Exception as e:
        print(f"Error loading tokenizer: {e}")
        return

    print("Loading dataset...")
    try:
        dataset = load_dataset("json", data_files={"train": TRAIN_FILE, "validation": VALID_FILE})
    except Exception as e:
        print(f"Error loading dataset. Ensure {TRAIN_FILE} and {VALID_FILE} exist. Error: {e}")
        return
    
    def tokenize_function(examples):
        return tokenizer(examples["text"], truncation=True, max_length=MAX_LENGTH, padding=False)

    print("Tokenizing dataset...")
    # Use batches to speed up
    tokenized_datasets = dataset.map(tokenize_function, batched=True, remove_columns=["text"])

    print("Loading Model (FP16)...")
    
    try:
        model = AutoModelForCausalLM.from_pretrained(
            MODEL_ID,
            torch_dtype=torch.float16,
            device_map="auto",
            trust_remote_code=True
        )
    except Exception as e:
        print(f"Error loading model: {e}")
        return

    # Prepare for LoRA
    model.gradient_checkpointing_enable() # ENABLED TO SAVE MEMORY
    model = prepare_model_for_kbit_training(model) 

    peft_config = LoraConfig(
        r=16,
        lora_alpha=32,
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
        lora_dropout=0.05,
        bias="none",
        task_type="CAUSAL_LM"
    )

    model = get_peft_model(model, peft_config)
    print("Trainable parameters:")
    model.print_trainable_parameters()

    training_args = TrainingArguments(
        output_dir=OUTPUT_DIR,
        per_device_train_batch_size=1, # REDUCED TO 1 TO FIX OOM
        gradient_accumulation_steps=16, # Increased to maintain effective batch
        learning_rate=1e-4,
        logging_steps=10,
        # num_train_epochs=3,
        max_steps=500, # Quick fine-tune
        save_strategy="steps",
        save_steps=100,
        eval_strategy="no", 
        fp16=True, 
        optim="paged_adamw_8bit",
        push_to_hub=False,
        report_to="none", 
        group_by_length=True,
        ddp_find_unused_parameters=False,
    )

    trainer = Trainer(
        model=model,
        train_dataset=tokenized_datasets["train"],
        # eval_dataset=tokenized_datasets["validation"],
        args=training_args,
        data_collator=DataCollatorForLanguageModeling(tokenizer, mlm=False),
    )

    print("Starting training...")
    trainer.train()

    print("Saving model...")
    trainer.save_model(OUTPUT_DIR)
    print("Training complete and model saved.")
    
if __name__ == "__main__":
    main()
