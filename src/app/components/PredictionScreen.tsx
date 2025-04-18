'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Language {
  code: string;
  flag: string;
  translation: string;
  predicted_position: number;
}

interface PredictionScreenProps {
  question: string;
  onSubmit: (predictions: Language[]) => void;
}

const languages: Language[] = [
  {
    code: 'fr',
    flag: '🇫🇷',
    translation: "J'ai un bon équilibre entre vie professionalelle et vie privée",
    predicted_position: 0
  },
  {
    code: 'es',
    flag: '🇪🇸',
    translation: "Tengo un buen equilibrio entre el trabajo y la vida personal",
    predicted_position: 1
  },
  {
    code: 'de',
    flag: '🇩🇪',
    translation: "Ich habe eine gute Work-Life-Balance",
    predicted_position: 2
  }
];

export default function PredictionScreen({ question, onSubmit }: PredictionScreenProps) {
  const [predictions, setPredictions] = useState<Language[]>([...languages]);

  const moveLanguage = (from: number, to: number) => {
    const newPredictions = [...predictions];
    const [removed] = newPredictions.splice(from, 1);
    newPredictions.splice(to, 0, removed);
    // Update predicted positions after moving
    newPredictions.forEach((lang, index) => {
      lang.predicted_position = index;
    });
    setPredictions(newPredictions);
  };

  return (
    <div className="w-full max-w-md mx-auto text-center p-4">
      <h2 className="text-2xl font-bold mb-6">
        Which translation will get the highest rating?
      </h2>

      <div className="bg-yellow-50 p-6 rounded-lg mb-8">
        <p className="text-lg mb-4">{question}</p>
        
        <div className="space-y-4">
          {predictions.map((lang, index) => (
            <motion.div
              key={lang.code}
              className="bg-white p-4 rounded-lg shadow flex items-center gap-4"
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <span className="text-2xl">{index + 1}st</span>
              <span className="text-2xl">{lang.flag}</span>
              <p className="text-left flex-1">{lang.translation}</p>
              <div className="flex gap-2">
                {index > 0 && (
                  <button
                    onClick={() => moveLanguage(index, index - 1)}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    ↑
                  </button>
                )}
                {index < predictions.length - 1 && (
                  <button
                    onClick={() => moveLanguage(index, index + 1)}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    ↓
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onSubmit(predictions)}
        className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold"
      >
        Submit Prediction
      </motion.button>
    </div>
  );
} 