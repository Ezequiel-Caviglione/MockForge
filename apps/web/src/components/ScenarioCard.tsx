'use client';

import React, { useState } from 'react';
import type { Scenario } from '@mockforge/core';
import { useMockForgeStore } from '@/lib/store';
import ScenarioDiffModal from './ScenarioDiffModal';

interface ScenarioCardProps {
  scenario: Scenario;
}

export default function ScenarioCard({ scenario }: ScenarioCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDiff, setShowDiff] = useState(false);

  const { selectedScenarioIds, toggleScenarioSelection, scenarios } = useMockForgeStore();
  const isSelected = selectedScenarioIds.includes(scenario.id);
  const canCompare = scenarios.length > 1;

  return (
    <>
      <div
        style={{
          backgroundColor: isSelected ? 'rgba(124,58,237,0.05)' : 'var(--bg-base)',
          border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border)'}`,
          borderRadius: 'var(--radius)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          cursor: 'pointer',
          transition: 'border-color 0.15s ease, background-color 0.15s ease',
          boxShadow: isSelected
            ? '0 0 0 1px var(--accent-primary), 0 4px 6px -1px rgba(0,0,0,0.1)'
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          position: 'relative',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={(e) => {
          if (!isSelected)
            e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)';
        }}
        onMouseLeave={(e) => {
          if (!isSelected)
            e.currentTarget.style.borderColor = 'var(--border)';
        }}
      >
        {/* Selection checkbox — top-right overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleScenarioSelection(scenario.id);
          }}
          title={isSelected ? 'Deselect for export' : 'Select for export'}
          style={{
            position: 'absolute',
            top: '0.625rem',
            right: '0.625rem',
            width: '20px',
            height: '20px',
            borderRadius: '4px',
            border: `1.5px solid ${isSelected ? 'var(--accent-primary)' : 'rgba(255,255,255,0.2)'}`,
            backgroundColor: isSelected ? 'var(--accent-primary)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            flexShrink: 0,
            padding: 0,
          }}
          aria-checked={isSelected}
          role="checkbox"
        >
          {isSelected && (
            <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
              <path d="M1 4l3 3 6-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingRight: '1.75rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            {scenario.name}
          </h3>
          <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {scenario.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: '0.7rem',
                  padding: '0.125rem 0.375rem',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'var(--text-muted)',
                  borderRadius: '4px',
                }}
              >
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
          <>
            <pre
              style={{
                marginTop: '0.5rem',
                backgroundColor: '#1e1e1e',
                padding: '0.75rem',
                borderRadius: '4px',
                fontSize: '0.875rem',
                fontFamily: 'var(--font-mono)',
                color: '#d4d4d4',
                overflowX: 'auto',
              }}
            >
              {JSON.stringify(scenario.fields, null, 2)}
            </pre>

            {/* Compare button */}
            {canCompare && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDiff(true);
                }}
                style={{
                  alignSelf: 'flex-start',
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                  borderRadius: '5px',
                  padding: '0.25rem 0.625rem',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  transition: 'border-color 0.15s, color 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }}
              >
                ⇄ Compare
              </button>
            )}
          </>
        ) : (
          <div
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-muted)',
              marginTop: '0.5rem',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {Object.keys(scenario.fields).length} fields
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

      {/* Diff modal */}
      {showDiff && (
        <ScenarioDiffModal
          baseScenario={scenario}
          allScenarios={scenarios}
          onClose={() => setShowDiff(false)}
        />
      )}
    </>
  );
}
