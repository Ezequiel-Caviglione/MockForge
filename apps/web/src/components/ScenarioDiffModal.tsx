'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { Scenario } from '@mockforge/core';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DiffEntry {
  key: string;
  baseValue: unknown;
  compareValue: unknown;
  status: 'identical' | 'changed' | 'base-only' | 'compare-only';
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildDiff(base: Scenario, compare: Scenario): DiffEntry[] {
  const allKeys = new Set([
    ...Object.keys(base.fields),
    ...Object.keys(compare.fields),
  ]);

  return Array.from(allKeys).map((key) => {
    const hasBase = key in base.fields;
    const hasCompare = key in compare.fields;
    const baseValue = base.fields[key];
    const compareValue = compare.fields[key];

    let status: DiffEntry['status'];
    if (!hasBase) status = 'compare-only';
    else if (!hasCompare) status = 'base-only';
    else if (JSON.stringify(baseValue) === JSON.stringify(compareValue)) status = 'identical';
    else status = 'changed';

    return { key, baseValue: hasBase ? baseValue : undefined, compareValue: hasCompare ? compareValue : undefined, status };
  });
}

function ValueCell({ value, missing }: { value: unknown; missing?: boolean }) {
  if (missing) {
    return (
      <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>—</span>
    );
  }
  return (
    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', wordBreak: 'break-word' }}>
      {JSON.stringify(value)}
    </code>
  );
}

// ---------------------------------------------------------------------------
// Status colours
// ---------------------------------------------------------------------------

const STATUS_STYLES: Record<DiffEntry['status'], { bg: string; label: string; color: string }> = {
  identical:    { bg: 'transparent',            label: '=',  color: 'var(--text-muted)' },
  changed:      { bg: 'rgba(245,158,11,0.08)',  label: '~',  color: '#f59e0b' },
  'base-only':  { bg: 'rgba(16,185,129,0.08)',  label: '+',  color: '#10b981' },
  'compare-only':{ bg: 'rgba(239,68,68,0.08)', label: '-',  color: '#ef4444' },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface ScenarioDiffModalProps {
  baseScenario: Scenario;
  allScenarios: Scenario[];
  onClose: () => void;
}

export default function ScenarioDiffModal({
  baseScenario,
  allScenarios,
  onClose,
}: ScenarioDiffModalProps) {
  const others = allScenarios.filter((s) => s.id !== baseScenario.id);
  const [compareId, setCompareId] = useState<string>(others[0]?.id ?? '');
  const [hideIdentical, setHideIdentical] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const compareScenario = allScenarios.find((s) => s.id === compareId);
  const diff = compareScenario ? buildDiff(baseScenario, compareScenario) : [];
  const visible = hideIdentical ? diff.filter((d) => d.status !== 'identical') : diff;

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const identicalCount = diff.filter(d => d.status === 'identical').length;
  const changedCount = diff.filter(d => d.status !== 'identical').length;

  return (
    /* Backdrop */
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        backgroundColor: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal */}
      <div
        ref={dialogRef}
        style={{
          width: '100%', maxWidth: '900px', maxHeight: '90vh',
          backgroundColor: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          boxShadow: '0 24px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.2)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '0.875rem 1.25rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}>
          {/* Row 1: title + close — never wraps */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', minWidth: 0 }}>
            <span style={{ fontWeight: 600, fontSize: '0.95rem', whiteSpace: 'nowrap' }}>
              Compare Scenarios
            </span>
            <button
              onClick={onClose}
              style={{
                flexShrink: 0,
                background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--text-muted)', borderRadius: '6px',
                padding: '0.25rem 0.5rem', cursor: 'pointer', fontSize: '0.875rem',
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>

          {/* Row 2: stats + hide-identical toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
            {compareScenario ? (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {changedCount} difference{changedCount !== 1 ? 's' : ''}
                {identicalCount > 0 && ` · ${identicalCount} identical`}
              </span>
            ) : (
              <span />
            )}
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              <input
                type="checkbox"
                checked={hideIdentical}
                onChange={(e) => setHideIdentical(e.target.checked)}
                style={{ accentColor: 'var(--accent-primary)' }}
              />
              Hide identical
            </label>
          </div>
        </div>

        {/* Scenario labels + compare selector */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--bg-surface)',
        }}>
          {/* Base label */}
          <div style={{ padding: '0.6rem 1rem', borderRight: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Base</span>
            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem', color: '#10b981' }}>
              {baseScenario.name}
            </p>
          </div>

          {/* Compare selector */}
          <div style={{ padding: '0.6rem 1rem' }}>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Compare with</span>
            <select
              value={compareId}
              onChange={(e) => setCompareId(e.target.value)}
              style={{
                display: 'block', width: '100%', marginTop: '2px',
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                color: 'var(--text-primary)', borderRadius: '4px',
                padding: '0.2rem 0.4rem', fontSize: '0.875rem',
                fontFamily: 'var(--font-sans)', cursor: 'pointer',
              }}
            >
              {others.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Diff table */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {!compareScenario ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Select a scenario to compare.
            </div>
          ) : visible.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No differences to show.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8375rem' }}>
              <tbody>
                {visible.map((entry) => {
                  const style = STATUS_STYLES[entry.status];
                  return (
                    <tr
                      key={entry.key}
                      style={{ backgroundColor: style.bg, borderBottom: '1px solid var(--border)' }}
                    >
                      {/* Status badge */}
                      <td style={{ padding: '0.5rem 0.75rem', width: '24px', textAlign: 'center', color: style.color, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                        {style.label}
                      </td>
                      {/* Field key */}
                      <td style={{ padding: '0.5rem 0.75rem', width: '160px', color: style.color, fontFamily: 'var(--font-mono)', fontSize: '0.8rem', verticalAlign: 'top', fontWeight: entry.status !== 'identical' ? 600 : 400 }}>
                        {entry.key}
                      </td>
                      {/* Base value */}
                      <td style={{ padding: '0.5rem 0.75rem', borderLeft: '1px solid var(--border)', verticalAlign: 'top', color: 'var(--text-primary)', width: '50%' }}>
                        <ValueCell value={entry.baseValue} missing={entry.status === 'compare-only'} />
                      </td>
                      {/* Compare value */}
                      <td style={{ padding: '0.5rem 0.75rem', borderLeft: '1px solid var(--border)', verticalAlign: 'top', color: 'var(--text-primary)', width: '50%' }}>
                        <ValueCell value={entry.compareValue} missing={entry.status === 'base-only'} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Legend */}
        <div style={{
          borderTop: '1px solid var(--border)',
          padding: '0.6rem 1rem',
          display: 'flex', gap: '1.25rem', flexWrap: 'wrap',
          backgroundColor: 'var(--bg-surface)',
        }}>
          {Object.entries(STATUS_STYLES).map(([status, { label, color }]) => (
            <span key={status} style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ color, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{label}</span>
              {status === 'identical' ? 'Identical' : status === 'changed' ? 'Changed' : status === 'base-only' ? 'Base only' : 'Compare only'}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
