// ---------------------------------------------------------------------------
// Rule-based scenario namer (no AI required)
// ---------------------------------------------------------------------------
/**
 * Assigns human-readable names to scenarios using rule-based heuristics.
 * This is the fallback when AI is unavailable.
 */
export function nameScenarios(scenarios) {
    const usedNames = new Map();
    return scenarios.map(scenario => {
        const name = deriveName(scenario.fields, scenario.tags);
        const count = usedNames.get(name) ?? 0;
        usedNames.set(name, count + 1);
        return {
            ...scenario,
            name: count === 0 ? name : `${name} ${count + 1}`,
            description: deriveDescription(scenario.fields, scenario.tags),
        };
    });
}
// ---------------------------------------------------------------------------
// Internal
// ---------------------------------------------------------------------------
function deriveName(fields, tags) {
    // 1. Try to find a discriminant field (status, plan, subscription, role, type)
    const discriminantKeys = [
        'status', 'plan', 'subscription', 'role', 'type', 'tier', 'state', 'userType',
    ];
    for (const key of discriminantKeys) {
        const val = findField(fields, key);
        if (val !== null && val !== undefined) {
            return formatDiscriminant(key, val);
        }
    }
    // 2. Use tags to construct a name
    if (tags.includes('empty'))
        return 'Empty State';
    if (tags.includes('error'))
        return 'Error State';
    if (tags.includes('null-heavy'))
        return 'Minimal Data';
    if (tags.includes('full'))
        return 'All Fields Present';
    if (tags.includes('happy-path'))
        return 'Default State';
    if (tags.includes('partial'))
        return 'Partial Data';
    // 3. Fallback: count null fields
    const nullCount = Object.values(fields).filter(v => v === null).length;
    if (nullCount === 0)
        return 'Complete Record';
    if (nullCount === Object.keys(fields).length)
        return 'Empty Record';
    return `${nullCount} Null Fields`;
}
function formatDiscriminant(key, value) {
    const strVal = String(value);
    const capitalized = strVal.charAt(0).toUpperCase() + strVal.slice(1);
    const keyLabel = camelToLabel(key);
    return `${keyLabel}: ${capitalized}`;
}
function deriveDescription(fields, tags) {
    const parts = [];
    const nullFields = Object.entries(fields)
        .filter(([, v]) => v === null)
        .map(([k]) => camelToLabel(k));
    if (tags.includes('happy-path')) {
        parts.push('All fields populated with valid data.');
    }
    else if (tags.includes('empty')) {
        parts.push('All optional fields are null.');
    }
    else if (nullFields.length > 0) {
        parts.push(`Null: ${nullFields.slice(0, 3).join(', ')}${nullFields.length > 3 ? '…' : ''}.`);
    }
    if (tags.includes('error'))
        parts.push('Represents an error state.');
    return parts.join(' ');
}
/** Case-insensitive field lookup supporting dot-notation */
function findField(fields, key) {
    const lkey = key.toLowerCase();
    for (const [k, v] of Object.entries(fields)) {
        if (k.toLowerCase() === lkey || k.toLowerCase().endsWith(`.${lkey}`)) {
            return v;
        }
    }
    return undefined;
}
function camelToLabel(str) {
    // Remove namespace prefix (e.g. "user.status" → "status")
    const bare = str.includes('.') ? str.split('.').pop() : str;
    return bare
        .replace(/([A-Z])/g, ' $1')
        .replace(/_/g, ' ')
        .replace(/^\s+/, '')
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
}
//# sourceMappingURL=namer.js.map