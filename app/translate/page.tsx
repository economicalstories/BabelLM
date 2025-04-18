'use client';

import { Suspense } from 'react';
import TranslatePage from '../components/TranslatePage';

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TranslatePage />
    </Suspense>
  );
} 