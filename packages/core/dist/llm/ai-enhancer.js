// ---------------------------------------------------------------------------
// AI Enhancer — Augments rule-based scenarios with LLM-powered names,
// descriptions, realistic data, and semantic tags.
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `You are MockForge, an expert at generating realistic mock data for frontend and QA testing.

You receive a JSON schema and a list of raw scenarios. Your job is to enhance each scenario with:
1. A clear, descriptive name (e.g. "User with expired trial", "Admin with full access")
2. A short description of the UI state this scenario represents
3. More realistic field values (real names, coherent dates, valid email formats, etc.)
4. Semantic tags from: ["happy-path", "edge-case", "error", "empty", "partial", "full", "null-heavy"]

IMPORTANT:
- Return ONLY a valid JSON object with an "scenarios" array
- Keep the same scenario IDs
- Field values must match the original types (don't change string to number)
- Names should be concise (3-6 words)
- Descriptions should be 1-2 sentences explaining the UI state`;
/**
 * Enhances a batch of rule-based scenarios using an LLM.
 * Falls back to the original scenarios if AI fails.
 */
export async function enhanceScenariosWithAI(schema, scenarios, router, signal) {
    // Build a compact schema summary for the prompt
    const schemaSummary = buildSchemaSummary(schema);
    const scenariosForPrompt = scenarios.map(s => ({
        id: s.id,
        name: s.name,
        fields: s.fields,
        tags: s.tags,
    }));
    const prompt = buildPrompt(schemaSummary, scenariosForPrompt);
    try {
        if (signal?.aborted)
            throw new Error('Aborted');
        const raw = await router.complete(prompt, SYSTEM_PROMPT);
        const parsed = parseAIResponse(raw);
        if (!parsed) {
            console.warn('[MockForge] AI returned invalid JSON, using rule-based names');
            return scenarios.map(s => ({ ...s, aiEnhanced: false }));
        }
        // Merge AI output with original scenarios (preserve IDs, fill gaps)
        return mergeAIOutput(scenarios, parsed.scenarios);
    }
    catch (err) {
        console.warn('[MockForge] AI enhancement failed, using rule-based fallback:', err);
        return scenarios.map(s => ({ ...s, aiEnhanced: false }));
    }
}
// ---------------------------------------------------------------------------
// Prompt construction
// ---------------------------------------------------------------------------
function buildSchemaSummary(schema) {
    return {
        name: schema.name,
        description: schema.description,
        fields: schema.fields.map(f => ({
            name: f.name,
            types: f.types,
            nullable: f.nullable,
            enum: f.enum,
            description: f.description,
            format: f.format,
        })),
    };
}
function buildPrompt(schema, scenarios) {
    return JSON.stringify({
        schema,
        scenarios,
        instruction: 'Enhance these scenarios. Return JSON: { "scenarios": [...] } with same IDs. ' +
            'Each scenario needs: id, name, description, fields (with realistic values), tags.',
    }, null, 2);
}
// ---------------------------------------------------------------------------
// Response parsing & merging
// ---------------------------------------------------------------------------
function parseAIResponse(raw) {
    try {
        const parsed = JSON.parse(raw);
        if (typeof parsed === 'object' &&
            parsed !== null &&
            'scenarios' in parsed &&
            Array.isArray(parsed.scenarios)) {
            return parsed;
        }
        return null;
    }
    catch {
        return null;
    }
}
function mergeAIOutput(originals, aiScenarios) {
    const aiMap = new Map(aiScenarios.map(s => [s.id, s]));
    return originals.map(original => {
        const ai = aiMap.get(original.id);
        if (!ai)
            return { ...original, aiEnhanced: false };
        const description = ai.description || original.description;
        return {
            id: original.id,
            name: ai.name || original.name,
            // Use AI fields but validate types match originals
            fields: mergeFields(original.fields, ai.fields),
            tags: ai.tags.length > 0 ? ai.tags : original.tags,
            aiEnhanced: true,
            ...(description !== undefined && { description }),
        };
    });
}
/** Merges AI field values into originals, rejecting type mismatches */
function mergeFields(original, ai) {
    const result = { ...original };
    for (const [key, aiVal] of Object.entries(ai)) {
        const origVal = original[key];
        // Accept AI value if same type or original was null/undefined
        if (origVal === null || origVal === undefined) {
            result[key] = aiVal;
        }
        else if (typeof origVal === typeof aiVal && aiVal !== null) {
            result[key] = aiVal;
        }
        // Otherwise keep original (type mismatch = AI hallucinated)
    }
    return result;
}
//# sourceMappingURL=ai-enhancer.js.map