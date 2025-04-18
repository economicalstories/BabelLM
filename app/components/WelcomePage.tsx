'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, HTMLMotionProps } from 'framer-motion';
import Image from 'next/image';
import questionsData from '../data/questions.json';

interface Question {
  id: string;
  textEn: string;
  category: string;
}

// Create properly typed motion components for each HTML element
const MotionDiv = motion.div as React.FC<HTMLMotionProps<"div"> & { className?: string }>;
const MotionP = motion.p as React.FC<HTMLMotionProps<"p"> & { className?: string }>;

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
      <main className="flex flex-col items-center min-h-screen p-4 pt-8">
        <div className="max-w-2xl w-full text-center">
          <MotionDiv
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="logo-container"
            style={{ margin: 0, padding: 0 }}
          >
            <Image
              src="/BabeLMLogo_large_transparent.png"
              alt="BabelLM Logo"
              width={300}
              height={120}
              priority
              style={{ objectFit: 'contain', margin: 0, padding: 0 }}
            />
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="space-y-2 text-xl text-gray-600">
              <MotionP 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                One AI
              </MotionP>
              <MotionP 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                One Question
              </MotionP>
              <MotionP 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                Three Languages
              </MotionP>
            </div>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {question.textEn}
            </h1>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`
                bg-gradient-to-r from-red-500 to-orange-400 
                text-white px-8 py-3 rounded-full 
                text-base font-semibold shadow-lg 
                hover:shadow-xl transition-all duration-300
                hover:scale-105 transform
                focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50
                ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}
              `}
            >
              {isLoading ? 'Loading...' : 'Ask the LLM'}
            </button>
          </MotionDiv>
        </div>
      </main>
    </div>
  );
} 