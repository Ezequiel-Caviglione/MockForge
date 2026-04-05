/** Configuration for a single LLM provider */
export interface ProviderConfig {
    name: string;
    baseURL: string;
    apiKey: string;
    model: string;
    /** Max requests per minute (for backoff calculation) */
    maxRPM?: number;
}
/** Runtime state tracked per provider */
export interface ProviderState {
    config: ProviderConfig;
    /** Timestamp (ms) when the provider was last used */
    lastUsedAt: number;
    /** Timestamp (ms) until which the provider is in backoff */
    rateLimitedUntil: number;
    successCount: number;
    errorCount: number;
}
/** Minimal interface every provider adapter must implement */
export interface LLMProvider {
    readonly state: ProviderState;
    /**
     * Sends a prompt and returns the model's text response.
     * Should throw on any error (rate limit included — router will catch).
     */
    complete(prompt: string, systemPrompt?: string): Promise<string>;
}
/** Error thrown when all providers are exhausted */
export declare class AllProvidersExhaustedError extends Error {
    readonly providerErrors: Array<{
        provider: string;
        error: string;
    }>;
    constructor(providerErrors: Array<{
        provider: string;
        error: string;
    }>);
}
/** Error thrown when a provider hits a rate limit (429) */
export declare class RateLimitError extends Error {
    readonly provider: string;
    readonly retryAfterMs?: number | undefined;
    constructor(provider: string, retryAfterMs?: number | undefined);
}
//# sourceMappingURL=types.d.ts.map