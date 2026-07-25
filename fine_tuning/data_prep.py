import os
import random
import json
from collections import Counter
from transformers import AutoTokenizer
from tqdm import tqdm

# Configuration
SOURCE_FILE = r'D:\Aditya Jajodia\Internships\2025\Infosys\Milestone 4\Dataset\writingPrompts\train.wp_source'
TARGET_FILE = r'D:\Aditya Jajodia\Internships\2025\Infosys\Milestone 4\Dataset\writingPrompts\train.wp_target'
OUTPUT_TRAIN = 'train_data.jsonl'
OUTPUT_VALID = 'valid_data.jsonl'
MODEL_ID = "Qwen/Qwen2.5-3B-Instruct"
MAX_TOKENS = 1024
SAMPLE_SIZE = 25000
OTHERS_CAP = 0.40  # 40%

# Heuristics Data
GENRES = {
    'Fantasy': ['magic', 'dragon', 'wizard', 'witch', 'spell', 'kingdom', 'elf', 'orc', 'curse', 'realm'],
    'Sci-Fi': ['space', 'alien', 'robot', 'ship', 'planet', 'future', 'time travel', 'clone', 'cyber', 'tech', 'galaxy'],
    'Horror': ['ghost', 'blood', 'kill', 'dark', 'demon', 'haunted', 'scary', 'monster', 'fear', 'death', 'scream'],
    'Mystery': ['detective', 'murder', 'crime', 'secret', 'investigation', 'clue', 'police', 'suspect', 'mystery'],
    'Superhero': ['hero', 'villain', 'power', 'super', 'save', 'fly', 'strength', 'mask', 'cape', 'ability'],
    'Historical': ['war', 'king', 'queen', 'history', 'ancient', 'empire', 'Rome', 'knight', 'castle', 'century'],
    'Romance': ['love', 'kiss', 'date', 'marry', 'relationship', 'heart', 'wedding', 'crush'],
}

TONES = {
    'Dark': ['death', 'grim', 'kill', 'blood', 'die', 'murder', 'sorrow', 'pain'],
    'Humorous': ['funny', 'laugh', 'joke', 'comedy', 'prank', 'silly', 'hilarious', 'smile'],
    'Suspenseful': ['wait', 'tense', 'nervous', 'sudden', 'shadow', 'lurking', 'anticipation'],
    'Emotional': ['cry', 'tears', 'sad', 'happy', 'feel', 'emotion', 'loss', 'joy', 'heartbreak'],
}

STYLES = {
    'Descriptive': ['color', 'light', 'sound', 'smell', 'look', 'beautiful', 'scenic', 'vivid'],
    'Dialogue-heavy': ['said', 'asked', 'replied', 'told', 'speak', 'conversation'],
    'Fast-paced': ['run', 'quick', 'fast', 'sprint', 'chase', 'rush', 'speed'],
}

POVS = {
    'First Person': [' I ', ' my ', ' me ', ' we ', ' our ', ' us '],
    'Third Person': [' he ', ' she ', ' they ', ' it ', ' his ', ' her '],
}

def get_keywords(text, mapping):
    text_lower = text.lower()
    for category, keywords in mapping.items():
        for k in keywords:
            if k in text_lower:
                return category
    return None

