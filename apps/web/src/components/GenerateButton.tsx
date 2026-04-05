'use client';

import React from 'react';
import { useMockForgeStore } from '@/lib/store';

export default function GenerateButton() {
  const { generateScenarios, isGenerating } = useMockForgeStore();

  return (
    <button 
      onClick={generateScenarios}
      disabled={isGenerating}
      style={{ 
        backgroundColor: isGenerating ? 'var(--bg-elevated)' : 'var(--accent-primary)', 
        color: 'white', 
        border: 'none', 
        padding: '0.5rem 1rem', 
        borderRadius: '4px', 
        fontWeight: 600, 
        cursor: isGenerating ? 'not-allowed' : 'pointer', 
        width: '100%',
        transition: 'all 0.2s',
        opacity: isGenerating ? 0.7 : 1
      }}
    >
      {isGenerating ? (
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <span className="spinner">⟳</span> Generating...
        </span>
      ) : (
        'Generate Scenarios ✨'
      )}
    </button>
  );
}
