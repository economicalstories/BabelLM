# BabelLM

BabelLM is an interactive web application that explores how large language models (LLMs) respond differently to the same question across various languages. It's a fascinating experiment in understanding AI behavior and cultural bias in language models.

## 🎯 Purpose

The application allows users to:
1. See a question translated into multiple languages
2. Predict how an AI model would rank these translations
3. Compare their predictions with actual AI model responses
4. Share their results and insights

## 🚀 Features

- **Interactive Translation Ranking**: Drag and drop interface to predict AI responses
- **Multi-language Support**: Questions translated into various languages
- **Visual Results**: Animated score reveals with flag icons
- **Shareable Results**: Easy sharing of your predictions and results
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Offline Operation**: Pre-computed translations and scores to minimize API calls

## 🛠️ Technical Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Drag and Drop**: @hello-pangea/dnd
- **Icons**: Flag Icons from flag-icons package
- **Deployment**: Vercel

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/BabelLM.git
cd BabelLM
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

## 🔧 Configuration

The application uses several JSON files for configuration:

- `questions.json`: Contains the questions to be translated
- `translations.json`: Stores translations for each question
- `scores.json`: Contains pre-computed AI model scores for each translation

### Offline Generation

To save on API calls and ensure consistent results, the application uses pre-generated data:

1. **Translations Generation**:
   - Run `python scripts/generate_translations.py` to generate translations for all questions
   - This uses openAI API calls to create accurate translations for each question
   - Results are saved in `translations.json`

2. **Scores Generation**:
   - Run `python scripts/generate_scores.py` to generate AI model scores
   - This uses openAI AI calls to evaluate responses for each translation
   - Results are saved in `scores.json`

These pre-generated files allow the application to run without making API calls during normal operation, making it faster and more cost-effective.

## 🌐 Deployment

The application is designed to be deployed on Vercel. See [deployment.md](docs/deployment.md) for detailed deployment instructions.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Flag icons provided by [flag-icons](https://github.com/lipis/flag-icons)
- Built with [Next.js](https://nextjs.org/)
- Deployed on [Vercel](https://vercel.com) 