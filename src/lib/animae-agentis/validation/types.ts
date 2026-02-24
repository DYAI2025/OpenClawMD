/**
 * Validation Types for the OpenClawMD Validator
 *
 * Traffic light scoring, findings, repair actions.
 */

import type { GeneratedFile } from '../types';

export type TrafficLight = 'green' | 'yellow' | 'red';

export type FindingSeverity = 'ERROR' | 'WARN' | 'INFO';

export type ConstraintType =
  | 'broken-ref'
  | 'contradiction'
  | 'runtime-mismatch'
  | 'ambiguity'
  | 'anti-routine'
  | 'size-risk';

export type CategoryId = 'bootstrap' | 'policy' | 'heartbeat' | 'security' | 'purpose';

export interface CategoryScore {
  id: CategoryId;
  label: string;
  score: number; // 0-100
}

export interface ValidatorFinding {
  code: string;
  severity: FindingSeverity;
  where: string;
  what: string;
  impact: string;
  constraintType: ConstraintType;
}

export interface PromiseClaim {
  claim: string;
  status: 'held' | 'partially-held' | 'not-held';
  detail: string;
}

export interface RepairAction {
  code: string;
  file: string;
  description: string;
  before: string;
  after: string;
}

export interface ValidatorReport {
  trafficLight: TrafficLight;
  overallScore: number;
  categories: CategoryScore[];
  findings: ValidatorFinding[];
  promises: PromiseClaim[];
  strengths: string[];
  timestamp: string;
  presetDetected: string | null;
}

export interface RepairResult {
  repairedFiles: GeneratedFile[];
  actions: RepairAction[];
  reportAfter: ValidatorReport;
}