def main():
    print(f"Loading tokenizer: {MODEL_ID}")
    try:
        tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
    except Exception as e:
        print(f"Error loading tokenizer: {e}")
        return

    # Read files
    print("Reading files...")
    if not os.path.exists(SOURCE_FILE) or not os.path.exists(TARGET_FILE):
        print("Error: Source or Target file not found.")
        return

    with open(SOURCE_FILE, 'r', encoding='utf-8') as f:
        sources = f.readlines()
    with open(TARGET_FILE, 'r', encoding='utf-8') as f:
        targets = f.readlines()
        
    if len(sources) != len(targets):
        print(f"Warning: Source lines ({len(sources)}) != Target lines ({len(targets)})")
        min_len = min(len(sources), len(targets))
        sources = sources[:min_len]
        targets = targets[:min_len]
    
    total_lines = len(sources)
    print(f"Total lines available: {total_lines}")
    
    indices = list(range(total_lines))
    random.shuffle(indices)
    
    processed_samples = []
    others_count = 0
    total_others_limit = int(SAMPLE_SIZE * OTHERS_CAP)
    
    stats = {
        'Genre': Counter(),
        'Tone': Counter(),
        'Style': Counter(),
        'POV': Counter(),
        'Others': 0
    }
    
    lengths = []
    
    print(f"Processing samples until {SAMPLE_SIZE} accepted...")
    
    pbar = tqdm(total=SAMPLE_SIZE)
    
    for idx in indices:
        if len(processed_samples) >= SAMPLE_SIZE:
            break
            
        source = sources[idx].strip()
        target = targets[idx].strip()
        
        # Simple Length Filter (Char count heuristic first to save compute)
        if len(source) + len(target) > 6000: 
            continue
            
        tokenized_len = len(tokenizer.encode(source + target))
        if tokenized_len > MAX_TOKENS:
            continue
            
        lengths.append(tokenized_len)
        
        # Heuristics
        genre = get_keywords(source, GENRES)
        tone = get_keywords(source, TONES)
        style = get_keywords(source, STYLES)
        
        # POV Logic
        pov = "Third Person" # Default
        if "You are" in source or "you are" in source:
             # Randomly assign 1st or 2nd if prompted with "You are"
             pov = random.choice(["First Person", "Second Person"])
        
        # "Others" Logic
        is_others = False
        if not genre:
            if others_count < total_others_limit:
                genre = "Others"
                others_count += 1
                is_others = True
            else:
                genre = random.choice(list(GENRES.keys())) # Force valid tag
        
        if not tone: tone = random.choice(list(TONES.keys()))
        if not style: style = random.choice(list(STYLES.keys()))
        
        stats['Genre'][genre] += 1
        stats['Tone'][tone] += 1
        stats['Style'][style] += 1
        stats['POV'][pov] += 1
        if is_others: stats['Others'] += 1

        # Format
        instruction = f"Write a story based on this premise: {source}\nConstraints: Genre: {genre}, Tone: {tone}, Style: {style}, POV: {pov}"
        json_sample = {
            "text": f"### Instruction: {instruction} ### Response: {target}"
        }
        processed_samples.append(json_sample)
        pbar.update(1)
        
    pbar.close()
    
    # Logging
    print("\n--- Statistics ---")
    if len(processed_samples) > 0:
        print(f"Total Samples: {len(processed_samples)}")
        print(f"Others Count: {stats['Others']} ({stats['Others']/len(processed_samples)*100:.2f}%)")
        print("Genre Dist:", dict(stats['Genre']))
        print("Tone Dist:", dict(stats['Tone']))
        print("Style Dist:", dict(stats['Style']))
        print("POV Dist:", dict(stats['POV']))
        print(f"Avg Length: {sum(lengths)/len(lengths):.2f}")
        print(f"Max Length: {max(lengths)}")
    else:
        print("No samples generated!")

    # Save
    if len(processed_samples) > 0:
        split_idx = int(len(processed_samples) * 0.9) 
        train_data = processed_samples[:split_idx]
        valid_data = processed_samples[split_idx:]
        
        with open(OUTPUT_TRAIN, 'w', encoding='utf-8') as f:
            for s in train_data:
                f.write(json.dumps(s) + '\n')
                
        with open(OUTPUT_VALID, 'w', encoding='utf-8') as f:
            for s in valid_data:
                f.write(json.dumps(s) + '\n')
                
        print(f"Saved {len(train_data)} to {OUTPUT_TRAIN}")
        print(f"Saved {len(valid_data)} to {OUTPUT_VALID}")

if __name__ == "__main__":
    main()
