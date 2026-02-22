/**
 * Resonance Gates
 * 
 * Cross-file consistency validation
 * Ensures all files speak the same language
 */

import type { SpiritData, GeneratedFile, GateIssue } from '../types';

export interface ResonanceGate {
  id: string;
  check: (files: GeneratedFile[], canon: SpiritData) => GateIssue | null;
}

export const RESONANCE_GATES: ResonanceGate[] = [
  {
    id: 'NAME_CONSISTENCY',
    check: (files, canon) => {
      const identity = files.find(f => f.name === 'IDENTITY.md');
      if (!identity || !canon.agentName) return null;

      if (!identity.content.includes(canon.agentName)) {
        return {
          gateId: 'NAME_CONSISTENCY',
          severity: 'error',
          message: `IDENTITY.md name "${canon.agentName}" does not match Spirit`,
          file: 'IDENTITY.md',
        };
      }
      return null;
    },
  },
  {
    id: 'TITLE_CONSISTENCY',
    check: (files, canon) => {
      const identity = files.find(f => f.name === 'IDENTITY.md');
      if (!identity || !canon.agentTitle) return null;

      if (!identity.content.includes(canon.agentTitle)) {
        return {
          gateId: 'TITLE_CONSISTENCY',
          severity: 'error',
          message: `IDENTITY.md title does not match Spirit`,
          file: 'IDENTITY.md',
        };
      }
      return null;
    },
  },
  {
    id: 'TONE_ALIGNMENT',
    check: (files, canon) => {
      const identity = files.find(f => f.name === 'IDENTITY.md');
      if (!identity) return null;

      const toneIssues: string[] = [];

      if (canon.tone.precision && !identity.content.includes(canon.tone.precision)) {
        toneIssues.push('precision');
      }
      if (canon.tone.method && !identity.content.includes(canon.tone.method)) {
        toneIssues.push('method');
      }

      if (toneIssues.length > 0) {
        return {
          gateId: 'TONE_ALIGNMENT',
          severity: 'warning',
          message: `Tone mismatch in IDENTITY.md: ${toneIssues.join(', ')}`,
          file: 'IDENTITY.md',
        };
      }
      return null;
    },
  },
  {
    id: 'APPROVAL_ALIGNMENT',
    check: (files, canon) => {
      if (!canon.autonomy.actionMode) return null;

      const user = files.find(f => f.name === 'USER.md');
      const shield = files.find(f => f.name === 'SHIELD.md');

      const issues: string[] = [];

      if (user && !user.content.includes(canon.autonomy.actionMode)) {
        issues.push('USER.md action mode mismatch');
      }
      if (shield && !shield.content.includes(canon.autonomy.actionMode)) {
        issues.push('SHIELD.md action mode mismatch');
      }

      if (issues.length > 0) {
        return {
          gateId: 'APPROVAL_ALIGNMENT',
          severity: 'error',
          message: `Approval threshold inconsistency: ${issues.join(', ')}`,
          suggestedFix: 'Align USER.md and SHIELD.md with Spirit autonomy settings',
        };
      }
      return null;
    },
  },
  {
    id: 'SURPRISE_ALIGNMENT',
    check: (files, canon) => {
      const user = files.find(f => f.name === 'USER.md');
      const heartbeat = files.find(f => f.name === 'HEARTBEAT.md');

      if (!user || !heartbeat) return null;

      if (canon.surprise.appetite && !user.content.includes(canon.surprise.appetite)) {
        return {
          gateId: 'SURPRISE_ALIGNMENT',
          severity: 'error',
          message: 'USER.md surprise appetite does not match Spirit',
          file: 'USER.md',
        };
      }

      if (canon.surprise.cadence && !heartbeat.content.includes(canon.surprise.cadence)) {
        return {
          gateId: 'SURPRISE_ALIGNMENT',
          severity: 'error',
          message: 'HEARTBEAT.md surprise cadence does not match Spirit',
          file: 'HEARTBEAT.md',
        };
      }

      return null;
    },
  },
  {
    id: 'CONSTITUTION_COVERAGE',
    check: (files, canon) => {
      const soul = files.find(f => f.name === 'SOUL.md');
      const shield = files.find(f => f.name === 'SHIELD.md');

      if (!soul || !shield) return null;
      if (!canon.negativeConstraints || canon.negativeConstraints.length === 0) return null;

      const coverage = canon.negativeConstraints.some(c =>
        shield.content.toLowerCase().includes(c.toLowerCase().split(' ')[0])
      );

      if (!coverage) {
        return {
          gateId: 'CONSTITUTION_COVERAGE',
          severity: 'warning',
          message: 'SHIELD.md may not fully cover SOUL.md negative constraints',
          file: 'SHIELD.md',
          suggestedFix: 'Add policy gates in SHIELD.md for each negative constraint in SOUL.md',
        };
      }

      return null;
    },
  },
  {
    id: 'SPIRIT_REFERENCES',
    check: (files, canon) => {
      const spiritFile = files.find(f => f.name === 'SPIRIT.md');
      if (!spiritFile) return null;

      const requiredRefs = [
        canon.agentName,
        canon.agentTitle,
        canon.agentMode,
      ].filter(Boolean);

      if (requiredRefs.length === 0) return null;

      const missing = requiredRefs.filter(ref => !spiritFile.content.includes(ref));

      if (missing.length > 0) {
        return {
          gateId: 'SPIRIT_REFERENCES',
          severity: 'error',
          message: `SPIRIT.md missing required values: ${missing.join(', ')}`,
          file: 'SPIRIT.md',
        };
      }

      return null;
    },
  },
];

export function runResonanceGates(
  files: GeneratedFile[],
  canon: SpiritData
): GateIssue[] {
  const issues: GateIssue[] = [];
  
  for (const gate of RESONANCE_GATES) {
    const issue = gate.check(files, canon);
    if (issue) {
      issues.push(issue);
    }
  }
  
  return issues;
}

export function calculateResonanceScore(
  files: GeneratedFile[],
  canon: SpiritData
): number {
  const totalGates = RESONANCE_GATES.length;
  const issues = runResonanceGates(files, canon);
  const passedGates = totalGates - issues.filter(i => i.severity === 'error').length;
  
  return Math.round((passedGates / totalGates) * 100);
}
