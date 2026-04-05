import { OpenAICompatibleProvider } from '../provider.js';
export declare const GROQ_MODELS: readonly ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "gemma2-9b-it"];
export type GroqModel = (typeof GROQ_MODELS)[number];
export declare function createGroqProvider(apiKey: string, model?: GroqModel): OpenAICompatibleProvider;
//# sourceMappingURL=groq.d.ts.map