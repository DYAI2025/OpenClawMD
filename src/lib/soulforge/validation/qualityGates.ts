/**
 * Quality Gates
 * 
 * File separation validation - ensures each file contains only what it should
 */

import type { GateIssue } from '../types';
import type { GeneratedFile } from '../types';

export interface QualityGate {
  id: string;
  files: string[];
  mustNotContain?: string[];
  mustContain?: string[];
  customCheck?: (content: string) => boolean;
}

/**
 * Strip the "## Checks" section from content before validation.
 * These sections are self-referential and contain the very terms
 * they instruct agents to avoid, causing false positives.
 */
function stripChecksSection(content: string): string {
  return content.replace(/## Checks[\s\S]*$/m, '');
}

export const QUALITY_GATES: QualityGate[] = [
  {
    id: 'SOUL_NO_TOOLS_OR_SCHEDULE',
    files: ['SOUL.md'],
    mustNotContain: ['Git', 'Slack', 'Calendar', 'use JSON'],
    mustContain: ['Negative Constraints', 'Truth Policy'],
  },
  {
    id: 'IDENTITY_NO_PROCESS',
    files: ['IDENTITY.md'],
    mustNotContain: ['use JSON', 'heartbeat'],
    mustContain: ['Name', 'Tone'],
  },
  {
    id: 'USER_OPERATIONAL_ONLY',
    files: ['USER.md'],
    mustNotContain: ['born', 'childhood', 'my life story'],
    mustContain: ['Output Contract', 'Autonomy', 'Stop Words', 'Surprise Contract'],
  },
  {
    id: 'HEARTBEAT_SILENT_PROTOCOL_AND_ROTATION',
    files: ['HEARTBEAT.md'],
    mustContain: ['HEARTBEAT_OK', 'Rotating Checks', 'Cheap Checks First', 'Discovery Rotation'],
  },
  {
    id: 'SHIELD_DEFENSIVE_ONLY',
    files: ['SHIELD.md'],
    mustNotContain: ['how to circumvent'],
    mustContain: ['Default Blocks', 'Policy Gates', 'Emergency Stop'],
  },
];

export function runQualityGates(files: GeneratedFile[]): GateIssue[] {
  const issues: GateIssue[] = [];

  for (const gate of QUALITY_GATES) {
    for (const fileName of gate.files) {
      const file = files.find(f => f.name === fileName);
      if (!file) {
        issues.push({
          gateId: gate.id,
          severity: 'error',
          message: `Required file ${fileName} is missing`,
          file: fileName,
        });
        continue;
      }

      // Strip self-referential Checks section before scanning
      const contentToCheck = stripChecksSection(file.content);

      // Check mustNotContain
      if (gate.mustNotContain) {
        for (const forbidden of gate.mustNotContain) {
          if (contentToCheck.toLowerCase().includes(forbidden.toLowerCase())) {
            issues.push({
              gateId: gate.id,
              severity: 'error',
              message: `File ${fileName} contains forbidden term: "${forbidden}"`,
              file: fileName,
              suggestedFix: `Remove "${forbidden}" from ${fileName} or move to appropriate file`,
            });
          }
        }
      }

      // Check mustContain
      if (gate.mustContain) {
        for (const required of gate.mustContain) {
          if (!file.content.includes(required)) {
            issues.push({
              gateId: gate.id,
              severity: 'error',
              message: `File ${fileName} missing required section: "${required}"`,
              file: fileName,
              suggestedFix: `Add "${required}" section to ${fileName}`,
            });
          }
        }
      }

      // Run custom check if defined
      if (gate.customCheck && !gate.customCheck(file.content)) {
        issues.push({
          gateId: gate.id,
          severity: 'error',
          message: `File ${fileName} failed custom validation`,
          file: fileName,
        });
      }
    }
  }

  return issues;
}

export function validateFileCount(files: GeneratedFile[], expectAdvanced: boolean): GateIssue[] {
  const issues: GateIssue[] = [];
  const baseCount = files.filter(f => f.section === 'base').length;
  const advancedCount = files.filter(f => f.section === 'advanced').length;

  if (baseCount !== 5) {
    issues.push({
      gateId: 'BASE_FILE_COUNT',
      severity: 'error',
      message: `Expected 5 base files, found ${baseCount}`,
    });
  }

  if (expectAdvanced && advancedCount !== 5) {
    issues.push({
      gateId: 'ADVANCED_FILE_COUNT',
      severity: 'error',
      message: `Expected 5 advanced files, found ${advancedCount}`,
    });
  }

  return issues;
}
