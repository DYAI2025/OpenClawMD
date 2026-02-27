/**
 * Animae Agentis Validation v2.2
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
export { improveFiles } from './improve';
export { runAllRules, CODE_ALIASES } from './rules';
export { computeCategoryScores, computeOverallScore, computeTrafficLight } from './scoring';

// Extractor
export { extractPolicies } from './extractor';
export type {
  ExtractedPolicies,
  ApprovalExtraction,
  RetryExtraction,
  TruthPolicyExtraction,
  StopWordExtraction,
  HeartbeatActionExtraction,
  CanonicalClaimExtraction,
  SkillKernelExtraction,
  PresetSnapshotExtraction,
  MaintenancePolicyExtraction,
  RuntimeAssumptionExtraction,
} from './extractor';

// Types
export type {
  TrafficLight,
  FindingSeverity,
  ConstraintType,
  CategoryId,
  CategoryScore,
  EvidenceLine,
  ValidatorFinding,
  ValidatorOptions,
  PromiseClaim,
  RepairAction,
  ValidatorReport,
  RepairResult,
} from './types';
