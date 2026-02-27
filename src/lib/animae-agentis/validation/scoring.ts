/**
 * Scoring Engine v2.2
 *
 * Converts findings into category scores and a traffic light rating.
 *
 * Traffic light rules:
 *   GREEN: no ERRORs, max N WARNs (configurable, default 1), score >= 80
 *   YELLOW: 1-2 ERRORs or score 60-79 or WARNs > threshold
 *   RED: >= 3 ERRORs or any critical contradiction ERROR
 */

import type { ValidatorFinding, CategoryScore, CategoryId, TrafficLight, ValidatorOptions } from './types';

const CATEGORY_LABELS: Record<CategoryId, string> = {
  bootstrap: 'Bootstrap / Runtime Fit',
  policy: 'Policy Consistency',
  heartbeat: 'Heartbeat Correctness',
  security: 'Security Surface',
  purpose: 'Purpose Preservation',
  skill: 'Skill Kernel Integrity',
};

const SEVERITY_WEIGHTS = {
  ERROR: 25,
  WARN: 10,
  INFO: 2,
} as const;

function scoreCategory(findings: ValidatorFinding[]): number {
  let penalty = 0;
  for (const f of findings) {
    penalty += SEVERITY_WEIGHTS[f.severity];
  }
  return Math.max(0, 100 - penalty);
}

export function computeCategoryScores(
  byCategory: Record<CategoryId, ValidatorFinding[]>,
): CategoryScore[] {
  const ids: CategoryId[] = ['bootstrap', 'policy', 'heartbeat', 'security', 'purpose', 'skill'];
  return ids.map(id => ({
    id,
    label: CATEGORY_LABELS[id],
    score: scoreCategory(byCategory[id] ?? []),
  }));
}

export function computeOverallScore(categories: CategoryScore[]): number {
  if (categories.length === 0) return 100;
  const sum = categories.reduce((acc, c) => acc + c.score, 0);
  return Math.round(sum / categories.length);
}

const CRITICAL_CONTRADICTION_CODES = new Set([
  'RT001', 'AP001', 'HB001', 'SKILL-KERNEL-001',
]);

export function computeTrafficLight(
  findings: ValidatorFinding[],
  overallScore: number,
  options?: ValidatorOptions,
): TrafficLight {
  const errors = findings.filter(f => f.severity === 'ERROR');
  const warns = findings.filter(f => f.severity === 'WARN');
  const hasCriticalContradiction = errors.some(e =>
    CRITICAL_CONTRADICTION_CODES.has(e.code)
    || e.constraintType === 'contradiction',
  );
  const maxGreenWarns = options?.maxGreenWarns ?? 1;

  // RED: >= 3 errors, or any critical contradiction error
  if (errors.length >= 3 || hasCriticalContradiction) {
    return 'red';
  }

  // YELLOW: 1-2 errors, or score 60-79
  if (errors.length >= 1 || (overallScore >= 60 && overallScore < 80)) {
    return 'yellow';
  }

  // GREEN: no errors, warns within threshold, score >= 80
  if (errors.length === 0 && warns.length <= maxGreenWarns && overallScore >= 80) {
    return 'green';
  }

  // Fallback: YELLOW if too many warnings
  if (warns.length > maxGreenWarns) {
    return 'yellow';
  }

  return 'green';
}
