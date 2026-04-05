// ---------------------------------------------------------------------------
// Semantic relationship patterns
// Pairs where the "dependent" field only makes sense when the "primary"
// field has a specific set of values.
// ---------------------------------------------------------------------------
const RELATIONSHIP_PATTERNS = [
    {
        primaryPattern: /subscription|plan|tier/i,
        dependentPattern: /trial|trialEnds|trialExpir/i,
        activatingKeywords: ['trial'],
        confidence: 0.9,
    },
    {
        primaryPattern: /status/i,
        dependentPattern: /paidAt|paid_at|completedAt|resolvedAt/i,
        activatingKeywords: ['paid', 'completed', 'resolved', 'success'],
        confidence: 0.85,
    },
    {
        primaryPattern: /status/i,
        dependentPattern: /error|errorMessage|error_message|reason|failedAt/i,
        activatingKeywords: ['error', 'failed', 'rejected', 'cancelled'],
        confidence: 0.85,
    },
    {
        primaryPattern: /role|userType|user_type/i,
        dependentPattern: /permissions|scopes|adminOnly/i,
        activatingKeywords: ['admin', 'moderator', 'superuser'],
        confidence: 0.8,
    },
    {
        primaryPattern: /isVerified|verified|emailVerified/i,
        dependentPattern: /verifiedAt|verified_at/i,
        activatingKeywords: ['true'],
        confidence: 0.9,
    },
];
/**
 * Analyses a normalised {@link Schema} to detect:
 * - Nullable fields
 * - Enum-constrained fields
 * - Semantic relationships between fields (heuristic, name-based)
 */
export function analyzeSchema(schema) {
    const allFields = flattenFields(schema.fields);
    const nullableFields = allFields.filter(f => f.nullable);
    const enumFields = allFields.filter(f => f.enum && f.enum.length > 0);
    const relationships = detectRelationships(allFields);
    // Rough cardinality estimate:
    // Each nullable field adds a boolean branch (present vs null).
    // Each enum field multiplies by its cardinality.
    const rawCombinationCount = computeRawCount(nullableFields, enumFields);
    return { nullableFields, enumFields, relationships, rawCombinationCount };
}
// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------
/** Recursively flattens nested object fields into a single list */
function flattenFields(fields, prefix = '') {
    const result = [];
    for (const field of fields) {
        const qualifiedField = {
            ...field,
            name: prefix ? `${prefix}.${field.name}` : field.name,
        };
        result.push(qualifiedField);
        if (field.children) {
            result.push(...flattenFields(field.children, qualifiedField.name));
        }
    }
    return result;
}
function detectRelationships(fields) {
    const relationships = [];
    for (const pattern of RELATIONSHIP_PATTERNS) {
        const primaryCandidates = fields.filter(f => pattern.primaryPattern.test(f.name));
        const dependentCandidates = fields.filter(f => pattern.dependentPattern.test(f.name));
        for (const primary of primaryCandidates) {
            for (const dependent of dependentCandidates) {
                if (primary.name === dependent.name)
                    continue;
                // Determine activating values from enum or keywords
                const activatingValues = primary.enum
                    ? primary.enum.filter((v) => v !== null && pattern.activatingKeywords.some(kw => String(v).toLowerCase().includes(kw.toLowerCase())))
                    : pattern.activatingKeywords.map(String);
                if (activatingValues.length === 0)
                    continue;
                relationships.push({
                    primaryField: primary.name,
                    dependentField: dependent.name,
                    activatingValues,
                    confidence: pattern.confidence,
                });
            }
        }
    }
    return relationships;
}
function computeRawCount(nullableFields, enumFields) {
    let count = 1;
    count *= Math.pow(2, nullableFields.length);
    for (const f of enumFields) {
        count *= (f.enum?.length ?? 1) + (f.nullable ? 1 : 0);
    }
    return count;
}
//# sourceMappingURL=analyzer.js.map