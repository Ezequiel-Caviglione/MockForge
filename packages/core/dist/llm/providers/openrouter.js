import { OpenAICompatibleProvider } from '../provider.js';
// ---------------------------------------------------------------------------
// OpenRouter provider factory
// Free models: openrouter/free
// ---------------------------------------------------------------------------
export const OPENROUTER_FREE_MODELS = [
    'openrouter/free',
];
export function createOpenRouterProvider(apiKey, model = 'openrouter/free') {
    const config = {
        name: 'openrouter',
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey,
        model,
        maxRPM: 20,
    };
    return new OpenAICompatibleProvider(config);
}
//# sourceMappingURL=openrouter.js.map