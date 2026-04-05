import type { AnalysisResult, Schema } from '../types.js';
/**
 * Analyses a normalised {@link Schema} to detect:
 * - Nullable fields
 * - Enum-constrained fields
 * - Semantic relationships between fields (heuristic, name-based)
 */
export declare function analyzeSchema(schema: Schema): AnalysisResult;
//# sourceMappingURL=analyzer.d.ts.map