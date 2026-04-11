'use client';

import { useEffect } from 'react';
import { useMockForgeStore } from '@/lib/store';

/**
 * Triggers manual localStorage rehydration after the first client-side render,
 * avoiding Next.js SSR hydration mismatches.
 */
export default function HydrationGate() {
  useEffect(() => {
    useMockForgeStore.persist.rehydrate();
  }, []);

  return null;
}
