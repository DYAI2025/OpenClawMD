/**
 * Interview Question Catalog
 * 
 * All questions organized by phase
 * Rule: 1-2 questions per phase, then wait
 */

import type { InterviewPhase, VibeCodingRole } from '../types';

export interface Question {
  id: string;
  phase: InterviewPhase;
  question: string;
  description?: string;
  type: 'choice' | 'text' | 'multiselect' | 'confirm';
  options?: QuestionOption[];
  placeholder?: string;
  required?: boolean;
}

export interface QuestionOption {
  value: string;
  label: string;
  description?: string;
}

// ============================================================================
// Phase 0: HANDSHAKE
// ============================================================================

export const HANDSHAKE_QUESTIONS: Question[] = [
  {
    id: 'pack-selection',
    phase: 'handshake',
    question: 'Which configuration pack do you want?',
    description: 'The Advanced Pack includes additional files for workspace management.',
    type: 'choice',
    options: [
      {
        value: 'base',
        label: 'Base Pack (5 files)',
        description: 'SOUL, IDENTITY, USER, HEARTBEAT, SHIELD — Core configuration only',
      },
      {
        value: 'advanced',
        label: 'Advanced Pack (9 files)',
        description: 'Base + CANON, INDEX, MEMORY, VERSION — Full workspace system',
      },
    ],
    required: true,
  },
  {
    id: 'language-selection',
    phase: 'handshake',
    question: 'Preferred output language?',
    type: 'choice',
    options: [
      { value: 'en', label: 'English' },
      { value: 'de', label: 'Deutsch' },
    ],
    required: true,
  },
];

// ============================================================================
// Phase 1: DISCOVERY
// ============================================================================

export const DISCOVERY_QUESTIONS: Question[] = [
  {
    id: 'agent-mode',
    phase: 'discovery',
    question: 'What mode should your agent operate in?',
    description: 'This determines the fundamental approach your agent takes.',
    type: 'choice',
    options: [
      {
        value: 'sidekick',
        label: 'Sidekick (Discovery)',
        description: 'Helps you explore, discover patterns, and reframe problems',
      },
      {
        value: 'chief-of-staff',
        label: 'Chief of Staff (Execution)',
        description: 'Orchestrates initiatives and executes with your approval',
      },
      {
        value: 'coach',
        label: 'Coach (Accountability)',
        description: 'Holds you accountable and reflects your patterns',
      },
    ],
    required: true,
  },
  {
    id: 'problem-statement',
    phase: 'discovery',
    question: 'What problem are you trying to solve?',
    description: 'Describe in one sentence what you want this agent to help with.',
    type: 'text',
    placeholder: 'e.g., "I need help prioritizing features while maintaining technical quality"',
    required: true,
  },
  {
    id: 'success-metrics',
    phase: 'discovery',
    question: 'How will you know this is working? (Optional)',
    description: 'List 2-3 observable signals that would indicate success in 30 days.',
    type: 'text',
    placeholder: 'e.g., "Decisions made faster, less back-and-forth, clearer priorities"',
    required: false,
  },
];

// ============================================================================
// Phase 2: VIBECODING
// ============================================================================

export function getVibeCodingQuestion(roles: VibeCodingRole[]): Question {
  return {
    id: 'vibecoding-role',
    phase: 'vibecoding',
    question: 'Which specialized role fits best?',
    description: 'Choose a title that reflects how you want to work together.',
    type: 'choice',
    options: roles.map(role => ({
      value: role.title,
      label: `${role.title}`,
      description: `${role.subtitle} — ${role.description}`,
    })),
    required: true,
  };
}

export const TONE_QUESTIONS: Question[] = [
  {
    id: 'tone-precision',
    phase: 'vibecoding',
    question: 'How much detail do you prefer?',
    type: 'choice',
    options: [
      { value: 'minimalist', label: 'Minimalist', description: 'Essential information only' },
      { value: 'explanatory', label: 'Explanatory', description: 'Context and reasoning provided' },
    ],
    required: true,
  },
  {
    id: 'tone-method',
    phase: 'vibecoding',
    question: 'How should the agent engage with you?',
    type: 'choice',
    options: [
      { value: 'socratic', label: 'Socratic', description: 'Questions to guide discovery' },
      { value: 'instructional', label: 'Instructional', description: 'Clear directions and steps' },
    ],
    required: true,
  },
  {
    id: 'tone-directness',
    phase: 'vibecoding',
    question: 'What communication style works for you?',
    type: 'choice',
    options: [
      { value: 'direct', label: 'Direct', description: 'Straight to the point' },
      { value: 'gentle', label: 'Gentle', description: 'Considerate, softer approach' },
    ],
    required: true,
  },
];

