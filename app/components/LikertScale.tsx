import { Language } from '../types/language';
import FlagMarker from './FlagMarker';
import { useState, useEffect } from 'react';
import { Result } from '../types/result';

interface LikertScaleProps {
  results: Language[];
  onAllComplete: () => void;
}

export function LikertScale({ 
  results, 
  onAllComplete 
}: LikertScaleProps) {
  const [revealedFlags, setRevealedFlags] = useState<boolean[]>([]);
  const [completedFlags, setCompletedFlags] = useState<boolean[]>([]);

  useEffect(() => {
    setRevealedFlags(new Array(results.length).fill(false));
    setCompletedFlags(new Array(results.length).fill(false));

    // Start revealing flags one by one
    results.forEach((_, index) => {
      setTimeout(() => {
        setRevealedFlags(prev => {
          const next = [...prev];
          next[index] = true;
          return next;
        });
      }, index * 2500); // Time between flags
    });
  }, [results.length]);

  useEffect(() => {
    if (completedFlags.every(Boolean)) {
      onAllComplete();
    }
  }, [completedFlags, onAllComplete]);

  const handleFlagComplete = (index: number) => {
    setCompletedFlags(prev => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  };

  // Transform Language objects into Result objects
  const resultObjects: Result[] = results.map((lang, index) => ({
    flagCode: lang.flagCode,
    position: index / (results.length - 1), // Normalize position between 0 and 1
    score: 0, // Default score
    text: lang.name
  }));

  return (
    <div className="likert-scale">
      <div className="scale-line" />
      {resultObjects.map((result, index) => (
        <FlagMarker
          key={result.flagCode}
          result={result}
          index={index}
          isRevealed={revealedFlags[index]}
          isCompleted={completedFlags[index]}
        />
      ))}
    </div>
  );
} 