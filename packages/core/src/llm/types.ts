// ---------------------------------------------------------------------------
// LLM Provider types
// ---------------------------------------------------------------------------

/** Configuration for a single LLM provider */
export interface ProviderConfig {
  name: string
  baseURL: string
  apiKey: string
  model: string
  /** Max requests per minute (for backoff calculation) */
  maxRPM?: number
}

/** Runtime state tracked per provider */
export interface ProviderState {
  config: ProviderConfig
  /** Timestamp (ms) when the provider was last used */
  lastUsedAt: number
  /** Timestamp (ms) until which the provider is in backoff */
  rateLimitedUntil: number
  successCount: number
  errorCount: number
}

/** Minimal interface every provider adapter must implement */
export interface LLMProvider {
  readonly state: ProviderState
  /**
   * Sends a prompt and returns the model's text response.
   * Should throw on any error (rate limit included — router will catch).
   */
  complete(prompt: string, systemPrompt?: string): Promise<string>
}

/** Error thrown when all providers are exhausted */
export class AllProvidersExhaustedError extends Error {
  constructor(public readonly providerErrors: Array<{ provider: string; error: string }>) {
    super(
      `All LLM providers exhausted. Errors:\n${providerErrors
        .map(e => `  • ${e.provider}: ${e.error}`)
        .join('\n')}`,
    )
    this.name = 'AllProvidersExhaustedError'
  }
}

/** Error thrown when a provider hits a rate limit (429) */
export class RateLimitError extends Error {
  constructor(public readonly provider: string, public readonly retryAfterMs?: number) {
    super(`Rate limited by ${provider}`)
    this.name = 'RateLimitError'
  }
}
