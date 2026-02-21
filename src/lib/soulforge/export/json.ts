/**
 * JSON Export/Import
 * 
 * Handles export and import of SoulForge configurations as JSON
 */

import type { CanonData, GenerationOptions, SoulForgeExport, SoulForgeOutput } from '../types';
import { SOULFORGE_VERSION } from '../canon';

/**
 * Export SoulForge configuration to JSON
 */
export function exportToJson(
  output: SoulForgeOutput
): string {
  const exportData: SoulForgeExport = {
    version: '1.0.0',
    canon: output.canon,
    options: output.options,
    exportedAt: new Date().toISOString(),
    soulforgeVersion: SOULFORGE_VERSION,
  };
  
  return JSON.stringify(exportData, null, 2);
}

/**
 * Parse JSON export
 */
export function parseJsonExport(json: string): SoulForgeExport | null {
  try {
    const parsed = JSON.parse(json) as SoulForgeExport;
    
    // Basic validation
    if (!parsed.canon || !parsed.options) {
      console.error('Invalid export: missing canon or options');
      return null;
    }
    
    return parsed;
  } catch (error) {
    console.error('Failed to parse JSON export:', error);
    return null;
  }
}

/**
 * Validate export structure
 */
export function validateExport(exportData: SoulForgeExport): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check required fields
  if (!exportData.canon) {
    errors.push('Missing canon data');
  } else {
    const canon = exportData.canon;
    if (!canon.agentName) errors.push('Missing agentName in canon');
    if (!canon.agentTitle) errors.push('Missing agentTitle in canon');
    if (!canon.agentMode) errors.push('Missing agentMode in canon');
    if (!canon.tone) errors.push('Missing tone in canon');
    if (!canon.autonomy) errors.push('Missing autonomy in canon');
    if (!canon.surprise) errors.push('Missing surprise in canon');
  }
  
  if (!exportData.options) {
    errors.push('Missing options');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Download JSON export
 */
export function downloadJsonExport(
  output: SoulForgeOutput,
  fileName?: string
): void {
  const json = exportToJson(output);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName || `openclaw-config-${output.canon.agentMode}-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Read JSON file from input
 */
export function readJsonFile(file: File): Promise<SoulForgeExport | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const parsed = parseJsonExport(content);
      resolve(parsed);
    };
    
    reader.onerror = () => {
      resolve(null);
    };
    
    reader.readAsText(file);
  });
}

/**
 * Create minimal export for sharing (without sensitive data)
 */
export function createShareableExport(
  canon: CanonData,
  options: GenerationOptions
): string {
  const shareable = {
    version: '1.0.0-shareable',
    mode: canon.agentMode,
    tone: canon.tone,
    autonomy: {
      actionMode: canon.autonomy.actionMode,
    },
    surprise: {
      appetite: canon.surprise.appetite,
      cadence: canon.surprise.cadence,
    },
    output: canon.output,
    options: {
      includeAdvancedPack: options.includeAdvancedPack,
      language: options.language,
    },
  };
  
  return JSON.stringify(shareable, null, 2);
}
