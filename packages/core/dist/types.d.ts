/** Primitive field types supported by the schema system */
export type FieldType = 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array' | 'null' | 'unknown';
/** A normalised representation of a single field within a schema */
export interface SchemaField {
    name: string;
    /** All types this field can hold (multi-type for nullable fields) */
    types: FieldType[];
    /** True when `null` is a valid value for this field */
    nullable: boolean;
    /** Allowed enum values, if the field is constrained to a set */
    enum?: Array<string | number | boolean | null>;
    /** Human-readable description from the original schema */
    description?: string;
    /** Whether the field is required in the schema */
    required: boolean;
    /** Default value from the schema, if provided */
    default?: unknown;
    /** Child fields for object types */
    children?: SchemaField[];
    /** Item schema for array types */
    items?: SchemaField;
    /** Detected semantic role (e.g. 'date', 'email', 'url') */
    format?: string;
}
/** A fully normalised, parser-agnostic schema representation */
export interface Schema {
    /** Identifier derived from the schema title or a fallback name */
    name: string;
    /** Optional human-readable description */
    description?: string;
    /** All top-level fields */
    fields: SchemaField[];
    /** Raw source format that was parsed */
    sourceFormat: 'json-schema' | 'raw-json' | 'openapi';
}
/** Semantic tags that classify a scenario */
export type ScenarioTag = 'happy-path' | 'edge-case' | 'empty' | 'error' | 'null-heavy' | 'full' | string;
/** A generated mock scenario */
export interface Scenario {
    id: string;
    /** Human-readable name, rule-based or AI-generated */
    name: string;
    /** Optional description explaining the UI state this scenario maps to */
    description?: string;
    /** The concrete field values for this scenario */
    fields: Record<string, unknown>;
    /** Semantic classification tags */
    tags: ScenarioTag[];
    /** True when this scenario's name/data was enhanced by AI */
    aiEnhanced: boolean;
}
/** A detected relationship between two fields */
export interface FieldRelationship {
    /** The primary field that drives the relationship */
    primaryField: string;
    /** The dependent field that is only relevant when the primary has a specific value */
    dependentField: string;
    /** The value(s) of the primary field that "activate" the dependent field */
    activatingValues: Array<string | number | boolean>;
    /** Confidence score: 0–1, derived from name pattern matching */
    confidence: number;
}
/** Result of schema analysis, used to guide scenario generation */
export interface AnalysisResult {
    /** Fields that can be null */
    nullableFields: SchemaField[];
    /** Fields constrained to a set of enum values */
    enumFields: SchemaField[];
    /** Detected dependencies between fields */
    relationships: FieldRelationship[];
    /** Estimated number of raw scenarios before pruning */
    rawCombinationCount: number;
}
/** Controls scenario generation behaviour */
export interface GeneratorConfig {
    /** Maximum number of scenarios to generate (default: 12) */
    maxScenarios?: number;
    /** Whether to include extreme edge cases (default: true) */
    includeEdgeCases?: boolean;
    /** Seed for deterministic fake data generation (optional) */
    seed?: number;
}
//# sourceMappingURL=types.d.ts.map