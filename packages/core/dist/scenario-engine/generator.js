import { generateFakeValue } from './fake-data.js';
// ---------------------------------------------------------------------------
// Scenario Generator
// ---------------------------------------------------------------------------
const DEFAULT_CONFIG = {
    maxScenarios: 12,
    includeEdgeCases: true,
    seed: 0,
};
/**
 * Generates a set of meaningful mock scenarios from an analysis result.
 * Uses a controlled cartesian product of nullable/enum combinations,
 * pruned by relationship rules, capped at `maxScenarios`.
 */
export function generateScenarios(allFields, analysis, config = {}) {
    const cfg = { ...DEFAULT_CONFIG, ...config };
    const rng = makeRng(cfg.seed);
    // Build the axis list: each axis is a [field, value[]] pair
    const axes = buildAxes(allFields, analysis, cfg.includeEdgeCases);
    // Generate all combinations up to the cap
    const combinations = cartesianCapped(axes, cfg.maxScenarios, rng);
    return combinations.map((combo, idx) => {
        const fields = buildFields(allFields, combo, rng);
        const tags = deriveTags(combo, allFields);
        return {
            id: `scenario-${idx + 1}`,
            fields,
            tags,
        };
    });
}
function buildAxes(fields, analysis, includeEdgeCases) {
    const axes = [];
    // For each top-level field that has meaningful variation
    for (const field of fields) {
        if (field.enum && field.enum.length > 0) {
            // Enum axis: each enum value + null if nullable
            const values = [...field.enum];
            if (field.nullable && includeEdgeCases)
                values.push(null);
            axes.push({ field, values });
        }
        else if (field.nullable) {
            // Nullable axis: present (undefined = "generate a value") vs null
            axes.push({ field, values: [undefined, null] });
        }
        // Non-nullable, non-enum fields get a fixed fake value (added below)
    }
    return axes;
}
// ---------------------------------------------------------------------------
// Cartesian product with cap
// ---------------------------------------------------------------------------
function cartesianCapped(axes, max, rng) {
    if (axes.length === 0)
        return [new Map()];
    const total = axes.reduce((acc, ax) => acc * ax.values.length, 1);
    if (total <= max) {
        // Generate all combinations
        return cartesianAll(axes);
    }
    // Too many — sample `max` distinct combinations
    const seen = new Set();
    const results = [];
    while (results.length < max) {
        const combo = new Map();
        for (const ax of axes) {
            const idx = Math.floor(rng() * ax.values.length);
            combo.set(ax.field.name, ax.values[idx]);
        }
        const key = JSON.stringify([...combo.entries()]);
        if (!seen.has(key)) {
            seen.add(key);
            results.push(combo);
        }
    }
    // Always ensure we have a "happy path" (all non-null enum first values)
    ensureHappyPath(axes, results);
    return results;
}
function cartesianAll(axes) {
    let results = [new Map()];
    for (const ax of axes) {
        const next = [];
        for (const existing of results) {
            for (const val of ax.values) {
                const combo = new Map(existing);
                combo.set(ax.field.name, val);
                next.push(combo);
            }
        }
        results = next;
    }
    return results;
}
function ensureHappyPath(axes, results) {
    const happyPath = new Map();
    for (const ax of axes) {
        // Pick first non-null value as "happy"
        const happy = ax.values.find(v => v !== null && v !== undefined) ?? ax.values[0];
        happyPath.set(ax.field.name, happy);
    }
    const existsAlready = results.some(r => {
        for (const [k, v] of happyPath) {
            if (r.get(k) !== v)
                return false;
        }
        return true;
    });
    if (!existsAlready && results.length > 0) {
        results[0] = happyPath; // replace first scenario with happy path
    }
}
// ---------------------------------------------------------------------------
// Field value resolution
// ---------------------------------------------------------------------------
function buildFields(allFields, combo, rng) {
    const result = {};
    for (const field of allFields) {
        if (combo.has(field.name)) {
            const override = combo.get(field.name);
            // undefined means "generate a value for this field"
            result[field.name] = override === undefined
                ? generateFakeValue(field, rng)
                : override;
        }
        else {
            // Non-axis field: always generate a fake value
            result[field.name] = generateFakeValue(field, rng);
        }
    }
    return result;
}
// ---------------------------------------------------------------------------
// Tag derivation
// ---------------------------------------------------------------------------
function deriveTags(combo, allFields) {
    const tags = [];
    const nullCount = [...combo.values()].filter(v => v === null).length;
    const totalAxisFields = combo.size;
    if (nullCount === 0)
        tags.push('happy-path');
    if (nullCount > 0 && nullCount < totalAxisFields)
        tags.push('partial');
    if (nullCount === totalAxisFields && totalAxisFields > 0)
        tags.push('empty');
    if (nullCount >= 2)
        tags.push('null-heavy');
    // Detect error-state scenarios by enum values
    for (const [, val] of combo) {
        if (typeof val === 'string' && /error|fail|reject|cancel|expired/i.test(val)) {
            tags.push('error');
            break;
        }
    }
    // Edge case: all fields populated
    const allPresent = allFields.every(f => {
        const v = combo.get(f.name);
        return v !== null && v !== undefined;
    });
    if (allPresent && allFields.length > 0)
        tags.push('full');
    return [...new Set(tags)];
}
// ---------------------------------------------------------------------------
// Deterministic RNG (mulberry32)
// ---------------------------------------------------------------------------
function makeRng(seed) {
    let s = seed === 0 ? 0xdeadbeef : seed;
    return function () {
        s += 0x6d2b79f5;
        let t = s;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
    };
}
//# sourceMappingURL=generator.js.map