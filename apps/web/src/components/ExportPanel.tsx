'use client';

import React, { useMemo } from 'react';
import { useMockForgeStore } from '@/lib/store';
import { formatAsJson, formatAsTypescript } from '@mockforge/formatters';

export default function ExportPanel() {
  const { scenarios, exportFormat } = useMockForgeStore();
  
  const formattedOutput = useMemo(() => {
    if (scenarios.length === 0) return '';
    
    if (exportFormat === 'json') {
      return formatAsJson(scenarios);
    } else {
      // Temporary fallback for typescript until we hook it up easily
      return formatAsTypescript(scenarios, 'MockSchema');
    }
  }, [scenarios, exportFormat]);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedOutput);
  };

  const handleDownload = () => {
    const blob = new Blob([formattedOutput], { type: exportFormat === 'json' ? 'application/json' : 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mockforge-export.${exportFormat === 'json' ? 'json' : 'ts'}`;
    a.click();
    URL.revokeObjectURL(url);
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <button 
          onClick={handleCopy}
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}
        >
          Copy
        </button>
        <button 
          onClick={handleDownload}
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}
        >
          Download
        </button>
      </div>
      <pre style={{ 
        flex: 1,
        margin: 0,
        backgroundColor: 'transparent', 
        fontFamily: 'var(--font-mono)',
        fontSize: '0.875rem',
        color: '#d4d4d4',
        overflow: 'auto',
        minHeight: 0
      }}>
        {formattedOutput}
      </pre>
    </div>
  );
}
