'use client';

import React, { useMemo, useState } from 'react';
import { useMockForgeStore } from '@/lib/store';
import {
  formatAsJson,
  formatAsJsonFields,
  formatAsTypescript,
  formatAsJavaScript,
  formatAsPython,
  formatAsDart,
} from '@mockforge/formatters';

// ---------------------------------------------------------------------------
// Format definitions
// ---------------------------------------------------------------------------

type ExportFormat = 'json' | 'json-fields' | 'typescript' | 'javascript' | 'python' | 'dart';

interface FormatOption {
  value: ExportFormat;
  label: string;
  fileExt: string;
  mimeType: string;
  badge: string;
}

const FORMAT_OPTIONS: FormatOption[] = [
  { value: 'json',        label: 'JSON (full)',        fileExt: 'json', mimeType: 'application/json', badge: '{ }' },
  { value: 'json-fields', label: 'JSON (fields only)', fileExt: 'json', mimeType: 'application/json', badge: '{ }' },
  { value: 'typescript',  label: 'TypeScript',         fileExt: 'ts',   mimeType: 'text/typescript',  badge: 'TS'  },
  { value: 'javascript',  label: 'JavaScript',         fileExt: 'js',   mimeType: 'text/javascript',  badge: 'JS'  },
  { value: 'python',      label: 'Python',             fileExt: 'py',   mimeType: 'text/x-python',    badge: 'PY'  },
  { value: 'dart',        label: 'Dart',               fileExt: 'dart', mimeType: 'text/x-dart',      badge: '◆'   },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ExportPanel() {
  const { scenarios, exportFormat, setExportFormat } = useMockForgeStore();
  const [copied, setCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const current = FORMAT_OPTIONS.find(f => f.value === exportFormat) ?? FORMAT_OPTIONS[0]!;

  const formattedOutput = useMemo(() => {
    if (scenarios.length === 0) return '';

    switch (exportFormat) {
      case 'json':        return formatAsJson(scenarios);
      case 'json-fields': return formatAsJsonFields(scenarios);
      case 'typescript':  return formatAsTypescript(scenarios, 'MockSchema');
      case 'javascript':  return formatAsJavaScript(scenarios, 'MockSchema');
      case 'python':      return formatAsPython(scenarios);
      case 'dart':        return formatAsDart(scenarios);
      default:            return formatAsJson(scenarios);
    }
  }, [scenarios, exportFormat]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for environments without clipboard-write permission
      const el = document.createElement('textarea');
      el.value = formattedOutput;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([formattedOutput], { type: current.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mockforge-export.${current.fileExt}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSelect = (value: ExportFormat) => {
    setExportFormat(value);
    setDropdownOpen(false);
  };

  if (scenarios.length === 0) {
    return (
      <code style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
        // Export will appear here
      </code>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        
        {/* Format dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            id="export-format-trigger"
            onClick={() => setDropdownOpen(o => !o)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-accent)',
              color: 'var(--text-primary)',
              padding: '0.25rem 0.625rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.8125rem',
              fontFamily: 'var(--font-mono)',
              transition: 'border-color 0.15s ease',
            }}
          >
            {/* Coloured badge */}
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--accent-primary)',
              color: '#fff',
              borderRadius: '4px',
              padding: '1px 5px',
              fontSize: '0.6875rem',
              fontWeight: 700,
              letterSpacing: '0.03em',
            }}>
              {current.badge}
            </span>
            {current.label}
            <svg
              width="10" height="6"
              viewBox="0 0 10 6"
              style={{ opacity: 0.6, transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }}
            >
              <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
          </button>

          {dropdownOpen && (
            <>
              {/* Backdrop */}
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 9 }}
                onClick={() => setDropdownOpen(false)}
              />
              {/* Menu */}
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                zIndex: 10,
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                boxShadow: '0 12px 28px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.15)',
                minWidth: '180px',
                overflow: 'hidden',
                padding: '4px',
              }}>
                {FORMAT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      width: '100%',
                      background: opt.value === exportFormat ? 'rgba(124,58,237,0.15)' : 'transparent',
                      border: 'none',
                      color: opt.value === exportFormat ? 'var(--accent-primary)' : 'var(--text-primary)',
                      padding: '0.4rem 0.6rem',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '0.8125rem',
                      textAlign: 'left',
                      fontFamily: 'var(--font-sans)',
                      transition: 'background 0.1s ease',
                    }}
                    onMouseEnter={e => {
                      if (opt.value !== exportFormat)
                        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
                    }}
                    onMouseLeave={e => {
                      if (opt.value !== exportFormat)
                        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    }}
                  >
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: opt.value === exportFormat ? 'var(--accent-primary)' : 'var(--bg-surface)',
                      color: opt.value === exportFormat ? '#fff' : 'var(--text-muted)',
                      borderRadius: '4px',
                      padding: '1px 5px',
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      minWidth: '24px',
                      textAlign: 'center',
                    }}>
                      {opt.badge}
                    </span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            id="export-copy-btn"
            onClick={handleCopy}
            style={{
              background: copied ? 'rgba(16,185,129,0.15)' : 'var(--bg-elevated)',
              border: `1px solid ${copied ? 'rgba(16,185,129,0.4)' : 'var(--border)'}`,
              color: copied ? '#10b981' : 'var(--text-primary)',
              padding: '0.25rem 0.625rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.8125rem',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            {copied ? (
              <>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M8 4V2.5A1.5 1.5 0 006.5 1h-5A1.5 1.5 0 000 2.5v5A1.5 1.5 0 001.5 9H3" stroke="currentColor" strokeWidth="1.2" />
                </svg>
                Copy
              </>
            )}
          </button>

          <button
            id="export-download-btn"
            onClick={handleDownload}
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              padding: '0.25rem 0.625rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.8125rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              transition: 'border-color 0.15s ease',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1v7m0 0L3.5 5.5M6 8l2.5-2.5M1 10h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            Download .{current.fileExt}
          </button>
        </div>
      </div>

      {/* Code output */}
      <pre style={{
        flex: 1,
        margin: 0,
        backgroundColor: 'transparent',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.8125rem',
        color: '#d4d4d4',
        overflow: 'auto',
        minHeight: 0,
        lineHeight: 1.6,
      }}>
        {formattedOutput}
      </pre>
    </div>
  );
}
