/**
 * SoulForge Validator
 * 
 * Orchestrates quality gates and resonance gates
 */

import type { SpiritData, GeneratedFile, ValidationReport } from '../types';
import { runQualityGates, validateFileCount } from './qualityGates';
import { runResonanceGates } from './resonanceGates';

/**
 * Validate a set of SoulForge files against Canon data
 * 
 * @param files - The generated files
 * @param canon - The original canon data
 * @returns A validation report with issues and resonance score
 */
export function validateSoulForge(
  files: GeneratedFile[],
  canon: SpiritData
): ValidationReport {
  // 1. Quality Gates (Internal file consistency)
  const qualityGateIssues = runQualityGates(files);
  
  // 2. File Count Validation (Added to quality issues for consistency)
  const expectAdvanced = files.some(f => f.section === 'advanced');
  const countIssues = validateFileCount(files, expectAdvanced);
  const allQualityIssues = [...qualityGateIssues, ...countIssues];
  
  // 3. Resonance Gates (Cross-file consistency)
  const resonanceGateIssues = runResonanceGates(files, canon);
  
  const valid = allQualityIssues.filter(i => i.severity === 'error').length === 0 &&
                resonanceGateIssues.filter(i => i.severity === 'error').length === 0;

  return {
    valid,
    qualityGateIssues: allQualityIssues,
    resonanceGateIssues,
    timestamp: new Date().toISOString(),
  };
}
