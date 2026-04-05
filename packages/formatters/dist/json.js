/**
 * Formats an array of scenarios as pretty-printed JSON.
 * Result is an array of objects: [{ id, name, description, tags, fields }]
 */
export function formatAsJson(scenarios) {
    const output = scenarios.map(s => ({
        id: s.id,
        name: s.name,
        ...(s.description ? { description: s.description } : {}),
        tags: s.tags,
        fields: s.fields,
    }));
    return JSON.stringify(output, null, 2);
}
//# sourceMappingURL=json.js.map