import type { LLMProvider } from './types.js';
/**
 * Routes LLM completions across multiple providers.
 * Strategy: round-robin, skipping providers that are in rate-limit backoff.
 * When a provider returns a 429, it's marked with a cooldown and the
 * next available provider is tried automatically.
 */
export declare class ProviderRouter {
    private providers;
    private currentIndex;
    constructor(providers: LLMProvider[]);
    /**
     * Sends a prompt through the next available provider.
     * Throws {@link AllProvidersExhaustedError} if no provider can handle it.
     */
    complete(prompt: string, systemPrompt?: string): Promise<string>;
    /** Returns the current health status of all providers */
    getStatus(): Array<{
        name: string;
        model: string;
        available: boolean;
        rateLimitedUntil: number | undefined;
        successCount: number;
        errorCount: number;
    }>;
    /** Adds a provider at the front of the rotation (for user-provided keys) */
    prepend(provider: LLMProvider): void;
    /** Returns total provider count */
    get size(): number;
}
//# sourceMappingURL=router.d.ts.map