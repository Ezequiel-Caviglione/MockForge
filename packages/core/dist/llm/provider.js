import OpenAI from 'openai';
import { RateLimitError } from './types.js';
// ---------------------------------------------------------------------------
// Base provider adapter — shared by all OpenAI-compatible endpoints
// ---------------------------------------------------------------------------
/**
 * A single LLM provider backed by the `openai` SDK.
 * Changing the provider is just changing `baseURL` + `apiKey` + `model`.
 */
export class OpenAICompatibleProvider {
    client;
    state;
    constructor(config) {
        this.client = new OpenAI({
            baseURL: config.baseURL,
            apiKey: config.apiKey,
            defaultHeaders: config.name === 'openrouter'
                ? {
                    'HTTP-Referer': 'https://mockforge.dev',
                    'X-Title': 'MockForge',
                }
                : undefined,
        });
        this.state = {
            config,
            lastUsedAt: 0,
            rateLimitedUntil: 0,
            successCount: 0,
            errorCount: 0,
        };
    }
    async complete(prompt, systemPrompt) {
        this.state.lastUsedAt = Date.now();
        try {
            const messages = [];
            if (systemPrompt) {
                messages.push({ role: 'system', content: systemPrompt });
            }
            messages.push({ role: 'user', content: prompt });
            console.log(`[Testing] Llamada al LLM iniciada - baseURL: ${this.state.config.baseURL} | modelo: ${this.state.config.model}`);
            const response = await this.client.chat.completions.create({
                model: this.state.config.model,
                messages,
                temperature: 0.3,
                max_tokens: 8192,
            });
            const content = response.choices[0]?.message.content ?? '';
            this.state.successCount++;
            return content;
        }
        catch (err) {
            console.error(`[Testing] Error en ${this.state.config.name}:`, err instanceof Error ? err.message : err);
            this.state.errorCount++;
            // Detect rate limiting
            if (isRateLimitError(err)) {
                const retryAfter = extractRetryAfter(err);
                this.state.rateLimitedUntil = Date.now() + (retryAfter ?? 60_000);
                throw new RateLimitError(this.state.config.name, retryAfter);
            }
            throw err;
        }
    }
}
// ---------------------------------------------------------------------------
// Error detection helpers
// ---------------------------------------------------------------------------
function isRateLimitError(err) {
    if (typeof err !== 'object' || err === null)
        return false;
    const obj = err;
    return obj['status'] === 429 ||
        (typeof obj['message'] === 'string' && obj['message'].includes('rate limit'));
}
function extractRetryAfter(err) {
    if (typeof err !== 'object' || err === null)
        return undefined;
    const obj = err;
    const headers = obj['headers'];
    if (!headers)
        return undefined;
    const raw = headers['retry-after'] ?? headers['Retry-After'];
    if (!raw)
        return undefined;
    const secs = parseFloat(raw);
    return isNaN(secs) ? undefined : secs * 1000;
}
//# sourceMappingURL=provider.js.map