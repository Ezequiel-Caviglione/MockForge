import { OpenAICompatibleProvider } from '../provider.js'
import type { ProviderConfig } from '../types.js'

// ---------------------------------------------------------------------------
// Groq provider factory
// Very low latency, generous free tier (~30 RPM, ~14,400 RPD)
// ---------------------------------------------------------------------------

export const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'gemma2-9b-it',
] as const

export type GroqModel = (typeof GROQ_MODELS)[number]

export function createGroqProvider(
  apiKey: string,
  model: GroqModel = 'llama-3.3-70b-versatile',
): OpenAICompatibleProvider {
  const config: ProviderConfig = {
    name: 'groq',
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey,
    model,
    maxRPM: 30,
  }
  return new OpenAICompatibleProvider(config)
}
