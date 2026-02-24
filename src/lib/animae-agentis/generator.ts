/**
 * Animae Agentis Generator
 *
 * Generates all 12 configuration files from Spirit data.
 * Implements the thrid_embodiment pattern: SOUL + IDENTITY + USER
 */

import type {
  SpiritData,
  GenerationOptions,
  GeneratedFile,
  AnimaeAgentisOutput,
} from './types';

import {
  renderSoulMd,
  renderIdentityMd,
  renderUserMd,
  renderHeartbeatMd,
  renderShieldMd,
  renderSpiritMd,
  renderCortexMd,
  renderMemoryMd,
  renderVersionMd,
  renderOpsMd,
  renderAgentsMd,
  renderToolsMd,
} from './templates';

// ============================================================================
// File Definitions
// ============================================================================

export const BASE_FILES = [
  'SOUL.md',
  'IDENTITY.md',
  'USER.md',
  'HEARTBEAT.md',
  'SHIELD.md',
] as const;

export const ADVANCED_FILES = [
  'SPIRIT.md',
  'CORTEX.md',
  'MEMORY.md',
  'VERSION.md',
  'OPS.md',
  'AGENTS.md',
  'TOOLS.md',
] as const;

export type BaseFileName = typeof BASE_FILES[number];
export type AdvancedFileName = typeof ADVANCED_FILES[number];
export type FileName = BaseFileName | AdvancedFileName;

// ============================================================================
// Main Generator
// ============================================================================



/**
 * Generate all Animae Agentis configuration files
 * 
 * @param canon - The canonical parameter set
 * @param options - Generation options
 * @returns Generated files and metadata
 */
export function generateAnimaeAgentisFiles(
  canon: SpiritData,
  options: GenerationOptions
): AnimaeAgentisOutput {
  const files: GeneratedFile[] = [];
  const language = options.language;

  // Generate Base Pack (always included)
  // Order matters for logical flow
  files.push(
    { name: 'SOUL.md', content: renderSoulMd(canon, language), section: 'base' },
    { name: 'IDENTITY.md', content: renderIdentityMd(canon, language), section: 'base' },
    { name: 'USER.md', content: renderUserMd(canon, language), section: 'base' },
    { name: 'HEARTBEAT.md', content: renderHeartbeatMd(canon, language), section: 'base' },
    { name: 'SHIELD.md', content: renderShieldMd(canon, language), section: 'base' },
  );

  // Generate Advanced Pack (optional)
  if (options.includeAdvancedPack) {
    files.push(
      { name: 'SPIRIT.md', content: renderSpiritMd(canon, language), section: 'advanced' },
      { name: 'CORTEX.md', content: renderCortexMd(canon, language), section: 'advanced' },
      { name: 'MEMORY.md', content: renderMemoryMd(canon, language), section: 'advanced' },
      { name: 'VERSION.md', content: renderVersionMd(canon, language), section: 'advanced' },
      { name: 'OPS.md', content: renderOpsMd(canon, language), section: 'advanced' },
      { name: 'AGENTS.md', content: renderAgentsMd(canon, language), section: 'advanced' },
      { name: 'TOOLS.md', content: renderToolsMd(canon, language), section: 'advanced' },
    );
  }

  return {
    files,
    canon,
    options,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Alias for generateAnimaeAgentisFiles (for API consistency)
 */
export const generateAnimaeAgentis = generateAnimaeAgentisFiles;

/**
 * Generate only the Base Pack (5 files)
 */
export function generateBasePack(
  canon: SpiritData,
  language: 'en' | 'de' = 'en'
): GeneratedFile[] {
  return [
    { name: 'SOUL.md', content: renderSoulMd(canon, language), section: 'base' },
    { name: 'IDENTITY.md', content: renderIdentityMd(canon, language), section: 'base' },
    { name: 'USER.md', content: renderUserMd(canon, language), section: 'base' },
    { name: 'HEARTBEAT.md', content: renderHeartbeatMd(canon, language), section: 'base' },
    { name: 'SHIELD.md', content: renderShieldMd(canon, language), section: 'base' },
  ];
}

/**
 * Generate only the Advanced Pack (4 files)
 */
export function generateAdvancedPack(
  canon: SpiritData,
  language: 'en' | 'de' = 'en'
): GeneratedFile[] {
  return [
    { name: 'SPIRIT.md', content: renderSpiritMd(canon, language), section: 'advanced' },
    { name: 'CORTEX.md', content: renderCortexMd(canon, language), section: 'advanced' },
    { name: 'MEMORY.md', content: renderMemoryMd(canon, language), section: 'advanced' },
    { name: 'VERSION.md', content: renderVersionMd(canon, language), section: 'advanced' },
    { name: 'OPS.md', content: renderOpsMd(canon, language), section: 'advanced' },
    { name: 'AGENTS.md', content: renderAgentsMd(canon, language), section: 'advanced' },
    { name: 'TOOLS.md', content: renderToolsMd(canon, language), section: 'advanced' },
  ];
}

/**
 * Generate a specific file by name
 */
export function generateSingleFile(
  fileName: FileName,
  canon: SpiritData,
  language: 'en' | 'de' = 'en'
): GeneratedFile {
  const renderers: Record<FileName, (c: SpiritData, l: 'en' | 'de') => string> = {
    'SOUL.md': renderSoulMd,
    'IDENTITY.md': renderIdentityMd,
    'USER.md': renderUserMd,
    'HEARTBEAT.md': renderHeartbeatMd,
    'SHIELD.md': renderShieldMd,
    'SPIRIT.md': renderSpiritMd,
    'CORTEX.md': renderCortexMd,
    'MEMORY.md': renderMemoryMd,
    'VERSION.md': renderVersionMd,
    'OPS.md': renderOpsMd,
    'AGENTS.md': renderAgentsMd,
    'TOOLS.md': renderToolsMd,
  };

  const renderer = renderers[fileName];
  if (!renderer) {
    throw new Error(`Unknown file name: ${fileName}`);
  }

  const section = BASE_FILES.includes(fileName as BaseFileName) ? 'base' : 'advanced';

  return {
    name: fileName,
    content: renderer(canon, language),
    section,
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get file list based on options
 */
export function getFileList(includeAdvanced: boolean): FileName[] {
  if (includeAdvanced) {
    return [...BASE_FILES, ...ADVANCED_FILES];
  }
  return [...BASE_FILES];
}

/**
 * Count files by section
 */
export function countFiles(files: GeneratedFile[]): { base: number; advanced: number } {
  return {
    base: files.filter(f => f.section === 'base').length,
    advanced: files.filter(f => f.section === 'advanced').length,
  };
}

/**
 * Calculate total content size
 */
export function calculateTotalSize(files: GeneratedFile[]): number {
  return files.reduce((sum, f) => sum + f.content.length, 0);
}

/**
 * Format file list for display
 */
export function formatFileList(files: GeneratedFile[]): string {
  const baseFiles = files.filter(f => f.section === 'base');
  const advancedFiles = files.filter(f => f.section === 'advanced');

  let result = 'Base Pack:\n';
  baseFiles.forEach(f => {
    result += `  - ${f.name}\n`;
  });

  if (advancedFiles.length > 0) {
    result += '\nAdvanced Pack:\n';
    advancedFiles.forEach(f => {
      result += `  - ${f.name}\n`;
    });
  }

  return result;
}
