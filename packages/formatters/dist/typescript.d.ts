import type { Scenario } from '@mockforge/core';
/**
 * Formats scenarios as TypeScript const fixtures.
 *
 * Output:
 * ```ts
 * // Scenario: Free User
 * export const userMockFreeUser = {
 *   id: "uuid-...", name: "Alice Smith", ...
 * } as const
 * ```
 */
export declare function formatAsTypescript(scenarios: Scenario[], schemaName?: string): string;
//# sourceMappingURL=typescript.d.ts.map