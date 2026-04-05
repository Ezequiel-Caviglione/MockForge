// ---------------------------------------------------------------------------
// @mockforge/core — Public API
// ---------------------------------------------------------------------------
// AI Generator
export { generateAiScenarios } from './scenario-engine/ai-generator.js';
export { AllProvidersExhaustedError, RateLimitError } from './llm/types.js';
export { OpenAICompatibleProvider } from './llm/provider.js';
export { ProviderRouter } from './llm/router.js';
// Provider factories
export { createOpenRouterProvider, OPENROUTER_FREE_MODELS } from './llm/providers/openrouter.js';
export { createGroqProvider, GROQ_MODELS } from './llm/providers/groq.js';
export { createCerebrasProvider, CEREBRAS_MODELS } from './llm/providers/cerebras.js';
import { generateAiScenarios } from './scenario-engine/ai-generator.js';
/**
 * Full MockForge pipeline (Pure AI Generation):
 * Parses any raw code string and uses LLM routing to extract scenarios.
 */
export async function generateMocks(codeModel, options) {
    const start = Date.now();
    const scenarios = await generateAiScenarios(codeModel, options.router, options.signal);
    return {
        scenarios,
        aiUsed: true,
        duration: Date.now() - start,
    };
}
//# sourceMappingURL=index.js.map