import type { SchemaField } from '../types.js';
type Rng = () => number;
/**
 * Generates a plausible fake value for a single schema field.
 * Uses the field name, type, and format to pick the most realistic value.
 */
export declare function generateFakeValue(field: SchemaField, rng: Rng): unknown;
export {};
//# sourceMappingURL=fake-data.d.ts.map