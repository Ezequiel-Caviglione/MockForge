import { AllProvidersExhaustedError, RateLimitError } from './types.js';
// ---------------------------------------------------------------------------
// ProviderRouter — Round-robin with automatic rate-limit backoff
// ---------------------------------------------------------------------------
/**
 * Routes LLM completions across multiple providers.
 * Strategy: round-robin, skipping providers that are in rate-limit backoff.
 * When a provider returns a 429, it's marked with a cooldown and the
 * next available provider is tried automatically.
 */
export class ProviderRouter {
    providers;
    currentIndex = 0;
    constructor(providers) {
        if (providers.length === 0) {
            throw new Error('ProviderRouter requires at least one provider');
        }
        this.providers = providers;
    }
    /**
     * Sends a prompt through the next available provider.
     * Throws {@link AllProvidersExhaustedError} if no provider can handle it.
     */
    async complete(prompt, systemPrompt) {
        const errors = [];
        const now = Date.now();
        // Try each provider once, round-robin starting from currentIndex
        for (let attempt = 0; attempt < this.providers.length; attempt++) {
            const idx = (this.currentIndex + attempt) % this.providers.length;
            const provider = this.providers[idx];
            // Skip if in backoff
            if (provider.state.rateLimitedUntil > now) {
                const remainingMs = provider.state.rateLimitedUntil - now;
                errors.push({
                    provider: provider.state.config.name,
                    error: `Rate limited for ${Math.ceil(remainingMs / 1000)}s more`,
                });
                continue;
            }
            try {
                const result = await provider.complete(prompt, systemPrompt);
                // Advance index after success for round-robin
                this.currentIndex = (idx + 1) % this.providers.length;
                return result;
            }
            catch (err) {
                if (err instanceof RateLimitError) {
                    // Backoff already set by the provider adapter
                    errors.push({
                        provider: provider.state.config.name,
                        error: `Rate limited (retry after ${Math.ceil((err.retryAfterMs ?? 60_000) / 1000)}s)`,
                    });
                    continue;
                }
                // Real error — record and try next
                errors.push({
                    provider: provider.state.config.name,
                    error: err instanceof Error ? err.message : String(err),
                });
                continue;
            }
        }
        throw new AllProvidersExhaustedError(errors);
    }
    /** Returns the current health status of all providers */
    getStatus() {
        const now = Date.now();
        return this.providers.map(p => ({
            name: p.state.config.name,
            model: p.state.config.model,
            available: p.state.rateLimitedUntil <= now,
            rateLimitedUntil: p.state.rateLimitedUntil > now ? p.state.rateLimitedUntil : undefined,
            successCount: p.state.successCount,
            errorCount: p.state.errorCount,
        }));
    }
    /** Adds a provider at the front of the rotation (for user-provided keys) */
    prepend(provider) {
        this.providers = [provider, ...this.providers];
    }
    /** Returns total provider count */
    get size() {
        return this.providers.length;
    }
}
//# sourceMappingURL=router.js.map