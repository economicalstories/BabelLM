'use client';

import React from 'react';
import Image from 'next/image';
import html2canvas from 'html2canvas';

interface ShareCardProps {
  question: string;
  results: Array<{
    flagCode: string;
    text: string;
    score: number;
    languageCode: string;
  }>;
  onGenerated?: (imageBlob: Blob) => void;
}

export default function ShareCard({ question, results, onGenerated }: ShareCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (cardRef.current && onGenerated) {
      const captureCard = async () => {
        try {
          if (!cardRef.current) return;
          
          html2canvas(cardRef.current, {
            logging: false,
            background: '#FFFFFF',
            width: 1200,
            height: 630,
            useCORS: true,
            allowTaint: true
          }).then(canvas => {
            canvas.toBlob((blob) => {
              if (blob) {
                onGenerated(blob);
              }
            }, 'image/png', 1.0);
          });
        } catch (error) {
          console.error('Error capturing share card:', error);
        }
      };

      // Small delay to ensure all assets are loaded
      setTimeout(captureCard, 100);
    }
  }, [question, results, onGenerated]);

  return (
    <div 
      ref={cardRef}
      className="share-card"
      style={{
        width: '1200px',
        height: '630px',
        position: 'fixed',
        left: '-9999px', // Hide off-screen while rendering
        top: 0,
      }}
    >
      <div className="share-card-content">
        <div className="share-card-header">
          <Image
            src="/BabeLMLogo_small_transparent.png"
            alt="BabelLM Logo"
            width={150}
            height={60}
            priority
          />
          <div className="share-card-tagline">
            Discover the language behind the text
          </div>
        </div>

        <div className="share-card-body">
          <div className="share-card-question">
            {question}
          </div>

          <div className="share-card-results">
            {results.map((result, index) => (
              <div key={index} className="share-card-result">
                <Image 
                  src={`/flags/${result.flagCode.toLowerCase()}.svg`}
                  alt={`${result.languageCode} flag`}
                  width={48}
                  height={36}
                  className="share-card-flag"
                  priority
                />
                <div className="share-card-result-content">
                  <div className="share-card-translation">
                    {result.text}
                  </div>
                  <div className="share-card-score-bar">
                    <div 
                      className="share-card-score-fill"
                      style={{ width: `${result.score * 10}%` }}
                    />
                  </div>
                </div>
                <div className="share-card-score">
                  {result.score.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="share-card-footer">
          Try it yourself at babellm.ai
        </div>
      </div>
    </div>
  );
} 