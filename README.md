# BabelLM

BabelLM is a playful app that lets users explore how the same AI model rates questions across different languages. Users can predict language rankings and watch an animated "flag race" reveal the actual ratings.

## Features

- Input or edit questions to ask the AI
- Predict rankings for translations in French, Spanish, and German
- Watch an animated flag race showing actual ratings
- Share winning results when predictions are correct

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/babellm.git
cd babellm
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Development

The app is built with:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion for animations

### Project Structure

```
src/
  ├── app/
  │   ├── components/
  │   │   ├── PredictionScreen.tsx
  │   │   └── ResultsScreen.tsx
  │   ├── layout.tsx
  │   ├── page.tsx
  │   └── globals.css
  └── ...
```

## Future Enhancements

- Integration with OpenAI API for real-time language ratings
- Additional languages and translation options
- User accounts and rating history
- Social sharing features

## License

This project is licensed under the MIT License - see the LICENSE file for details. 