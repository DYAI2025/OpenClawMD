/**
 * SoulForge 1.2 Types
 * 
 * Core type definitions for the OpenClaw SoulForge system.
 * Implements the thrid_embodiment pattern: SOUL + IDENTITY + USER
 */

// ============================================================================
// Core Enumerations
// ============================================================================

export type AgentMode = 'sidekick' | 'chief-of-staff' | 'coach';

export type DomainFocus = 
  | 'engineering' 
  | 'product' 
  | 'ops' 
  | 'research' 
  | 'sales' 
  | 'legal' 
  | 'finance' 
  | 'people' 
  | 'mixed';

export type TonePrecision = 'minimalist' | 'explanatory';
export type ToneMethod = 'socratic' | 'instructional';
export type ToneDirectness = 'direct' | 'gentle';

export type ActionMode = 
  | 'recommend_only' 
  | 'execute_with_approval' 
  | 'autonomous_in_sandbox';

export type SurpriseAppetite = 'low' | 'medium' | 'high';
export type SurpriseCadence = 'daily_micro' | 'weekly_deep' | 'trigger';

export type TruthPolicy = 
  | 'mark_uncertainty' 
  | 'calibrated_confidence' 
  | 'confident_only';

export type OutputFormat = 
  | 'result_only' 
  | 'result_plus_plan' 
  | 'options_tradeoffs';

export type ExplanationsPolicy = 
  | 'on_request_only' 
  | 'brief_by_default' 
  | 'detailed_by_default';

export type ConfidenceDisplay = 
  | 'off' 
  | 'low_med_high' 
  | 'calibrated';

export type AddressForm = 
  | 'formal' 
  | 'first_name' 
  | 'username';

// ============================================================================
// Interview State Machine
// ============================================================================

export type InterviewPhase = 
  | 'handshake' 
  | 'discovery' 
  | 'vibecoding' 
  | 'constitution' 
  | 'pulse' 
  | 'generation' 
  | 'validation' 
  | 'output';

export interface InterviewTurn {
  phase: InterviewPhase;
  question: string;
  answer: string;
  timestamp: string;
}

export interface InterviewState {
  phase: InterviewPhase;
  canon: Partial<CanonData>;
  history: InterviewTurn[];
  startedAt: string;
  updatedAt: string;
}

// ============================================================================
// Canon = Single Source of Truth
// ============================================================================

export interface CanonTone {
  precision?: TonePrecision;
  method?: ToneMethod;
  directness?: ToneDirectness;
}

export interface CanonAutonomy {
  actionMode?: ActionMode;
  approvalThreshold?: string;
}

export interface CanonSurprise {
  appetite?: SurpriseAppetite;
  cadence?: SurpriseCadence;
  boundaries?: string;
}

export interface CanonOutput {
  format?: OutputFormat;
  explanations?: ExplanationsPolicy;
  confidenceDisplay?: ConfidenceDisplay;
}

export interface CanonAddressing {
  form?: AddressForm;
  language?: string;
  timezone?: string;
}

/**
 * CanonData - The Single Source of Truth
 * All generated files must remain consistent with these values.
 */
export interface CanonData {
  // Identity
  agentName: string;
  agentTitle: string;
  agentMode: AgentMode;
  domainFocus: DomainFocus;
  
  // Tone
  tone: CanonTone;
  
  // Autonomy
  autonomy: CanonAutonomy;
  
  // Surprise Contract
  surprise: CanonSurprise;
  
  // Constitution
  truthPolicy: TruthPolicy;
  negativeConstraints: string[];
  
  // Output Contract
  output: CanonOutput;
  
  // Addressing
  addressing: CanonAddressing;
  
  // Stop Words
  stopWords: string[];
  
  // Operational
  rotatingGroups?: {
    groupA: string;
    groupB: string;
    groupC: string;
  };
  
  // Problem/Success (from Discovery)
  problemStatement?: string;
  successMetrics?: string[];
}

// ============================================================================
// Generation Options
// ============================================================================

export interface GenerationOptions {
  includeAdvancedPack: boolean;
  language: 'en' | 'de';
  version?: string;
}

// ============================================================================
// Generated Output
// ============================================================================

export interface GeneratedFile {
  name: string;
  content: string;
  section: 'base' | 'advanced';
}

export interface SoulForgeOutput {
  files: GeneratedFile[];
  canon: CanonData;
  options: GenerationOptions;
  generatedAt: string;
  validationReport?: ValidationReport;
}

// ============================================================================
// Validation
// ============================================================================

export type GateSeverity = 'error' | 'warning' | 'info';

export interface GateIssue {
  gateId: string;
  severity: GateSeverity;
  message: string;
  file?: string;
  suggestedFix?: string;
}

export interface ValidationReport {
  valid: boolean;
  qualityGateIssues: GateIssue[];
  resonanceGateIssues: GateIssue[];
  timestamp: string;
}

// ============================================================================
// VibeCoding Roles
// ============================================================================

export interface VibeCodingRole {
  title: string;
  subtitle: string;
  description: string;
  mode: AgentMode;
  suitableFor: string[];
}

// ============================================================================
// Preset Mapping (Legacy Compatibility)
// ============================================================================

export interface PresetCanonMapping {
  id: string;
  name: string;
  description: string;
  canon: Partial<CanonData>;
  color: 'peach' | 'mint' | 'coral' | 'sage';
}

// ============================================================================
// Export/Import
// ============================================================================

export interface SoulForgeExport {
  version: string;
  canon: CanonData;
  options: GenerationOptions;
  exportedAt: string;
  soulforgeVersion: string;
}

// ============================================================================
// Utility Types
// ============================================================================

export type FileName = 
  | 'SOUL.md' 
  | 'IDENTITY.md' 
  | 'USER.md' 
  | 'HEARTBEAT.md' 
  | 'SHIELD.md'
  | 'CANON.md'
  | 'INDEX.md'
  | 'MEMORY.md'
  | 'VERSION.md';

export type BaseFileName = Extract<FileName, 'SOUL.md' | 'IDENTITY.md' | 'USER.md' | 'HEARTBEAT.md' | 'SHIELD.md'>;
export type AdvancedFileName = Extract<FileName, 'CANON.md' | 'INDEX.md' | 'MEMORY.md' | 'VERSION.md'>;

export interface TemplateVariables {
  [key: string]: string | string[] | object;
}
