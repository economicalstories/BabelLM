'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PredictionScreen from './components/PredictionScreen';
import ResultsScreen from './components/ResultsScreen';

interface Language {
  code: string;
  flag: string;
  translation: string;
  rating?: number;
  predicted_position: number;
}

export default function Home() {
  const [question, setQuestion] = useState("How important is freedom?");
  const [currentScreen, setCurrentScreen] = useState(1);
  const [predictions, setPredictions] = useState<Language[]>([]);

  const handleNext = () => {
    setCurrentScreen(2);
  };

  const handlePredictionSubmit = (predictions: Language[]) => {
    setPredictions(predictions);
    setCurrentScreen(3);
  };

  const handleTryAnother = () => {
    setCurrentScreen(1);
    setQuestion("How important is freedom?");
    setPredictions([]);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <AnimatePresence mode="wait">
        {currentScreen === 1 && (
          <motion.div
            key="screen1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full max-w-md mx-auto text-center"
          >
            <h1 className="text-3xl font-bold mb-4">
              Same LLM.
              <br />
              Same question.
              <br />
              Different language.
            </h1>

            <div className="mt-8 mb-12">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full p-4 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold"
            >
              Looks good - Next
            </motion.button>

            <p className="mt-4 text-sm text-gray-600">
              Not your question?{" "}
              <button
                onClick={() => setQuestion("")}
                className="text-blue-600 underline"
              >
                Tap to edit
              </button>
            </p>
          </motion.div>
        )}

        {currentScreen === 2 && (
          <motion.div
            key="screen2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <PredictionScreen
              question={question}
              onSubmit={handlePredictionSubmit}
            />
          </motion.div>
        )}

        {currentScreen === 3 && (
          <motion.div
            key="screen3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <ResultsScreen
              question={question}
              predictions={predictions}
              onTryAnother={handleTryAnother}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
} 