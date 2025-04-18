import json
import os
from typing import Dict, List
import time
from datetime import datetime
import argparse
import sys
import io
from openai import OpenAI
from dotenv import load_dotenv
from config import (
    MODEL,
    TEMPERATURE,
    MAX_TOKENS,
    RATE_LIMIT_DELAY,
    QUESTIONS_FILE,
    LANGUAGES_FILE,
    TRANSLATIONS_FILE,
    TEMP_OUTPUT_FILE
)

# Load environment variables
load_dotenv()

# Configure OpenAI API
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
if not client.api_key:
    raise ValueError("OPENAI_API_KEY not found in environment variables")

# Set stdout to handle UTF-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def load_json_file(file_path: str) -> Dict:
    """Load a JSON file and return its contents."""
    try:
        print(f"Loading file: {file_path}")
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            print(f"Successfully loaded {file_path}")
            return data
    except FileNotFoundError:
        print(f"File {file_path} not found, creating new empty structure")
        return {}
    except Exception as e:
        print(f"Error loading {file_path}: {str(e)}")
        raise

def save_json_file(file_path: str, data: Dict):
    """Save data to a JSON file."""
    try:
        print(f"Saving to file: {file_path}")
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            print(f"Successfully saved to {file_path}")
    except Exception as e:
        print(f"Error saving to {file_path}: {str(e)}")
        raise

def translate_text(text: str, source_lang: str, target_lang: str, lang_name: str) -> str:
    """Translate text from source language to target language."""
    try:
        messages = [
            {
                "role": "system",
                "content": f"You are a professional translator. Translate the following text from {source_lang} to {lang_name}. Provide only the translation, no explanations."
            },
            {
                "role": "user",
                "content": text
            }
        ]
        
        response = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            temperature=TEMPERATURE,
            max_tokens=MAX_TOKENS
        )
        
        translation = response.choices[0].message.content.strip()
        return translation
    
    except Exception as e:
        print(f"Error translating to {target_lang}: {str(e)}")
        return None

def evaluate_translation(original: str, back_translation: str) -> int:
    """Evaluate the quality of back-translation on a scale of 1-5."""
    try:
        messages = [
            {
                "role": "system",
                "content": "You are a translation quality evaluator. Compare the original English text with the back-translation and rate the semantic similarity on a scale of 1 to 5, where:\n1 = Poor (meaning significantly altered)\n2 = Fair (major meaning changes)\n3 = Good (minor meaning changes)\n4 = Very Good (slight nuance differences)\n5 = Excellent (meanings match perfectly)\nRespond with just the number."
            },
            {
                "role": "user",
                "content": f"Original: {original}\nBack-translation: {back_translation}\n\nRate from 1-5:"
            }
        ]
        
        response = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            temperature=0.1,
            max_tokens=1
        )
        
        score = int(response.choices[0].message.content.strip())
        return min(max(score, 1), 5)  # Ensure score is between 1 and 5
    
    except Exception as e:
        print(f"Error evaluating translation: {str(e)}")
        return None

def process_translations(question_id: str = None, target_lang: str = None, force: bool = False):
    """Process translations for all or specific questions and languages."""
    questions = load_json_file(QUESTIONS_FILE)
    languages = load_json_file(LANGUAGES_FILE)
    translations = load_json_file(TRANSLATIONS_FILE)
    
    # Clear the output file
    if os.path.exists(TEMP_OUTPUT_FILE):
        os.remove(TEMP_OUTPUT_FILE)
    
    for question in questions['questions']:
        if question_id and question['id'] != question_id:
            continue
            
        q_id = question['id']
        original_text = question['textEn']
        
        if q_id not in translations:
            translations[q_id] = {}
            
        print(f"\nProcessing question: {q_id}")
        print(f"Original text: {original_text}")
        
        for lang_code, lang_data in languages.items():
            if lang_code == 'en':  # Skip English
                continue
                
            if target_lang and lang_code != target_lang:
                continue
                
            if not force and lang_code in translations[q_id]:
                print(f"Translation exists for {lang_code}, skipping...")
                continue
                
            print(f"\nProcessing language: {lang_code} ({lang_data['name']})")
            
            # Forward translation
            translation = translate_text(
                original_text,
                "English",
                lang_code,
                lang_data['name']
            )
            
            if not translation:
                continue
                
            print(f"Translation: {translation}")
            
            # Back translation
            back_translation = translate_text(
                translation,
                lang_data['name'],
                "English",
                "English"
            )
            
            if not back_translation:
                continue
                
            print(f"Back translation: {back_translation}")
            
            # Evaluate quality
            quality_score = evaluate_translation(original_text, back_translation)
            
            if not quality_score:
                continue
                
            print(f"Quality score: {quality_score}/5")
            
            # Store results
            translations[q_id][lang_code] = {
                "text": translation,
                "backTranslation": back_translation,
                "qualityScore": quality_score,
                "metadata": {
                    "timestamp": datetime.utcnow().isoformat(),
                    "model": MODEL
                }
            }
            
            # Write to temp output file
            with open(TEMP_OUTPUT_FILE, 'a', encoding='utf-8') as f:
                f.write(f"\n=== Translation Process for {lang_code} ===\n")
                f.write(f"Original ({q_id}): {original_text}\n")
                f.write(f"Translation: {translation}\n")
                f.write(f"Back Translation: {back_translation}\n")
                f.write(f"Quality Score: {quality_score}/5\n")
                f.write("=====================================\n")
            
            # Rate limiting
            print(f"Waiting {RATE_LIMIT_DELAY} seconds...")
            time.sleep(RATE_LIMIT_DELAY)
            
        # Save after each question is processed
        save_json_file(TRANSLATIONS_FILE, translations)
        print(f"Saved translations for {q_id}")

def main():
    parser = argparse.ArgumentParser(description='Generate translations using OpenAI API')
    parser.add_argument('--question', type=str, help='Process specific question ID')
    parser.add_argument('--language', type=str, help='Process specific language code')
    parser.add_argument('--force', action='store_true', help='Force regeneration of existing translations')
    args = parser.parse_args()

    try:
        process_translations(args.question, args.language, args.force)
        print("\nTranslation process complete!")
        print(f"Detailed logs saved to {TEMP_OUTPUT_FILE}")
        
    except Exception as e:
        print(f"\nError in main function: {str(e)}")
        raise

if __name__ == "__main__":
    main() 