// ============================================================================
// Phase 3: CONSTITUTION
// ============================================================================

export const CONSTITUTION_QUESTIONS: Question[] = [
  {
    id: 'negative-constraints',
    phase: 'constitution',
    question: 'Name 3 things the agent should NEVER do.',
    description: 'These are hard boundaries that cannot be overridden.',
    type: 'text',
    placeholder: 'e.g., "Never send emails without approval, never guess at data, never make commitments on my behalf"',
    required: true,
  },
  {
    id: 'truth-policy',
    phase: 'constitution',
    question: 'How should the agent handle uncertainty?',
    type: 'choice',
    options: [
      {
        value: 'mark_uncertainty',
        label: 'Mark Uncertainty',
        description: 'Explicitly flag when evidence is weak',
      },
      {
        value: 'calibrated_confidence',
        label: 'Calibrated Confidence',
        description: 'Express confidence levels (e.g., "I\'m 70% confident...")',
      },
      {
        value: 'confident_only',
        label: 'Confident Only',
        description: 'Only state high-confidence claims',
      },
    ],
    required: true,
  },
];

// ============================================================================
// Phase 4: PULSE
// ============================================================================

export const PULSE_QUESTIONS: Question[] = [
  {
    id: 'action-mode',
    phase: 'pulse',
    question: 'How autonomous should the agent be?',
    type: 'choice',
    options: [
      {
        value: 'recommend_only',
        label: 'Recommend Only',
        description: 'Suggests actions, waits for your approval',
      },
      {
        value: 'execute_with_approval',
        label: 'Execute with Approval',
        description: 'Prepares actions, confirms before executing',
      },
      {
        value: 'autonomous_in_sandbox',
        label: 'Autonomous in Sandbox',
        description: 'Acts freely in safe boundaries, escalates edge cases',
      },
    ],
    required: true,
  },
  {
    id: 'surprise-appetite',
    phase: 'pulse',
    question: 'Should the agent actively surprise you?',
    description: 'Surprises can be insights, new perspectives, or process improvements.',
    type: 'choice',
    options: [
      { value: 'low', label: 'Low', description: 'Only when explicitly stuck' },
      { value: 'medium', label: 'Medium', description: 'Occasional relevant suggestions' },
      { value: 'high', label: 'High', description: 'Active pattern-seeking and challenging' },
    ],
    required: true,
  },
  {
    id: 'surprise-cadence',
    phase: 'pulse',
    question: 'How often should surprises happen?',
    type: 'choice',
    options: [
      { value: 'daily_micro', label: 'Daily (Micro)', description: 'Small observations every day' },
      { value: 'weekly_deep', label: 'Weekly (Deep)', description: 'One substantial insight per week' },
      { value: 'trigger', label: 'Trigger-based', description: 'Only when patterns indicate value' },
    ],
    required: true,
  },
  {
    id: 'output-format',
    phase: 'pulse',
    question: 'What output format do you prefer?',
    type: 'choice',
    options: [
      { value: 'result_only', label: 'Result Only', description: 'Just the answer' },
      { value: 'result_plus_plan', label: 'Result + Plan', description: 'Answer plus next steps' },
      { value: 'options_tradeoffs', label: 'Options with Tradeoffs', description: 'Multiple paths compared' },
    ],
    required: true,
  },
  {
    id: 'stop-words',
    phase: 'pulse',
    question: 'Emergency stop words? (Optional)',
    description: 'Words that immediately halt the agent and return control.',
    type: 'text',
    placeholder: 'e.g., "STOP, HALT, ABORT" (comma-separated)',
    required: false,
  },
];

// ============================================================================
// Phase 5: GENERATION (Readiness Check)
// ============================================================================

export const GENERATION_QUESTIONS: Question[] = [
  {
    id: 'readiness-confirm',
    phase: 'generation',
    question: 'Ready to generate?',
    description: 'Review your answers and confirm to generate the configuration files.',
    type: 'confirm',
    required: true,
  },
];

// ============================================================================
// Get Questions by Phase
// ============================================================================

export function getQuestionsForPhase(phase: InterviewPhase): Question[] {
  switch (phase) {
    case 'handshake':
      return HANDSHAKE_QUESTIONS;
    case 'discovery':
      return DISCOVERY_QUESTIONS;
    case 'constitution':
      return CONSTITUTION_QUESTIONS;
    case 'pulse':
      return PULSE_QUESTIONS;
    case 'generation':
      return GENERATION_QUESTIONS;
    default:
      return [];
  }
}
