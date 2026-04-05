import type { Scenario } from '../types.js';
/**
 * Assigns human-readable names to scenarios using rule-based heuristics.
 * This is the fallback when AI is unavailable.
 */
export declare function nameScenarios(scenarios: Omit<Scenario, 'name' | 'description' | 'aiEnhanced'>[]): Omit<Scenario, 'aiEnhanced'>[];
//# sourceMappingURL=namer.d.ts.map