import { Result } from '../types/result';

interface FlagMarkerProps {
  result: Result;
  index: number;
  isRevealed: boolean;
  isCompleted: boolean;
}

export default function FlagMarker({ result, index, isRevealed, isCompleted }: FlagMarkerProps) {
  return (
    <div
      className="flag-marker"
      style={{ 
        left: `${result.position * 100}%`,
        transitionDelay: `${index * 0.2}s`
      }}
      data-revealed={isRevealed}
      data-completed={isCompleted}
    >
      <img 
        src={`https://flagcdn.com/${result.flagCode}.svg`}
        width="24"
        height="18"
        alt={`${result.flagCode.toUpperCase()} flag`}
      />
      <span className="score">{result.score.toFixed(1)}</span>
    </div>
  );
} 