'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Language {
  code: string;
  flag: string;
  translation: string;
  rating?: number;
  predicted_position: number;
}

interface ResultsScreenProps {
  question: string;
  predictions: Language[];
  onTryAnother: () => void;
}

// Dummy ratings for prototype
const dummyRatings = {
  fr: 9,
  es: 7,
  de: 4
};

export default function ResultsScreen({ question, predictions, onTryAnother }: ResultsScreenProps) {
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<Language[]>([]);

  useEffect(() => {
    // Add ratings and sort by rating
    const resultsWithRatings = predictions.map((lang, index) => ({
      ...lang,
      rating: dummyRatings[lang.code as keyof typeof dummyRatings],
      predicted_position: index
    }));
    
    setResults(resultsWithRatings.sort((a, b) => (b.rating || 0) - (a.rating || 0)));
    
    // Animate after a short delay
    setTimeout(() => setShowResults(true), 500);
  }, [predictions]);

  const isPredictionCorrect = (lang: Language) => {
    const actualPosition = results.findIndex(r => r.code === lang.code);
    return actualPosition === lang.predicted_position;
  };

  const allPredictionsCorrect = results.every(isPredictionCorrect);

  return (
    <div className="w-full max-w-md mx-auto text-center p-4">
      <h2 className="text-2xl font-bold mb-6">{question}</h2>

      <div className="relative h-80 mb-8">
        {/* Scale from 1-10 */}
        <div className="absolute left-0 right-0 bottom-0 h-2 bg-gray-200">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-4 w-0.5 bg-gray-400"
              style={{ left: `${(i / 9) * 100}%`, bottom: 0 }}
            />
          ))}
        </div>

        {/* Flags */}
        {results.map((lang, index) => (
          <motion.div
            key={lang.code}
            className="absolute bottom-0"
            initial={{ x: 0 }}
            animate={showResults ? {
              x: `${((lang.rating || 0) - 1) / 9 * 100}%`,
              y: isPredictionCorrect(lang) ? -40 : 0
            } : {}}
            transition={{ duration: 1, delay: index * 0.5 }}
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-2">{lang.flag}</span>
              <div className="h-20 w-0.5 bg-gray-400" />
            </div>
          </motion.div>
        ))}

        {/* Numbers 1-10 */}
        <div className="absolute left-0 right-0 bottom-0 flex justify-between px-2 pt-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="text-sm">{i + 1}</span>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onTryAnother}
          className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold"
        >
          Try another question
        </motion.button>

        {allPredictionsCorrect && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="block w-full bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold"
          >
            Share your winning result
          </motion.button>
        )}
      </div>
    </div>
  );
} 