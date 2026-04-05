import type { Schema } from '../types.js';
/**
 * Parses a JSON Schema (string or object) into a normalised {@link Schema}.
 * Handles: nullable via `nullable: true` or `type: ['string', 'null']`,
 * enums, required arrays, nested objects, array items, $defs/$definitions (basic).
 */
export declare function parseJsonSchema(input: string | object, name?: string): Schema;
//# sourceMappingURL=json-schema.d.ts.map