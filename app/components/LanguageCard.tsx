import { Language } from '../types/language';

interface LanguageCardProps {
  language: Language;
  index: number;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
}

export function LanguageCard({ 
  language, 
  index, 
  onDragStart, 
  onDragOver, 
  onDrop 
}: LanguageCardProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
      className="language-card"
    >
      <span className="rank">{index + 1}</span>
      <span className={`fi fi-${language.flagCode}`} />
      <span className="name">{language.name}</span>
    </div>
  );
} 