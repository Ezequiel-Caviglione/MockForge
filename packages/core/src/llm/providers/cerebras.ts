import { OpenAICompatibleProvider } from '../provider.js'
import type { ProviderConfig } from '../types.js'

// ---------------------------------------------------------------------------
// Cerebras provider factory
// Ultra-low latency inference (~30 RPM, H100 clusters)
// ---------------------------------------------------------------------------

export const CEREBRAS_MODELS = [
  'llama3.1-8b',
] as const

export type CerebrasModel = (typeof CEREBRAS_MODELS)[number]

export function createCerebrasProvider(
  apiKey: string,
  model: CerebrasModel = 'llama3.1-8b',
): OpenAICompatibleProvider {
  const config: ProviderConfig = {
    name: 'cerebras',
    baseURL: 'https://api.cerebras.ai/v1',
    apiKey,
    model,
    maxRPM: 30,
  }
  return new OpenAICompatibleProvider(config)
}
