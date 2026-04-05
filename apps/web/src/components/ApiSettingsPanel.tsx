'use client';

import React, { useState } from 'react';
import { useMockForgeStore } from '@/lib/store';

export default function ApiSettingsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { useCustomProvider, setUseCustomProvider, customProvider, setCustomProviderField } = useMockForgeStore();

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          background: useCustomProvider ? 'var(--accent-glow)' : 'transparent', 
          border: `1px solid ${useCustomProvider ? 'var(--accent-primary)' : 'var(--border)'}`, 
          color: useCustomProvider ? 'var(--text-primary)' : 'var(--text-muted)', 
          padding: '0.5rem 1rem', 
          borderRadius: '4px', 
          cursor: 'pointer',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        ⚙️ Settings {useCustomProvider && '✨'}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 0.5rem)',
          right: 0,
          width: '320px',
          backgroundColor: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '1.5rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
          zIndex: 50
        }}>
          <h3 style={{ margin: '0 0 1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Custom LLM Inference</span>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input 
                type="checkbox"
                id="enableCustomProviderCheck"
                name="enableCustomProviderCheck"
                checked={useCustomProvider} 
                onChange={(e) => setUseCustomProvider(e.target.checked)} 
                style={{ marginRight: '0.5rem' }}
              />
              Enable
            </label>
          </h3>
          
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Bypass the server default models and supply your own OpenAI-compatible endpoint.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', opacity: useCustomProvider ? 1 : 0.5, pointerEvents: useCustomProvider ? 'auto' : 'none' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                Base URL
              </label>
              <input 
                type="text"
                id="customConfigBaseUrl"
                name="customConfigBaseUrl"
                autoComplete="off"
                placeholder="https://openrouter.ai/api/v1" 
                value={customProvider.baseURL || ''}
                onChange={(e) => setCustomProviderField('baseURL', e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.5rem', 
                  backgroundColor: 'var(--bg-base)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '4px',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                API Key
              </label>
              <input 
                type="password"
                id="customConfigApiKey"
                name="customConfigApiKey"
                autoComplete="new-password"
                placeholder="sk-..." 
                value={customProvider.apiKey || ''}
                onChange={(e) => setCustomProviderField('apiKey', e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.5rem', 
                  backgroundColor: 'var(--bg-base)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '4px',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                Model
              </label>
              <input 
                type="text"
                id="customConfigModel"
                name="customConfigModel"
                autoComplete="off"
                placeholder="google/gemini-2.0-flash-lite-preview-02-05:free" 
                value={customProvider.model || ''}
                onChange={(e) => setCustomProviderField('model', e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.5rem', 
                  backgroundColor: 'var(--bg-base)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '4px',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)'
                }}
              />
            </div>
            
            <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Credentials remain locally stored in your browser session.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
