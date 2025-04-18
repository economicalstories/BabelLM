'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import ShareModal from './ShareModal';
import scoresData from '../data/scores.json';
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';

interface ScoreData {
  score: number;
  metadata: {
    timestamp: string;
    model: string;
    prompt: string;
    parameters: {
      temperature: number;
      max_tokens: number;
    };
    language_code: string;
  };
}

interface ScoresData {
  [questionId: string]: {
    [languageCode: string]: ScoreData;
  };
}

interface Result {
  languageCode: string;
  text: string;
  position: number;
  score: number;
  flagCode: string;
}

type ScoreReveals = Record<string, boolean>;
type BarWidths = Record<string, number>;

// Add this type definition
type MotionDivProps = HTMLMotionProps<"div">;

// Add proper type for motion components
const MotionDiv = motion.div as React.FC<HTMLMotionProps<"div"> & { className?: string }>;
const MotionSpan = motion.span as React.FC<HTMLMotionProps<"span"> & { className?: string }>;

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [revealedCount, setRevealedCount] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [perfectMatch, setPerfectMatch] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const [question, setQuestion] = useState('');
  const [isGeneratingShare, setIsGeneratingShare] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareFeedback, setShareFeedback] = useState('');
  const [shareText, setShareText] = useState('');
  const [scoreReveals, setScoreReveals] = useState<ScoreReveals>(() => ({}));
  const [barWidths, setBarWidths] = useState<BarWidths>(() => ({}));

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval: NodeJS.Timeout = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50;

      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.1, 0.9),
          y: Math.random() - 0.2
        }
      });
    }, 250);
  };

  useEffect(() => {
    const storedResults = sessionStorage.getItem('translationResults');
    const storedQuestion = sessionStorage.getItem('translationQuestion');
    const questionId = sessionStorage.getItem('questionId') || 'q1'; // Get questionId from session storage

    if (storedResults && storedQuestion) {
      try {
        const parsedResults = JSON.parse(storedResults);
        const resultsWithScores = parsedResults.map((result: Result) => ({
          ...result,
          score: (scoresData as ScoresData)[questionId][result.languageCode]?.score || 5
        }));
        
        // Sort a copy of results by score to get correct order
        const correctOrder = [...resultsWithScores]
          .sort((a, b) => b.score - a.score)
          .map((r: Result) => r.languageCode);

        // Get user's predicted order
        const predictedOrder = resultsWithScores
          .map((r: Result) => r.languageCode);

        // Check if orders match
        const isPerfect = correctOrder.every((lang, index) => lang === predictedOrder[index]);
        
        setResults(resultsWithScores);
        setQuestion(storedQuestion);

        // Initialize score reveals and bar widths
        const initialScoreReveals: ScoreReveals = {};
        const initialBarWidths: BarWidths = {};
        resultsWithScores.forEach((result: Result) => {
          initialScoreReveals[result.languageCode] = false;
          initialBarWidths[result.languageCode] = 0;
        });
        setScoreReveals(initialScoreReveals);
        setBarWidths(initialBarWidths);

        // Start revealing results one by one
        resultsWithScores.forEach((result: Result, index: number) => {
          setTimeout(() => {
            setRevealedCount(index + 1);
            
            // Animate the bar width
            const startTime = Date.now();
            const animationDuration = 1500; // 1.5 seconds
            const targetWidth = (result.score / 10) * 100;
            
            const animateBar = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / animationDuration, 1);
              
              setBarWidths(prev => ({
                ...prev,
                [result.languageCode]: targetWidth * progress
              }));
              
              if (progress < 1) {
                requestAnimationFrame(animateBar);
              } else {
                setScoreReveals(prev => ({
                  ...prev,
                  [result.languageCode]: true
                }));
                
                if (index === resultsWithScores.length - 1) {
                  setAllLoaded(true);
                  setPerfectMatch(isPerfect);
                  if (isPerfect) {
                    setTimeout(triggerConfetti, 500);
                  }
                }
              }
            };
            
            requestAnimationFrame(animateBar);
          }, index * 1500);
        });

      } catch (error) {
        console.error('Error parsing data:', error);
        setFeedback('Something went wrong. Please try again.');
        setAllLoaded(true);
      }
    } else {
      setFeedback('No results found. Please try translating a question first.');
      setAllLoaded(true);
    }
  }, []);

  const handleShare = async () => {
    setIsGeneratingShare(true);
    setShareError(null);
    try {
      const text = results.map(r => `${r.text}`).join(' ') + `\n\nI discovered something fascinating about AI! 🤖 ` +
        `When asked the same question in different languages, it can give completely different responses.` +
        `\n\nCan you guess how the AI will respond? Try it at https://babel-lm.vercel.app`;
      
      setShareText(text);
      await navigator.clipboard.writeText(text);
      setShareFeedback('Results copied to clipboard!');
      setIsShareModalOpen(true);
    } catch (error) {
      console.error('Error sharing results:', error);
      setShareError('Failed to copy results. Please try again.');
    } finally {
      setIsGeneratingShare(false);
      // Clear feedback after 3 seconds
      setTimeout(() => setShareFeedback(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <main className="flex flex-col items-center min-h-screen p-4">
        <div className="max-w-2xl w-full text-center">
          <MotionDiv
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ margin: 0, padding: 0, display: 'flex', justifyContent: 'center', height: 'auto' }}
          >
            <Image
              src="/BabeLMLogo_large_transparent.png"
              alt="BabelLM Logo"
              width={250}
              height={100}
              priority
              style={{ objectFit: 'contain', margin: 0, padding: 0, display: 'block' }}
            />
          </MotionDiv>

          {feedback && (
            <div className="feedback-text" style={{ margin: '0.5rem 0' }}>{feedback}</div>
          )}

          <div className="results-stack" style={{ marginTop: '0.5rem', background: 'transparent' }}>
            <AnimatePresence>
              {results.slice(0, revealedCount).map((result, index) => (
                <MotionDiv
                  key={result.languageCode}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="result-card"
                  style={{ background: 'white' }}
                >
                  <div className="flag-container">
                    <Image
                      src={`/flags/${result.flagCode.toLowerCase()}.svg`}
                      alt={`${result.languageCode} flag`}
                      width={32}
                      height={24}
                      className="flag-icon"
                    />
                  </div>
                  <span className="translation-text">{result.text}</span>
                  <AnimatePresence>
                    {scoreReveals[result.languageCode] && (
                      <MotionSpan
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="score"
                      >
                        {result.score.toFixed(1)}
                      </MotionSpan>
                    )}
                  </AnimatePresence>
                  <div 
                    className="score-bar" 
                    style={{ width: `${barWidths[result.languageCode]}%` }}
                  />
                </MotionDiv>
              ))}
            </AnimatePresence>
          </div>

          {allLoaded && (
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="action-buttons"
            >
              <button
                onClick={handleShare}
                disabled={isGeneratingShare || !perfectMatch}
                className={`share-button ${isGeneratingShare ? 'loading' : ''} ${!perfectMatch ? 'disabled' : ''}`}
              >
                {isGeneratingShare ? 'Generating...' : perfectMatch ? 'Share my results' : 'Predictions incorrect'}
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="try-another-button"
              >
                Try another
              </button>
            </MotionDiv>
          )}
        </div>
      </main>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareText={shareText}
        isLoading={isGeneratingShare}
        error={shareError}
        onRetry={handleShare}
      />
    </div>
  );
} 