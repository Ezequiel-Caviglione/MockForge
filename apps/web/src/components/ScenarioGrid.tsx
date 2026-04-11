'use client';

import React from 'react';
import { useMockForgeStore } from '@/lib/store';
import ScenarioCard from './ScenarioCard';
import type { GenerationErrorCode } from '@/lib/store';

// ---------------------------------------------------------------------------
// Error messages by code
// ---------------------------------------------------------------------------

const ERROR_INFO: Record<GenerationErrorCode, { icon: string; hint: string }> = {
  RATE_LIMITED:   { icon: '⏱️', hint: 'The AI provider is temporarily throttling requests. Wait a moment or add your own API key.' },
  AUTH_ERROR:     { icon: '🔑', hint: 'Your API key appears to be invalid. Open Settings and check your credentials.' },
  NO_PROVIDERS:   { icon: '⚙️', hint: 'No AI providers are configured. Add a provider API key in Settings.' },
  PARSE_ERROR:    { icon: '⚠️', hint: 'The AI returned an unexpected response. Try generating again.' },
  NETWORK_ERROR:  { icon: '🌐', hint: 'Could not reach the AI provider. Check your internet connection.' },
  UNKNOWN:        { icon: '❌', hint: 'An unexpected error occurred. Try again.' },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ScenarioGrid() {
  const {
    scenarios,
    isGenerating,
    generationError,
    generationErrorCode,
    selectedScenarioIds,
    toggleScenarioSelection,
    clearSelection,
    selectAllScenarios,
  } = useMockForgeStore();

  // ── Generating ────────────────────────────────────────────────────────────
  if (isGenerating) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '2rem' }}>
        <div style={{ color: 'var(--accent-primary)', fontSize: '1.25rem', fontFamily: 'var(--font-mono)' }}>
          Generating scenarios...
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (generationError) {
    const code = generationErrorCode ?? 'UNKNOWN';
    const info = ERROR_INFO[code];
    const showSettingsHint = code === 'RATE_LIMITED' || code === 'AUTH_ERROR' || code === 'NO_PROVIDERS';

    return (
      <div style={{
        padding: '1.25rem',
        backgroundColor: 'rgba(239,68,68,0.08)',
        color: '#f87171',
        borderRadius: 'var(--radius)',
        border: '1px solid rgba(239,68,68,0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}>
        <h3 style={{ margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>{info.icon}</span>
          <span>Generation Failed</span>
        </h3>
        <p style={{ margin: 0, fontSize: '0.875rem' }}>{generationError}</p>
        <p style={{ margin: 0, fontSize: '0.8125rem', color: 'rgba(248,113,113,0.7)' }}>{info.hint}</p>
        {showSettingsHint && (
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'rgba(248,113,113,0.6)', fontStyle: 'italic' }}>
            → Open <strong>Settings</strong> (top-right) to configure a provider.
          </p>
        )}
      </div>
    );
  }

  // ── Empty state ───────────────────────────────────────────────────────────
  if (scenarios.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '2rem', color: 'var(--text-muted)' }}>
        Paste a schema and click Generate.
      </div>
    );
  }

  // ── Grid ──────────────────────────────────────────────────────────────────
  const selectedCount = selectedScenarioIds.length;
  const allSelected = selectedCount === scenarios.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '100%' }}>
      {/* Selection toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        minHeight: '24px',
      }}>
        <span>
          {selectedCount === 0
            ? `${scenarios.length} scenario${scenarios.length !== 1 ? 's' : ''}`
            : `${selectedCount} of ${scenarios.length} selected for export`}
        </span>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={allSelected ? clearSelection : selectAllScenarios}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--accent-primary)', fontSize: '0.8rem', padding: 0,
            }}
          >
            {allSelected ? 'Clear all' : 'Select all'}
          </button>
          {selectedCount > 0 && !allSelected && (
            <button
              onClick={clearSelection}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-muted)', fontSize: '0.8rem', padding: 0,
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1rem',
        alignContent: 'start',
        overflowY: 'auto',
        flex: 1,
      }}>
        {scenarios.map((scenario) => (
          <ScenarioCard key={scenario.id} scenario={scenario} />
        ))}
      </div>
    </div>
  );
}
