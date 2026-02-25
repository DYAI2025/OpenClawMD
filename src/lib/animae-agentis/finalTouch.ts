/**
 * Final Touch Analysis
 *
 * Detects incomplete or default fields in SpiritData
 * and offers suggestions before download.
 */

import type { SpiritData, AgentMode } from './types';
import { getDefaultsForMode, generateAgentName } from './spirit';
import {
  NAME_SUGGESTIONS,
  TITLE_SUGGESTIONS,
  SPECIFIC_DOMAINS,
  DOMAIN_SUGGESTIONS,
  MODE_TOOL_SUGGESTIONS,
  GROUP_SUGGESTIONS,
} from './suggestions';

// ============================================================================
// Types
// ============================================================================

export interface IncompleteField {
  key: string;
  label: string;
  currentValue: string;
  isDefault: boolean;
  suggestions: string[];
  placeholder: string;
  category: 'identity' | 'tools' | 'behavior';
}

// ============================================================================
// Analysis
// ============================================================================

export function analyzeCompleteness(canon: SpiritData): IncompleteField[] {
  const fields: IncompleteField[] = [];
  const mode: AgentMode = canon.agentMode || 'sidekick';
  const defaults = getDefaultsForMode(mode);

  // Agent Name
  const autoName = generateAgentName(mode, canon.domainFocus || 'mixed');
  const defaultName = defaults.agentName || 'OpenClaw Animae Agentis';
  if (
    !canon.agentName ||
    canon.agentName === autoName ||
    canon.agentName === defaultName ||
    canon.agentName === 'OpenClaw Animae Agentis'
  ) {
    fields.push({
      key: 'agentName',
      label: 'Agent Name',
      currentValue: canon.agentName || '(not set)',
      isDefault: true,
      suggestions: NAME_SUGGESTIONS[mode] || NAME_SUGGESTIONS.sidekick,
      placeholder: '{{AGENT_NAME}}',
      category: 'identity',
    });
  }

  // Agent Title
  const defaultTitle = defaults.agentTitle || '';
  if (!canon.agentTitle || canon.agentTitle === defaultTitle) {
    fields.push({
      key: 'agentTitle',
      label: 'Agent Title',
      currentValue: canon.agentTitle || '(not set)',
      isDefault: !canon.agentTitle || canon.agentTitle === defaultTitle,
      suggestions: TITLE_SUGGESTIONS[mode] || TITLE_SUGGESTIONS.sidekick,
      placeholder: '{{AGENT_TITLE}}',
      category: 'identity',
    });
  }

  // Domain Focus
  if (canon.domainFocus === 'mixed') {
    fields.push({
      key: 'domainFocus',
      label: 'Domain Focus',
      currentValue: 'mixed (generic)',
      isDefault: true,
      suggestions: SPECIFIC_DOMAINS.map(d => DOMAIN_SUGGESTIONS[d]),
      placeholder: '{{DOMAIN_FOCUS}}',
      category: 'identity',
    });
  }

  // Tools (mode-specific suggestions)
  const toolSuggestions = MODE_TOOL_SUGGESTIONS[mode] || MODE_TOOL_SUGGESTIONS.sidekick;
  // Check if any files mention tool definitions
  fields.push({
    key: 'tools',
    label: 'Suggested Tools',
    currentValue: '(configure in TOOLS.md)',
    isDefault: true,
    suggestions: toolSuggestions,
    placeholder: '{{TOOLS}}',
    category: 'tools',
  });

  // Rotating Groups
  const defaultGroups = defaults.rotatingGroups;
  if (
    canon.rotatingGroups &&
    defaultGroups &&
    canon.rotatingGroups.groupA === defaultGroups.groupA &&
    canon.rotatingGroups.groupB === defaultGroups.groupB &&
    canon.rotatingGroups.groupC === defaultGroups.groupC
  ) {
    const groupSuggestions = GROUP_SUGGESTIONS[mode] || GROUP_SUGGESTIONS.sidekick;
    fields.push({
      key: 'rotatingGroups',
      label: 'Heartbeat Rotating Groups',
      currentValue: 'Using mode defaults',
      isDefault: true,
      suggestions: [
        groupSuggestions.groupA[0],
        groupSuggestions.groupB[0],
        groupSuggestions.groupC[0],
      ],
      placeholder: '{{ROTATING_GROUPS}}',
      category: 'behavior',
    });
  }

  return fields;
}
