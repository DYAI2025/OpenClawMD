/**
 * Validation Types for the OpenClawMD Validator
 *
 * Traffic light scoring, findings, repair actions.
 * v2.2: evidence lines, strict mode, skill category, drift constraint type.
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
  | 'size-risk'
  | 'drift'
  | 'missing-section';

export type CategoryId = 'bootstrap' | 'policy' | 'heartbeat' | 'security' | 'purpose' | 'skill';

export interface EvidenceLine {
  file: string;
  line: number;
  text: string;
}

export interface CategoryScore {
  id: CategoryId;
  label: string;
  score: number; // 0-100
}

export interface ValidatorFinding {
  code: string;
  specCode?: string;
  severity: FindingSeverity;
  where: string;
  what: string;
  impact: string;
  constraintType: ConstraintType;
  evidence?: EvidenceLine[];
}

export interface ValidatorOptions {
  strict?: boolean;
  maxGreenWarns?: number; // default 1
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
  strict?: boolean;
}

export interface RepairResult {
  repairedFiles: GeneratedFile[];
  actions: RepairAction[];
  reportAfter: ValidatorReport;
}
