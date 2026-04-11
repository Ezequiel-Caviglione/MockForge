import type { Scenario } from '@mockforge/core'

/**
 * Formats scenarios as a JSON array of just the `fields` object per scenario.
 * Useful for copy-pasting directly into API request bodies or test fixtures.
 */
export function formatAsJsonFields(scenarios: Scenario[]): string {
  const output = scenarios.map(s => s.fields)
  return JSON.stringify(output, null, 2)
}
