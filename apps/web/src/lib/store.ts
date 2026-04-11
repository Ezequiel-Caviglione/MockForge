import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Scenario } from '@mockforge/core';

// ---------------------------------------------------------------------------
// Error codes
// ---------------------------------------------------------------------------

export type GenerationErrorCode =
  | 'RATE_LIMITED'
  | 'AUTH_ERROR'
  | 'NO_PROVIDERS'
  | 'PARSE_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN';

// ---------------------------------------------------------------------------
// Export formats
// ---------------------------------------------------------------------------

export type ExportFormat = 'json' | 'json-fields' | 'typescript' | 'javascript' | 'python' | 'dart' | 'msw';

// ---------------------------------------------------------------------------
// Store interface
// ---------------------------------------------------------------------------

interface MockForgeStore {
  // Input
  schemaText: string;
  setSchemaText: (text: string) => void;

  // Output
  scenarios: Scenario[];
  isGenerating: boolean;
  generationError: string | null;
  generationErrorCode: GenerationErrorCode | null;
  aiUsed: boolean;

  // Scenario selection (for export)
  selectedScenarioIds: string[];
  toggleScenarioSelection: (id: string) => void;
  clearSelection: () => void;
  selectAllScenarios: () => void;

  // Export
  exportFormat: ExportFormat;
  setExportFormat: (format: ExportFormat) => void;
  mswEndpoint: string;
  setMswEndpoint: (endpoint: string) => void;

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

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useMockForgeStore = create<MockForgeStore>()(
  persist(
    (set, get) => ({
      schemaText: `interface User {\n  id: string;\n  name: string;\n  role: 'admin' | 'user' | 'guest';\n  deletedAt?: string;\n}`,
      setSchemaText: (text) => set({ schemaText: text }),

      scenarios: [],
      isGenerating: false,
      generationError: null,
      generationErrorCode: null,
      aiUsed: false,

      selectedScenarioIds: [],
      toggleScenarioSelection: (id) =>
        set((state) => ({
          selectedScenarioIds: state.selectedScenarioIds.includes(id)
            ? state.selectedScenarioIds.filter((s) => s !== id)
            : [...state.selectedScenarioIds, id],
        })),
      clearSelection: () => set({ selectedScenarioIds: [] }),
      selectAllScenarios: () =>
        set((state) => ({ selectedScenarioIds: state.scenarios.map((s) => s.id) })),

      exportFormat: 'json',
      setExportFormat: (format) => set({ exportFormat: format }),
      mswEndpoint: '/api/resource',
      setMswEndpoint: (endpoint) => set({ mswEndpoint: endpoint }),

      useCustomProvider: false,
      setUseCustomProvider: (useCustomProvider) => set({ useCustomProvider }),

      customProvider: {},
      setCustomProviderField: (field, value) =>
        set((state) => ({
          customProvider: { ...state.customProvider, [field]: value },
        })),

      generateScenarios: async () => {
        const { schemaText, useCustomProvider, customProvider } = get();

        set({ isGenerating: true, generationError: null, generationErrorCode: null });

        try {
          const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              schema: schemaText,
              customProvider: useCustomProvider ? customProvider : undefined,
            }),
          });

          const data = await response.json().catch(() => ({ error: 'Unknown error' }));

          if (!response.ok) {
            set({
              generationError: data.error || `HTTP ${response.status}`,
              generationErrorCode: (data.code as GenerationErrorCode) ?? 'UNKNOWN',
              isGenerating: false,
            });
            return;
          }

          set({
            scenarios: data.scenarios,
            selectedScenarioIds: [],        // clear selection on new generation
            aiUsed: !!data.metadata?.aiUsed,
            isGenerating: false,
          });
        } catch (error: unknown) {
          set({
            generationError: 'Network error. Check your connection and try again.',
            generationErrorCode: 'NETWORK_ERROR',
            isGenerating: false,
          });
        }
      },
    }),
    {
      name: 'mockforge-v1',
      storage: createJSONStorage(() => localStorage),
      // Only persist user-facing, non-sensitive, non-ephemeral state
      partialize: (state) => ({
        schemaText: state.schemaText,
        scenarios: state.scenarios,
        exportFormat: state.exportFormat,
        mswEndpoint: state.mswEndpoint,
      }),
      skipHydration: true,   // manual rehydration after mount to avoid SSR mismatch
    }
  )
);
