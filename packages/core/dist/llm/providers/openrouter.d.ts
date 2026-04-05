import { OpenAICompatibleProvider } from '../provider.js';
export declare const OPENROUTER_FREE_MODELS: readonly ["openrouter/free"];
export type OpenRouterFreeModel = (typeof OPENROUTER_FREE_MODELS)[number];
export declare function createOpenRouterProvider(apiKey: string, model?: OpenRouterFreeModel): OpenAICompatibleProvider;
//# sourceMappingURL=openrouter.d.ts.map