'use client';

import React from 'react';
import { useMockForgeStore } from '@/lib/store';
import ScenarioCard from './ScenarioCard';

export default function ScenarioGrid() {
  const { scenarios, isGenerating, generationError } = useMockForgeStore();

  if (isGenerating) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '2rem' }}>
        <div style={{ color: 'var(--accent-primary)', fontSize: '1.25rem', fontFamily: 'var(--font-mono)' }}>
          Generating scenarios...
        </div>
      </div>
    );
  }

  if (generationError) {
    return (
      <div style={{ padding: '1rem', backgroundColor: 'rgba(255,0,0,0.1)', color: '#ff4d4f', borderRadius: 'var(--radius)', border: '1px solid #ff4d4f' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Error generating scenarios</h3>
        <p style={{ margin: 0, fontSize: '0.875rem' }}>{generationError}</p>
      </div>
    );
  }

  if (scenarios.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '2rem', color: 'var(--text-muted)' }}>
        Paste a schema and click Generate.
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
      gap: '1rem',
      alignContent: 'start'
    }}>
      {scenarios.map(scenario => (
        <ScenarioCard key={scenario.id} scenario={scenario} />
      ))}
    </div>
  );
}
