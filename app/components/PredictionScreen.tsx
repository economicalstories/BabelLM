import { useState } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { languages, type LanguageCode } from '../utils/languages';

// Define the correct type for motion.div
type MotionDivProps = HTMLMotionProps<"div"> & {
  className?: string;
  layout?: boolean;
};

interface PredictionScreenProps {
  question: string;
  selectedLanguages: LanguageCode[];
  onComplete: (predictions: { [key: string]: number }) => void;
}

export default function PredictionScreen({ question, selectedLanguages, onComplete }: PredictionScreenProps) {
  const [predictions, setPredictions] = useState<{ [key: string]: number }>({});

  const handlePrediction = (langCode: LanguageCode, score: number) => {
    setPredictions(prev => ({
      ...prev,
      [langCode]: score
    }));
  };

  const handleSubmit = () => {
    if (Object.keys(predictions).length === selectedLanguages.length) {
      onComplete(predictions);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">{question}</h2>
      
      <div className="space-y-4">
        {selectedLanguages.map((langCode) => (
          <motion.div
            key={langCode}
            className="bg-white p-4 rounded-lg shadow flex items-center gap-4"
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex-1">
              <h3 className="font-medium text-gray-700">{languages[langCode].name}</h3>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="10"
                value={predictions[langCode] || ''}
                onChange={(e) => handlePrediction(langCode, parseInt(e.target.value))}
                className="w-16 px-2 py-1 border rounded"
              />
              <span className="text-gray-500">/10</span>
            </div>
          </motion.div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={Object.keys(predictions).length !== selectedLanguages.length}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg disabled:opacity-50"
      >
        Submit Predictions
      </button>
    </div>
  );
} 