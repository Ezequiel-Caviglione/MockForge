// ---------------------------------------------------------------------------
// Deterministic fake data generator
// ---------------------------------------------------------------------------
const FIRST_NAMES = [
    'Alice', 'Bob', 'Carlos', 'Diana', 'Ethan', 'Fatima',
    'Grace', 'Hiro', 'Isabel', 'James', 'Keiko', 'Luca',
];
const LAST_NAMES = [
    'Smith', 'Johnson', 'García', 'Chen', 'Williams',
    'Patel', 'Kim', 'Müller', 'Silva', 'Tanaka',
];
const DOMAINS = ['gmail.com', 'outlook.com', 'company.io', 'dev.co'];
const STATUSES = ['active', 'inactive', 'pending', 'suspended'];
const PLAN_NAMES = ['free', 'pro', 'enterprise', 'team'];
const LOREM_WORDS = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur',
    'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor',
];
/**
 * Generates a plausible fake value for a single schema field.
 * Uses the field name, type, and format to pick the most realistic value.
 */
export function generateFakeValue(field, rng) {
    // Respect default if present
    if (field.default !== undefined)
        return field.default;
    // If enum, pick a random value
    if (field.enum && field.enum.length > 0) {
        return pick(field.enum.filter(v => v !== null), rng) ?? field.enum[0];
    }
    const primaryType = getPrimaryType(field.types);
    return generateForType(field.name, primaryType, field.format, rng);
}
function generateForType(fieldName, type, format, rng) {
    switch (type) {
        case 'string': return generateString(fieldName, format, rng);
        case 'number': return generateNumber(fieldName, rng);
        case 'integer': return generateInteger(fieldName, rng);
        case 'boolean': return rng() > 0.5;
        case 'object': return {};
        case 'array': return [];
        case 'null': return null;
        default: return null;
    }
}
function generateString(name, format, rng) {
    const lname = name.toLowerCase();
    // Format overrides
    if (format === 'date-time' || format === 'datetime')
        return randomISODate(rng);
    if (format === 'date')
        return randomISODate(rng).slice(0, 10);
    if (format === 'email')
        return generateEmail(rng);
    if (format === 'uri' || format === 'url')
        return 'https://example.com/' + randomId(rng);
    if (format === 'uuid')
        return randomUUID(rng);
    // Name-based heuristics
    if (/email/i.test(lname))
        return generateEmail(rng);
    if (/\bid\b|_id|Id$/i.test(name))
        return randomUUID(rng);
    if (/firstName|first_name/i.test(lname))
        return pick(FIRST_NAMES, rng);
    if (/lastName|last_name/i.test(lname))
        return pick(LAST_NAMES, rng);
    if (/^name$/i.test(lname) || /fullName|full_name/i.test(lname)) {
        return `${pick(FIRST_NAMES, rng)} ${pick(LAST_NAMES, rng)}`;
    }
    if (/username|user_name/i.test(lname)) {
        return `${pick(FIRST_NAMES, rng).toLowerCase()}${Math.floor(rng() * 99)}`;
    }
    if (/status/i.test(lname))
        return pick(STATUSES, rng);
    if (/plan|tier|subscription/i.test(lname))
        return pick(PLAN_NAMES, rng);
    if (/phone|mobile/i.test(lname))
        return `+1${randInt(200, 999, rng)}${randInt(1000000, 9999999, rng)}`;
    if (/url|website|avatar|image|photo/i.test(lname))
        return 'https://example.com/' + randomId(rng);
    if (/token|secret|key|hash/i.test(lname))
        return randomId(rng, 32);
    if (/description|bio|summary|note|message|body|content/i.test(lname)) {
        return pickN(LOREM_WORDS, 6, rng).join(' ');
    }
    if (/At$|_at$|Date|_date/i.test(name))
        return randomISODate(rng);
    if (/color|colour/i.test(lname))
        return pick(['#6d28d9', '#0ea5e9', '#10b981', '#f59e0b'], rng);
    if (/country/i.test(lname))
        return pick(['US', 'ES', 'DE', 'FR', 'JP', 'BR'], rng);
    if (/currency/i.test(lname))
        return pick(['USD', 'EUR', 'GBP', 'JPY'], rng);
    if (/locale|language/i.test(lname))
        return pick(['en-US', 'es-ES', 'de-DE', 'ja-JP'], rng);
    // Generic string
    return randomId(rng, 8);
}
function generateNumber(name, rng) {
    const lname = name.toLowerCase();
    if (/price|amount|total|cost|revenue/i.test(lname)) {
        return Math.round(rng() * 99900 + 100) / 100; // 1.00 – 999.00
    }
    if (/percent|rate|score/i.test(lname)) {
        return Math.round(rng() * 10000) / 100; // 0.00 – 100.00
    }
    if (/latitude/i.test(lname))
        return Math.round((rng() * 180 - 90) * 1e6) / 1e6;
    if (/longitude/i.test(lname))
        return Math.round((rng() * 360 - 180) * 1e6) / 1e6;
    return Math.round(rng() * 1000 * 100) / 100;
}
function generateInteger(name, rng) {
    const lname = name.toLowerCase();
    if (/count|total|quantity|qty/i.test(lname))
        return randInt(0, 500, rng);
    if (/age/i.test(lname))
        return randInt(18, 80, rng);
    if (/year/i.test(lname))
        return randInt(2000, 2030, rng);
    if (/page|limit|offset/i.test(lname))
        return randInt(1, 50, rng);
    return randInt(1, 10000, rng);
}
function generateEmail(rng) {
    const user = `${pick(FIRST_NAMES, rng).toLowerCase()}.${pick(LAST_NAMES, rng).toLowerCase()}`;
    return `${user}@${pick(DOMAINS, rng)}`;
}
// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------
function getPrimaryType(types) {
    const nonNull = types.filter(t => t !== 'null');
    return nonNull[0] ?? 'unknown';
}
function pick(arr, rng) {
    if (arr.length === 0)
        return undefined;
    return arr[Math.floor(rng() * arr.length)];
}
function pickN(arr, n, rng) {
    const copy = [...arr];
    const result = [];
    for (let i = 0; i < n && copy.length > 0; i++) {
        const idx = Math.floor(rng() * copy.length);
        result.push(copy.splice(idx, 1)[0]);
    }
    return result;
}
function randInt(min, max, rng) {
    return Math.floor(rng() * (max - min + 1)) + min;
}
function randomId(rng, len = 12) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: len }, () => chars[Math.floor(rng() * chars.length)]).join('');
}
function randomUUID(rng) {
    const hex = () => randInt(0, 0xf, rng).toString(16);
    const seg = (n) => Array.from({ length: n }, hex).join('');
    return `${seg(8)}-${seg(4)}-4${seg(3)}-${['8', '9', 'a', 'b'][randInt(0, 3, rng)]}${seg(3)}-${seg(12)}`;
}
function randomISODate(rng) {
    const start = new Date('2020-01-01').getTime();
    const end = new Date('2026-12-31').getTime();
    return new Date(start + rng() * (end - start)).toISOString();
}
//# sourceMappingURL=fake-data.js.map