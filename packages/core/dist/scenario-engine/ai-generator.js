export async function generateAiScenarios(codeModel, router, signal) {
    const systemPrompt = `You are MockForge, an expert QA AI and Test Data generator.
Your objective is to analyze the provided code (which may be a class, interface, DB schema, or JSON) and generate different possible realistic, meaningful test scenarios covering various states, including happy paths and edge cases.

OUTPUT FORMATTING:
You MUST output a valid JSON object matching this schema exactly:
{
  "scenarios": [
    {
      "id": "scenario-1",
      "name": "Meaningful and descriptive scenario name (e.g. Free User with Expired Trial)",
      "description": "Short explanation of the user or system state this represents.",
      "fields": { 
        "nombre_de_la_propiedad_del_codigo_aqui": "valor generado acorde al tipo",
        "...": "..."
      },
      "tags": ["happy-path", "edge-case"],
      "aiEnhanced": true
    }
  ]
}

CRITICAL INSTRUCTIONS:
1. The keys inside the "fields" object MUST be the exact properties/variables defined in the user's code. NEVER output generic names like "field1".
2. Use high-quality, realistic fake data. Names should sound like real people. Dates should be valid ISO strings.
3. Do not output anything other than the JSON object.`;
    const userPrompt = `Generate different possible mock scenarios for this model:

\`\`\`
${codeModel}
\`\`\`
`;
    const jsonString = await router.complete(userPrompt, systemPrompt);
    try {
        // Extraer todo lo que esté entre la primera y la última llave (ignorar chat basura alrededor del output)
        let cleanString = jsonString.trim();
        const match = cleanString.match(/\{[\s\S]*\}/);
        if (match) {
            cleanString = match[0];
        }
        // Auto-fix para modelos pequeños: quitar comas sobrantes antes de cerrar llaves/corchetes
        cleanString = cleanString.replace(/,\s*([}\]])/g, '$1');
        const parsed = JSON.parse(cleanString);
        if (!parsed || !Array.isArray(parsed.scenarios)) {
            throw new Error('AI response did not contain a valid "scenarios" array.');
        }
        return parsed.scenarios;
    }
    catch (err) {
        throw new Error(`Failed to parse AI response into scenarios: ${err.message}`);
    }
}
//# sourceMappingURL=ai-generator.js.map