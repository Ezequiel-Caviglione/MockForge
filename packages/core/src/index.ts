// ---------------------------------------------------------------------------
// @mockforge/core — Public API
// ---------------------------------------------------------------------------

// Domain types
export type {
  Schema,
  SchemaField,
  FieldType,
  Scenario,
  ScenarioTag,
  AnalysisResult,
  FieldRelationship,
  GeneratorConfig,
} from './types.js'

// AI Generator
export { generateAiScenarios } from './scenario-engine/ai-generator.js'

// LLM layer
export type { ProviderConfig, ProviderState, LLMProvider } from './llm/types.js'
export { AllProvidersExhaustedError, RateLimitError } from './llm/types.js'
export { OpenAICompatibleProvider } from './llm/provider.js'
export { ProviderRouter } from './llm/router.js'

// Provider factories
export { createOpenRouterProvider, OPENROUTER_FREE_MODELS } from './llm/providers/openrouter.js'
export { createGroqProvider, GROQ_MODELS } from './llm/providers/groq.js'
export { createCerebrasProvider, CEREBRAS_MODELS } from './llm/providers/cerebras.js'

// ---------------------------------------------------------------------------
// Convenience: full pipeline function
// ---------------------------------------------------------------------------

import type { Scenario } from './types.js'
import { generateAiScenarios } from './scenario-engine/ai-generator.js'
import type { ProviderRouter } from './llm/router.js'

export interface GenerateMocksOptions {
  router: ProviderRouter
  signal?: AbortSignal
}

export interface GenerateMocksResult {
  scenarios: Scenario[]
  aiUsed: boolean
  duration: number
}

/**
 * Full MockForge pipeline (Pure AI Generation):
 * Parses any raw code string and uses LLM routing to extract scenarios.
 */
export async function generateMocks(
  codeModel: string,
  options: GenerateMocksOptions,
): Promise<GenerateMocksResult> {
  const start = Date.now()

  const scenarios = await generateAiScenarios(
    codeModel,
    options.router,
    options.signal
  )

  return {
    scenarios,
    aiUsed: true,
    duration: Date.now() - start,
  }
}
