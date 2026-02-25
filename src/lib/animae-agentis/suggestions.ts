/**
 * Suggestions Library
 *
 * Tool and field suggestions organized by category and agent mode.
 */

import type { AgentMode, DomainFocus } from './types';

// ============================================================================
// Tool Suggestions by Category
// ============================================================================

export const TOOL_CATEGORIES: Record<string, string[]> = {
  'File & Code': ['read_file', 'write_file', 'search_code', 'run_terminal'],
  'Web & API': ['web_search', 'fetch_url', 'api_call'],
  'Calendar': ['calendar_read', 'calendar_create', 'reminder_set'],
  'Communication': ['send_email', 'send_slack', 'create_ticket'],
  'Database': ['query_db', 'store_memory', 'search_memory'],
  'Git': ['git_status', 'git_commit', 'git_diff'],
};

// ============================================================================
// Mode-Specific Tool Defaults
// ============================================================================

export const MODE_TOOL_SUGGESTIONS: Record<AgentMode, string[]> = {
  'sidekick': ['web_search', 'read_file', 'search_memory', 'fetch_url', 'search_code'],
  'chief-of-staff': ['calendar_read', 'send_email', 'run_terminal', 'create_ticket', 'git_status'],
  'coach': ['search_memory', 'reminder_set', 'calendar_read', 'store_memory'],
};

// ============================================================================
// Agent Name Suggestions by Mode
// ============================================================================

export const NAME_SUGGESTIONS: Record<AgentMode, string[]> = {
  'sidekick': ['Scout', 'Atlas', 'Spark', 'Beacon'],
  'chief-of-staff': ['Aegis', 'Nexus', 'Vanguard', 'Sentinel'],
  'coach': ['Sage', 'Echo', 'Compass', 'Mirror'],
};

// ============================================================================
// Title Suggestions by Mode
// ============================================================================

export const TITLE_SUGGESTIONS: Record<AgentMode, string[]> = {
  'sidekick': [
    'Principal Discovery Architect',
    'Senior Research Strategist',
    'Systems Concept Architect',
  ],
  'chief-of-staff': [
    'Principal Chief of Staff',
    'Staff Operations Architect',
    'Program Portfolio Strategist',
  ],
  'coach': [
    'Executive Performance Coach',
    'Behavioral Systems Coach',
    'Decision Quality Coach',
  ],
};

// ============================================================================
// Domain Suggestions
// ============================================================================

export const DOMAIN_SUGGESTIONS: Record<DomainFocus, string> = {
  engineering: 'Engineering',
  product: 'Product',
  ops: 'Operations',
  research: 'Research',
  sales: 'Sales',
  legal: 'Legal',
  finance: 'Finance',
  people: 'People & HR',
  mixed: 'General / Multi-Domain',
};

export const SPECIFIC_DOMAINS: DomainFocus[] = [
  'engineering', 'product', 'ops', 'research',
  'sales', 'legal', 'finance', 'people',
];

// ============================================================================
// Rotating Group Suggestions
// ============================================================================

export const GROUP_SUGGESTIONS: Record<AgentMode, {
  groupA: string[];
  groupB: string[];
  groupC: string[];
}> = {
  'sidekick': {
    groupA: [
      'New papers & articles in focus area; anomaly signals',
      'Calendar next 24h; top 5 inbox items; top 3 blockers',
    ],
    groupB: [
      'Active project notes; open decisions list',
      'Research queue; pending experiments',
    ],
    groupC: [
      'Backlog grooming; knowledge tidy-up',
      'Pattern review; connection mapping',
    ],
  },
  'chief-of-staff': {
    groupA: [
      'Calendar today; top blockers; urgent tickets',
      'Stakeholder updates; deadline tracking',
    ],
    groupB: [
      'Open decisions; pending approvals; stale tasks',
      'Resource allocation; team capacity',
    ],
    groupC: [
      'Backlog hygiene; documentation tidy',
      'Process improvement queue; retrospective items',
    ],
  },
  'coach': {
    groupA: [
      'Weekly goals; next check-in agenda',
      'Habit tracker; streak monitoring',
    ],
    groupB: [
      'Blockers; commitments',
      'Energy patterns; focus time analysis',
    ],
    groupC: [
      'Retrospective prompts',
      'Growth areas; skill development tracking',
    ],
  },
};
