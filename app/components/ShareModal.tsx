'use client';

import React, { useState } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareText: string;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function ShareModal({
  isOpen,
  onClose,
  shareText,
  isLoading,
  error,
  onRetry,
}: ShareModalProps) {
  const [copyFeedback, setCopyFeedback] = useState('');

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopyFeedback('Copied to clipboard!');
      setTimeout(() => setCopyFeedback(''), 2000);
    } catch (err) {
      setCopyFeedback('Failed to copy');
      setTimeout(() => setCopyFeedback(''), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-center mb-6">Share Your Results</h2>

        {error ? (
          <div className="text-center mb-6">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="mb-6">
                <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap mb-4">
                  {shareText}
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={handleCopy}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-2M8 4v12a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-2M8 4V2a2 2 0 012-2h8a2 2 0 012 2v2" />
                    </svg>
                    Copy to Clipboard
                  </button>
                </div>
                {copyFeedback && (
                  <p className="text-center mt-2 text-green-600">{copyFeedback}</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 