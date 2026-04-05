import { OpenAICompatibleProvider } from '../provider.js'
import type { ProviderConfig } from '../types.js'

// ---------------------------------------------------------------------------
// OpenRouter provider factory
// Free models: gemini-2.0-flash-exp, deepseek-r1, llama-3.3-70b
// ---------------------------------------------------------------------------

export const OPENROUTER_FREE_MODELS = [
  'openrouter/free',
] as const

export type OpenRouterFreeModel = (typeof OPENROUTER_FREE_MODELS)[number]

export function createOpenRouterProvider(
  apiKey: string,
  model: OpenRouterFreeModel = 'openrouter/free',
): OpenAICompatibleProvider {
  const config: ProviderConfig = {
    name: 'openrouter',
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey,
    model,
    maxRPM: 20,
  }
  return new OpenAICompatibleProvider(config)
}
