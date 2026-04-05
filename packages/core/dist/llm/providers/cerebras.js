import { OpenAICompatibleProvider } from '../provider.js';
// ---------------------------------------------------------------------------
// Cerebras provider factory
// Ultra-low latency inference (~30 RPM, H100 clusters)
// ---------------------------------------------------------------------------
export const CEREBRAS_MODELS = [
    'llama3.1-8b',
];
export function createCerebrasProvider(apiKey, model = 'llama3.1-8b') {
    const config = {
        name: 'cerebras',
        baseURL: 'https://api.cerebras.ai/v1',
        apiKey,
        model,
        maxRPM: 30,
    };
    return new OpenAICompatibleProvider(config);
}
//# sourceMappingURL=cerebras.js.map