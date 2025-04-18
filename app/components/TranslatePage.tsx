'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import Image from 'next/image';
import { languages, type Language, type LanguageCode } from '../utils/languages';
import questionsData from '../data/questions.json';
import translationsData from '../data/translations.json';
import { motion } from 'framer-motion';

interface Translation {
  id: string;
  languageCode: LanguageCode;
  text: string;
}

interface TranslationData {
  [questionId: string]: {
    [languageCode: string]: {
      text: string;
      backTranslation?: string;
    };
  };
}

// Type assertion for our JSON data
const typedTranslationsData = translationsData as TranslationData;

export default function TranslatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState('');

  useEffect(() => {
    try {
      const questionId = searchParams.get('questionId');
      if (!questionId) {
        throw new Error('No question ID provided');
      }

      // Find the question
      const questionData = questionsData.questions.find(q => q.id === questionId);
      if (!questionData) {
        throw new Error('Question not found');
      }

      setQuestion(questionData.textEn);

      // Get translations for this question
      const questionTranslations = typedTranslationsData[questionId];
      if (!questionTranslations) {
        throw new Error('Translations not found for this question');
      }

      // Get 3 random languages (excluding English)
      const availableLanguages = Object.entries(languages)
        .filter(([code]) => code !== 'en' && questionTranslations[code])
        .map(([code, lang]) => ({
          code: code as LanguageCode,
          name: lang.name,
          countryCode: lang.countryCode
        }));

      if (availableLanguages.length < 3) {
        throw new Error('Not enough translations available');
      }
      
      const selectedLanguages = [...availableLanguages]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      // Create translation items
      const translationItems = selectedLanguages.map(lang => ({
        id: lang.code,
        languageCode: lang.code,
        text: questionTranslations[lang.code]?.text || 'Translation not available'
      }));

      setTranslations(translationItems);
      setIsLoading(false);
    } catch (err) {
      console.error('Error in TranslatePage:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      router.push('/');
    }
  }, [searchParams, router]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newItems = Array.from(translations);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);
    setTranslations(newItems);
  };

  const handleRunModel = () => {
    setIsLoading(true);
    
    // Store the current order and translations for the results page
    const results = translations.map((item, index) => ({
      languageCode: item.languageCode,
      text: item.text,
      position: 1 - (index * 0.15), // Simple scoring based on position
      score: 10 - (index * 1.5), // Simple scoring based on position
      flagCode: languages[item.languageCode].countryCode // Add the country code for the flag
    }));

    sessionStorage.setItem('translationResults', JSON.stringify(results));
    sessionStorage.setItem('translationQuestion', question);
    sessionStorage.setItem('questionId', searchParams.get('questionId') || '');
    
    setTimeout(() => router.push('/results'), 500);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="flex flex-col items-center min-h-screen p-4 pt-8">
        <div className="max-w-2xl w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="logo-container mb-12"
          >
            <Image
              src="/BabeLMLogo_large_transparent.png"
              alt="BabelLM Logo"
              width={200}
              height={80}
              priority
              style={{ objectFit: 'contain' }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <p className="text-xl text-gray-600 leading-relaxed max-w-xl mx-auto">
              Will the AI respond differently across languages?
            </p>
            <p className="text-lg text-gray-500 mt-2">
              Predict the order, then see if the model agrees.
            </p>
          </motion.div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="translations">
              {(provided) => (
                <div
                  className="space-y-4 mb-12"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {translations.map((item, index) => (
                    <Draggable 
                      key={item.id} 
                      draggableId={item.id} 
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`
                            bg-white rounded-xl p-5 shadow-lg flex items-center gap-6
                            hover:shadow-xl transition-all duration-300
                            ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-blue-200' : ''}
                          `}
                        >
                          <span className="text-3xl font-bold text-gray-300">{index + 1}</span>
                          <div className="flag-container shadow-sm rounded-md overflow-hidden">
                            <Image 
                              src={`/flags/${languages[item.languageCode].countryCode.toLowerCase()}.svg`}
                              alt={`${languages[item.languageCode].name} flag`}
                              width={40}
                              height={30}
                              className="flag-icon"
                            />
                          </div>
                          <span className="flex-grow text-left text-lg font-medium">{item.text}</span>
                          <div className="text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="3" y1="12" x2="21" y2="12"></line>
                              <line x1="3" y1="6" x2="21" y2="6"></line>
                              <line x1="3" y1="18" x2="21" y2="18"></line>
                            </svg>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <button 
              className={`
                bg-gradient-to-r from-red-500 to-orange-400 text-white 
                px-10 py-4 rounded-full text-lg font-semibold 
                shadow-lg hover:shadow-xl transition-all duration-300
                hover:scale-105 transform
                focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50
                ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}
              `}
              onClick={handleRunModel}
              disabled={isLoading}
            >
              {isLoading ? 'Analyzing...' : 'Ask the LLM'}
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  );
} 