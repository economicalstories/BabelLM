'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import questionsData from '../data/questions.json';

interface Question {
  id: string;
  textEn: string;
  category: string;
}

export default function WelcomePage() {
  const router = useRouter();
  const question: Question = questionsData.questions[1]; // q2 is at index 1
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    router.push(`/translate?questionId=${question.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-2xl w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="logo-container mb-8"
          >
            <Image
              src="/BabeLMLogo_large_transparent.png"
              alt="BabelLM Logo"
              width={300}
              height={120}
              priority
              style={{ objectFit: 'contain' }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <div className="space-y-4 text-xl text-gray-600">
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                One AI
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                One Question
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                Three Languages
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
              {question.textEn}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`
                bg-gradient-to-r from-red-500 to-orange-400 
                text-white px-10 py-4 rounded-full 
                text-lg font-semibold shadow-lg 
                hover:shadow-xl transition-all duration-300
                hover:scale-105 transform
                focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50
                ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}
              `}
            >
              {isLoading ? 'Loading...' : 'Ask the LLM'}
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  );
} 