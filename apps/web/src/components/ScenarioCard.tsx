'use client';

import React, { useState } from 'react';
import type { Scenario } from '@mockforge/core';

interface ScenarioCardProps {
  scenario: Scenario;
}

export default function ScenarioCard({ scenario }: ScenarioCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div style={{
      backgroundColor: 'var(--bg-base)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      cursor: 'pointer',
      transition: 'border-color 0.2s',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    }}
    onClick={() => setIsExpanded(!isExpanded)}
    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {scenario.name}
          {scenario.aiEnhanced && (
            <span style={{ fontSize: '0.75rem', padding: '0.125rem 0.375rem', backgroundColor: 'var(--accent-glow)', color: 'var(--accent-secondary)', borderRadius: '1rem', fontWeight: 500 }}>
              AI
            </span>
          )}
        </h3>
        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: '40%' }}>
          {scenario.tags.map(tag => (
            <span key={tag} style={{ fontSize: '0.7rem', padding: '0.125rem 0.375rem', backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)', borderRadius: '4px' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      {scenario.description && (
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
          {scenario.description}
        </p>
      )}

      {isExpanded ? (
        <pre style={{ 
          marginTop: '0.5rem', 
          backgroundColor: '#1e1e1e', 
          padding: '0.75rem', 
          borderRadius: '4px', 
          fontSize: '0.875rem',
          fontFamily: 'var(--font-mono)',
          color: '#d4d4d4',
          overflowX: 'auto'
        }}>
          {JSON.stringify(scenario.fields, null, 2)}
        </pre>
      ) : (
        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontFamily: 'var(--font-mono)' }}>
          {Object.keys(scenario.fields).length} fields 
          {/* Quick preview of first 2 fields */}
          <span style={{ opacity: 0.7 }}>
            {' • '}
            {Object.entries(scenario.fields)
              .slice(0, 2)
              .map(([k, v]) => `${k}: ${v === null ? 'null' : typeof v}`)
              .join(', ')}
            {Object.keys(scenario.fields).length > 2 && '...'}
          </span>
        </div>
      )}
    </div>
  );
}
