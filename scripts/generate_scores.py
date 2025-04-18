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
    SCORES_FILE,
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

def get_score_from_openai(question: str, language_code: str, language_prompt: str) -> Dict:
    """Get a score from 1-10 for a given question and language using OpenAI API."""
    try:
        # Create API call structure with all parameters
        api_call = {
            "model": MODEL,
            "messages": [
                {
                    "role": "system",
#                    "content": "You are responding to a survey. Always respond with a single number from 1 to 10 only. Do not include any other text or explanation."
                    "content": "You are a respondent in a values survey. Answer the following question with just one number that best represents your view, according to the scale provided. Do not include any extra commentary."
                    #matches walls
                },
                {
                    "role": "user",
                    "content": f"{question} {language_prompt}"
                    #this matches the format of the world values survey, for eg How important is God in your life? Please use this scale to indicate. 10 means 'very important' and 1 means 'not at all important.' Reply with just a number (1-10).
                }
            ],
            "temperature": TEMPERATURE,
            "max_tokens": 3  # Allow for two digits (e.g., "10") plus newline
        }
        
        # Write the request to the output file
        with open(TEMP_OUTPUT_FILE, 'a', encoding='utf-8') as f:
            f.write(f"\n=== OpenAI API Call ===\n")
            f.write(f"Language: {language_code}\n")
            f.write(f"System message: {api_call['messages'][0]['content']}\n")
            f.write(f"User message: {api_call['messages'][1]['content']}\n")
            f.write("\nRequest JSON:\n")
            f.write(json.dumps(api_call, indent=2, ensure_ascii=False) + "\n")
            f.write("=====================\n\n")
        
        # Make the actual API call with retry logic
        max_retries = 3
        retry_count = 0
        score = None
        
        while retry_count < max_retries and score is None:
            try:
                print(f"\nMaking API call for {language_code} (attempt {retry_count + 1}/{max_retries})...")
                response = client.chat.completions.create(**api_call)
                
                # Extract and validate the score
                content = response.choices[0].message.content.strip()
                try:
                    # Try to extract number from response
                    import re
                    match = re.search(r'\d+', content)
                    if match:
                        score = int(match.group())
                        if 1 <= score <= 10:
                            print(f"Received valid score: {score}")
                            break
                    print(f"Invalid response format: '{content}'. Retrying...")
                except (ValueError, IndexError) as e:
                    print(f"Error parsing score: {str(e)}. Retrying...")
                
                retry_count += 1
                if retry_count < max_retries:
                    time.sleep(1)  # Wait before retrying
                
            except Exception as e:
                print(f"API call failed: {str(e)}. Retrying...")
                retry_count += 1
                if retry_count < max_retries:
                    time.sleep(1)
        
        if score is None:
            print("Failed to get valid score after all retries. Using default score of 0.")
            score = 0
        
        # Write the response to the output file
        with open(TEMP_OUTPUT_FILE, 'a', encoding='utf-8') as f:
            f.write("\n=== API Response ===\n")
            f.write(f"Raw response content: {response.choices[0].message.content}\n")
            f.write(f"Parsed score: {score}\n")
            f.write("\nFull response JSON:\n")
            f.write(json.dumps(response.model_dump(), indent=2, ensure_ascii=False) + "\n")
            f.write("===================\n\n")
        
        # Create score metadata
        score_data = {
            "score": score,
            "metadata": {
                "timestamp": datetime.utcnow().isoformat(),
                "model": MODEL,
                "prompt": api_call['messages'][1]['content'],
                "system_message": api_call['messages'][0]['content'],
                "parameters": {
                    "temperature": TEMPERATURE,
                    "max_tokens": api_call["max_tokens"]
                },
                "language_code": language_code,
                "response_id": response.id,
                "raw_response": response.choices[0].message.content,
                "attempts": retry_count + 1
            }
        }
        
        with open(TEMP_OUTPUT_FILE, 'a', encoding='utf-8') as f:
            f.write(f"\n=== Stored Score Data ===\n")
            f.write(json.dumps(score_data, indent=2, ensure_ascii=False) + "\n")
            f.write("=======================\n\n")
            
        return score_data
            
    except Exception as e:
        print(f"Error getting score for {language_code}: {str(e)}")
        return None

def main():
    # Clear the output file at the start
    if os.path.exists(TEMP_OUTPUT_FILE):
        os.remove(TEMP_OUTPUT_FILE)
        
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Generate scores for translations')
    parser.add_argument('--force', action='store_true', help='Force regeneration of all scores')
    parser.add_argument('--question', type=str, help='Only process specific question ID')
    parser.add_argument('--language', type=str, help='Only process specific language code')
    args = parser.parse_args()

    try:
        # Load data files
        print("\nLoading data files...")
        questions = load_json_file(QUESTIONS_FILE)
        languages = load_json_file(LANGUAGES_FILE)
        translations = load_json_file(TRANSLATIONS_FILE)
        scores = load_json_file(SCORES_FILE)
        
        print("\nStarting score generation...")
        print(f"Found {len(questions['questions'])} questions")
        print(f"Found {len(languages)} languages")
        
        # Process each question
        for question in questions['questions']:
            question_id = question['id']
            
            # Skip if not the requested question
            if args.question and question_id != args.question:
                print(f"\nSkipping question {question_id} (not requested)")
                continue
                
            print(f"\nProcessing question: {question_id}")
            print(f"Question text: {question['textEn']}")
            
            if question_id not in scores:
                print(f"Creating new scores entry for question {question_id}")
                scores[question_id] = {}
                
            # Process each language
            for lang_code, lang_data in languages.items():
                # Skip if not the requested language
                if args.language and lang_code != args.language:
                    print(f"\nSkipping language {lang_code} (not requested)")
                    continue
                    
                print(f"\nChecking language: {lang_code}")
                
                if lang_code not in scores[question_id] or args.force:
                    try:
                        print(f"Processing language: {lang_code}")
                        # Get the translation
                        if question_id not in translations:
                            print(f"No translations found for question {question_id}")
                            continue
                            
                        if lang_code not in translations[question_id]:
                            print(f"No translation found for language {lang_code}")
                            continue
                            
                        translation = translations[question_id][lang_code]['text']
                        print(f"Found translation: {translation}")
                        
                        # Get the score from OpenAI
                        score_data = get_score_from_openai(translation, lang_code, lang_data['prompt'])
                        
                        if score_data is not None:
                            scores[question_id][lang_code] = score_data
                            print(f"Updated score data for {lang_code}")
                            
                            # Rate limiting delay
                            print(f"Waiting {RATE_LIMIT_DELAY} second to avoid rate limits")
                            time.sleep(RATE_LIMIT_DELAY)
                    except KeyError as e:
                        print(f"KeyError processing {lang_code} for {question_id}: {str(e)}")
                        continue
                    except Exception as e:
                        print(f"Error processing {lang_code} for {question_id}: {str(e)}")
                        continue
                else:
                    print(f"Score already exists for {lang_code}")

        print("\nScore generation complete!")
        
        # Save scores.json with full metadata
        save_json_file(SCORES_FILE, scores)
        print(f"Updated scores.json with new scores and metadata")
        print(f"Detailed API responses saved to {TEMP_OUTPUT_FILE}")

    except Exception as e:
        print(f"\nError in main function: {str(e)}")
        raise

if __name__ == "__main__":
    main() 