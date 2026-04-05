/**
 * Parses a JSON Schema (string or object) into a normalised {@link Schema}.
 * Handles: nullable via `nullable: true` or `type: ['string', 'null']`,
 * enums, required arrays, nested objects, array items, $defs/$definitions (basic).
 */
export function parseJsonSchema(input, name) {
    const raw = typeof input === 'string'
        ? JSON.parse(input)
        : input;
    const defs = collectDefs(raw);
    const schemaName = name ?? getString(raw, 'title') ?? 'Schema';
    const fields = parseProperties(raw, defs, getStringArray(raw, 'required') ?? []);
    const description = getString(raw, 'description');
    return {
        name: schemaName,
        ...(description !== undefined && { description }),
        fields,
        sourceFormat: 'json-schema',
    };
}
// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------
function collectDefs(raw) {
    const defs = new Map();
    const sources = [
        getObject(raw, '$defs'),
        getObject(raw, 'definitions'),
    ];
    for (const source of sources) {
        if (source) {
            for (const [key, val] of Object.entries(source)) {
                if (isObject(val))
                    defs.set(key, val);
            }
        }
    }
    return defs;
}
function parseProperties(schema, defs, requiredKeys) {
    const props = getObject(schema, 'properties');
    if (!props)
        return [];
    return Object.entries(props).map(([name, rawField]) => {
        const resolved = resolveRef(rawField, defs);
        return parseField(name, resolved, defs, requiredKeys.includes(name));
    });
}
function parseField(name, raw, defs, required) {
    const { types, nullable } = extractTypes(raw);
    const enumValues = extractEnum(raw);
    const children = types.includes('object')
        ? parseProperties(raw, defs, getStringArray(raw, 'required') ?? [])
        : undefined;
    const items = types.includes('array')
        ? parseItemsField(raw, defs)
        : undefined;
    const description = getString(raw, 'description');
    const format = getString(raw, 'format');
    return {
        name,
        types,
        nullable,
        ...(enumValues !== undefined && { enum: enumValues }),
        ...(description !== undefined && { description }),
        required,
        ...(raw['default'] !== undefined && { default: raw['default'] }),
        ...(format !== undefined && { format }),
        ...(children !== undefined && { children }),
        ...(items !== undefined && { items }),
    };
}
function extractTypes(raw) {
    // nullable: true (OpenAPI style, sometimes used in JSON Schema)
    const nullableFlag = raw['nullable'] === true;
    const rawType = raw['type'];
    if (Array.isArray(rawType)) {
        const types = rawType
            .filter((t) => typeof t === 'string')
            .map(normaliseType);
        const nullable = nullableFlag || types.includes('null');
        return { types: types.filter(t => t !== 'null'), nullable };
    }
    if (typeof rawType === 'string') {
        return {
            types: [normaliseType(rawType)],
            nullable: nullableFlag,
        };
    }
    // No explicit type — infer from presence of properties or items
    if (raw['properties'])
        return { types: ['object'], nullable: nullableFlag };
    if (raw['items'])
        return { types: ['array'], nullable: nullableFlag };
    if (raw['enum'])
        return { types: ['unknown'], nullable: nullableFlag };
    return { types: ['unknown'], nullable: nullableFlag };
}
function extractEnum(raw) {
    const enumRaw = raw['enum'];
    if (!Array.isArray(enumRaw))
        return undefined;
    return enumRaw.filter((v) => v === null || typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean');
}
function parseItemsField(raw, defs) {
    const items = raw['items'];
    if (!items || !isObject(items))
        return undefined;
    const resolved = resolveRef(items, defs);
    return parseField('item', resolved, defs, true);
}
function resolveRef(schema, defs) {
    const ref = schema['$ref'];
    if (typeof ref !== 'string')
        return schema;
    // e.g. "#/$defs/Address" or "#/definitions/Address"
    const parts = ref.split('/');
    const defName = parts[parts.length - 1];
    if (defName === undefined)
        return schema;
    return defs.get(defName) ?? schema;
}
function normaliseType(raw) {
    switch (raw) {
        case 'string': return 'string';
        case 'number': return 'number';
        case 'integer': return 'integer';
        case 'boolean': return 'boolean';
        case 'object': return 'object';
        case 'array': return 'array';
        case 'null': return 'null';
        default: return 'unknown';
    }
}
// ---------------------------------------------------------------------------
// Type-safe accessors
// ---------------------------------------------------------------------------
function getString(obj, key) {
    const v = obj[key];
    return typeof v === 'string' ? v : undefined;
}
function getStringArray(obj, key) {
    const v = obj[key];
    if (!Array.isArray(v))
        return undefined;
    return v.filter((x) => typeof x === 'string');
}
function getObject(obj, key) {
    const v = obj[key];
    return isObject(v) ? v : undefined;
}
function isObject(v) {
    return typeof v === 'object' && v !== null && !Array.isArray(v);
}
//# sourceMappingURL=json-schema.js.map