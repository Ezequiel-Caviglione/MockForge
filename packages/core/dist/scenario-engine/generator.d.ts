import type { AnalysisResult, GeneratorConfig, Scenario, SchemaField } from '../types.js';
/**
 * Generates a set of meaningful mock scenarios from an analysis result.
 * Uses a controlled cartesian product of nullable/enum combinations,
 * pruned by relationship rules, capped at `maxScenarios`.
 */
export declare function generateScenarios(allFields: SchemaField[], analysis: AnalysisResult, config?: GeneratorConfig): Omit<Scenario, 'name' | 'description' | 'aiEnhanced'>[];
//# sourceMappingURL=generator.d.ts.map