/**
 * Animae Agentis Validation
 *
 * Export all validation functions and types
 */

// Legacy API
export { runQualityGates, validateFileCount } from './qualityGates';
export { runResonanceGates, calculateResonanceScore } from './resonanceGates';
export { validateAnimaeAgentis } from './validator';

// v2 API
export { runFullValidation } from './validator';
export { repairFiles } from './repair';
export { runAllRules } from './rules';
export { computeCategoryScores, computeOverallScore, computeTrafficLight } from './scoring';
export type {
  TrafficLight,
  FindingSeverity,
  ConstraintType,
  CategoryId,
  CategoryScore,
  ValidatorFinding,
  PromiseClaim,
  RepairAction,
  ValidatorReport,
  RepairResult,
} from './types';
