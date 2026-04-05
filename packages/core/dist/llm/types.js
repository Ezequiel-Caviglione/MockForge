// ---------------------------------------------------------------------------
// LLM Provider types
// ---------------------------------------------------------------------------
/** Error thrown when all providers are exhausted */
export class AllProvidersExhaustedError extends Error {
    providerErrors;
    constructor(providerErrors) {
        super(`All LLM providers exhausted. Errors:\n${providerErrors
            .map(e => `  • ${e.provider}: ${e.error}`)
            .join('\n')}`);
        this.providerErrors = providerErrors;
        this.name = 'AllProvidersExhaustedError';
    }
}
/** Error thrown when a provider hits a rate limit (429) */
export class RateLimitError extends Error {
    provider;
    retryAfterMs;
    constructor(provider, retryAfterMs) {
        super(`Rate limited by ${provider}`);
        this.provider = provider;
        this.retryAfterMs = retryAfterMs;
        this.name = 'RateLimitError';
    }
}
//# sourceMappingURL=types.js.map