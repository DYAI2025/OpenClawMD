/**
 * Animae Agentis Validator (v2.2)
 *
 * Orchestrates rules, scoring, and legacy quality/resonance gates.
 * Returns a ValidatorReport with traffic light, categories, findings,
 * promises, and strengths.
 *
 * v2.2: strict mode, configurable green threshold, skill category.
 */

import type { SpiritData, GeneratedFile, ValidationReport } from '../types';
import { runQualityGates, validateFileCount } from './qualityGates';
import { runResonanceGates } from './resonanceGates';
import { runAllRules } from './rules';
import { computeCategoryScores, computeOverallScore, computeTrafficLight } from './scoring';
import type { ValidatorReport, ValidatorOptions } from './types';

// ============================================================================
// Full Validation (v2 API)
// ============================================================================

export function runFullValidation(
  files: GeneratedFile[],
  canon: SpiritData,
  options?: ValidatorOptions,
): ValidatorReport {
  const { findings, promises, strengths, byCategory } = runAllRules(files, canon, options);
  const categories = computeCategoryScores(byCategory);
  const overallScore = computeOverallScore(categories);
  const trafficLight = computeTrafficLight(findings, overallScore, options);

  return {
    trafficLight,
    overallScore,
    categories,
    findings,
    promises,
    strengths,
    timestamp: new Date().toISOString(),
    presetDetected: canon.presetId ?? null,
    strict: options?.strict,
  };
}

// ============================================================================
// Legacy API (backward compatible)
// ============================================================================

export function validateAnimaeAgentis(
  files: GeneratedFile[],
  canon: SpiritData,
): ValidationReport {
  const qualityGateIssues = runQualityGates(files);
  const expectAdvanced = files.some(f => f.section === 'advanced');
  const countIssues = validateFileCount(files, expectAdvanced);
  const allQualityIssues = [...qualityGateIssues, ...countIssues];

  const resonanceGateIssues = runResonanceGates(files, canon);

  const valid =
    allQualityIssues.filter(i => i.severity === 'error').length === 0 &&
    resonanceGateIssues.filter(i => i.severity === 'error').length === 0;

  return {
    valid,
    qualityGateIssues: allQualityIssues,
    resonanceGateIssues,
    timestamp: new Date().toISOString(),
  };
}
