import type { Schema, Scenario } from '../types.js';
import type { ProviderRouter } from './router.js';
/**
 * Enhances a batch of rule-based scenarios using an LLM.
 * Falls back to the original scenarios if AI fails.
 */
export declare function enhanceScenariosWithAI(schema: Schema, scenarios: Omit<Scenario, 'aiEnhanced'>[], router: ProviderRouter, signal?: AbortSignal): Promise<Scenario[]>;
//# sourceMappingURL=ai-enhancer.d.ts.map