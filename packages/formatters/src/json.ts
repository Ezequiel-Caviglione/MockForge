import type { Scenario } from '@mockforge/core'

/**
 * Formats an array of scenarios as pretty-printed JSON.
 * Result is an array of objects: [{ id, name, description, tags, fields }]
 */
export function formatAsJson(scenarios: Scenario[]): string {
  const output = scenarios.map(s => ({
    id: s.id,
    name: s.name,
    ...(s.description ? { description: s.description } : {}),
    tags: s.tags,
    fields: s.fields,
  }))
  return JSON.stringify(output, null, 2)
}
