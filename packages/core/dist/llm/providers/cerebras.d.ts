import { OpenAICompatibleProvider } from '../provider.js';
export declare const CEREBRAS_MODELS: readonly ["llama3.1-8b"];
export type CerebrasModel = (typeof CEREBRAS_MODELS)[number];
export declare function createCerebrasProvider(apiKey: string, model?: CerebrasModel): OpenAICompatibleProvider;
//# sourceMappingURL=cerebras.d.ts.map