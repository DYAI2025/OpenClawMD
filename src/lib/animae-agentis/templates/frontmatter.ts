/**
 * YAML Front Matter Utility
 *
 * Generates machine-readable YAML front matter for generated files.
 * Used by SKILL.md and optionally by all other templates.
 */

export const TEMPLATE_PACK_VERSION = '2.2.0';

export function yamlFrontMatter(meta: Record<string, string | undefined>): string {
  const lines = Object.entries(meta)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${k}: "${v}"`)
    .join('\n');
  return `---\n${lines}\n---\n\n`;
}
