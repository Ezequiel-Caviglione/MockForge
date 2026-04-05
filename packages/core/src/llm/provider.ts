import OpenAI from 'openai'
import type { LLMProvider, ProviderConfig, ProviderState } from './types.js'
import { RateLimitError } from './types.js'

// ---------------------------------------------------------------------------
// Base provider adapter — shared by all OpenAI-compatible endpoints
// ---------------------------------------------------------------------------

/**
 * A single LLM provider backed by the `openai` SDK.
 * Changing the provider is just changing `baseURL` + `apiKey` + `model`.
 */
export class OpenAICompatibleProvider implements LLMProvider {
  private readonly client: OpenAI

  readonly state: ProviderState

  constructor(config: ProviderConfig) {
    this.client = new OpenAI({
      baseURL: config.baseURL,
      apiKey: config.apiKey,
      defaultHeaders: config.name === 'openrouter'
        ? {
          'HTTP-Referer': 'https://mockforge.dev',
          'X-Title': 'MockForge',
        }
        : undefined,
    })

    this.state = {
      config,
      lastUsedAt: 0,
      rateLimitedUntil: 0,
      successCount: 0,
      errorCount: 0,
    }
  }

  async complete(prompt: string, systemPrompt?: string): Promise<string> {
    this.state.lastUsedAt = Date.now()

    try {
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = []

      if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt })
      }
      messages.push({ role: 'user', content: prompt })

      console.log(`[Testing] Llamada al LLM iniciada - baseURL: ${this.state.config.baseURL} | modelo: ${this.state.config.model}`);

      const response = await this.client.chat.completions.create({
        model: this.state.config.model,
        messages,
        temperature: 0.3,
        max_tokens: 8192,
      })

      const content = response.choices[0]?.message.content ?? ''
      this.state.successCount++
      return content
    } catch (err: unknown) {
      console.error(`[Testing] Error en ${this.state.config.name}:`, err instanceof Error ? err.message : err);
      this.state.errorCount++

      // Detect rate limiting
      if (isRateLimitError(err)) {
        const retryAfter = extractRetryAfter(err)
        this.state.rateLimitedUntil = Date.now() + (retryAfter ?? 60_000)
        throw new RateLimitError(this.state.config.name, retryAfter)
      }

      throw err
    }
  }
}

// ---------------------------------------------------------------------------
// Error detection helpers
// ---------------------------------------------------------------------------

function isRateLimitError(err: unknown): boolean {
  if (typeof err !== 'object' || err === null) return false
  const obj = err as Record<string, unknown>
  return obj['status'] === 429 ||
    (typeof obj['message'] === 'string' && obj['message'].includes('rate limit'))
}

function extractRetryAfter(err: unknown): number | undefined {
  if (typeof err !== 'object' || err === null) return undefined
  const obj = err as Record<string, unknown>
  const headers = obj['headers'] as Record<string, string> | undefined
  if (!headers) return undefined
  const raw = headers['retry-after'] ?? headers['Retry-After']
  if (!raw) return undefined
  const secs = parseFloat(raw)
  return isNaN(secs) ? undefined : secs * 1000
}
