import type { LLMProvider, ProviderConfig, ProviderState } from './types.js';
/**
 * A single LLM provider backed by the `openai` SDK.
 * Changing the provider is just changing `baseURL` + `apiKey` + `model`.
 */
export declare class OpenAICompatibleProvider implements LLMProvider {
    private readonly client;
    readonly state: ProviderState;
    constructor(config: ProviderConfig);
    complete(prompt: string, systemPrompt?: string): Promise<string>;
}
//# sourceMappingURL=provider.d.ts.map