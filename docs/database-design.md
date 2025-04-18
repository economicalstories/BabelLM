# BabelLM Data Design

## Overview
Using JSON files for storing questions, translations, and scores. The goal is to generate and maintain these files to support the existing frontend application.

## Data Structure

### Languages (`data/languages.json`)
```json
{
  "en": {
    "name": "English",
    "nativeName": "English",
    "countryCode": "US",
    "direction": "ltr",
    "prompt": "On a scale of 1 to 10, where 1 is not at all important, and 10 is most important, answer the following question with a single number."
  },
  "es": {
    "name": "Spanish",
    "nativeName": "Español",
    "countryCode": "ES",
    "direction": "ltr",
    "prompt": "En una escala del 1 al 10, donde 1 no es nada importante y 10 es lo más importante, responda la siguiente pregunta con un solo número."
  }
  // ... other languages
}
```

### Questions (`data/questions.json`)
```json
{
  "questions": [
    {
      "id": "q1",
      "textEn": "How important is freedom?",
      "category": "philosophical"
    }
    // ... other questions
  ]
}
```

### Translations (`data/translations.json`)
```json
{
  "q1": {
    "en": {
      "text": "How important is freedom?"
    },
    "es": {
      "text": "¿Qué tan importante es la libertad?",
      "backTranslation": "How important is liberty?"
    }
    // ... other languages
  }
  // ... other questions
}
```

### Scores (`data/scores.json`)
```json
{
  "q1": {
    "en": 8.5,
    "es": 8.2,
    "fr": 8.7,
    "ja": 7.9
    // ... other languages
  }
  // ... other questions
}
```

## Implementation Roadmap

### Phase 1: Initial Setup
1. Create JSON Files
   - Set up `languages.json` with core languages
   - Create `questions.json` with initial questions
   - Initialize empty `translations.json` and `scores.json`

2. Create Translation Process
   - Translate questions to target languages
   - Generate back-translations for verification
   - Store translations in `translations.json`

3. Create Scoring Process
   - Get 1-10 scores for each translation
   - Verify scores are valid numbers
   - Store scores in `scores.json`

### Phase 2: Update Process
1. Adding New Questions
   - Add to `questions.json`
   - Generate translations
   - Get scores
   - Verify results

2. Adding New Languages
   - Add to `languages.json`
   - Generate translations for all questions
   - Get scores for new translations
   - Verify results

3. Updating Content
   - Update translations if needed
   - Regenerate scores if needed
   - Verify changes
   - Deploy updates

## Usage Workflows

### 1. Initial Setup
- Create all JSON files
- Add initial questions
- Set up core languages
- Generate initial translations
- Get initial scores

### 2. Adding New Content
- Add new questions to `questions.json`
- Generate translations for new questions
- Get scores for new translations
- Verify results

### 3. Adding New Languages
- Add new language to `languages.json`
- Generate translations for all questions
- Get scores for new translations
- Verify results

## Advantages

1. **Simplicity**
   - Clear data structure
   - Easy to update
   - Version controlled
   - No complex scoring logic

2. **Efficiency**
   - Files served directly by Vercel
   - No runtime processing
   - Fast loading
   - Minimal overhead

3. **Maintenance**
   - Easy to review changes
   - Simple update process
   - Clear audit trail
   - No database needed

4. **Cost**
   - No database costs
   - Minimal compute needs
   - Free tier compatible
   - Efficient storage 