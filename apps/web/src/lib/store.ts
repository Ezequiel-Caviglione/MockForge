import { create } from 'zustand';
import type { Scenario } from '@mockforge/core';

interface MockForgeStore {
  // Input
  schemaText: string;
  inputFormat: 'json-schema' | 'raw-json';
  setSchemaText: (text: string) => void;
  setInputFormat: (format: 'json-schema' | 'raw-json') => void;
  
  // Output
  scenarios: Scenario[];
  isGenerating: boolean;
  generationError: string | null;
  aiUsed: boolean;
  
  // Export
  exportFormat: 'json' | 'json-fields' | 'typescript' | 'javascript' | 'python' | 'dart';
  setExportFormat: (format: 'json' | 'json-fields' | 'typescript' | 'javascript' | 'python' | 'dart') => void;

  
  // API Settings
  useCustomProvider: boolean;
  setUseCustomProvider: (use: boolean) => void;
  customProvider: {
    baseURL?: string;
    apiKey?: string;
    model?: string;
  };
  setCustomProviderField: (field: 'baseURL' | 'apiKey' | 'model', value: string) => void;
  
  // Actions
  generateScenarios: () => Promise<void>;
}

export const useMockForgeStore = create<MockForgeStore>((set, get) => ({
  schemaText: `interface User {
  id: string;
  name: string;
  role: 'admin' | 'user' | 'guest';
  deletedAt?: string;
}`,
  inputFormat: 'json-schema',
  setSchemaText: (text) => set({ schemaText: text }),
  setInputFormat: (format) => set({ inputFormat: format }),

  scenarios: [],
  isGenerating: false,
  generationError: null,
  aiUsed: false,

  exportFormat: 'json',
  setExportFormat: (format) => set({ exportFormat: format }),

  useCustomProvider: false,
  setUseCustomProvider: (useCustomProvider) => set({ useCustomProvider }),
  
  customProvider: {},
  setCustomProviderField: (field, value) => set((state) => ({ 
    customProvider: { ...state.customProvider, [field]: value } 
  })),

  generateScenarios: async () => {
    const { schemaText, useCustomProvider, customProvider } = get();
    
    set({ isGenerating: true, generationError: null });
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          schema: schemaText,
          customProvider: useCustomProvider ? customProvider : undefined
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      set({ scenarios: data.scenarios, aiUsed: !!data.metadata?.aiUsed, isGenerating: false });
    } catch (error: any) {
      set({ generationError: error.message, isGenerating: false });
    }
  }
}));
