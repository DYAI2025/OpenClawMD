import type { SpiritData } from '../soulforge/types';
import type { RiskLevel } from '@/components/safety/RiskBadge';

/**
 * Calculates the risk level based on the SpiritData parameters.
 */
export function calculateRiskLevel(canon: Partial<SpiritData>): RiskLevel {
  if (!canon) return 'low';

  const hasHighAutonomy = canon.autonomy?.actionMode === 'autonomous_in_sandbox';
  const hasHighAppetite = canon.surprise?.appetite === 'high';
  const hasExternalAccess = canon.surprise?.boundaries?.toLowerCase().includes('outreach') || 
                           canon.autonomy?.approvalThreshold?.toLowerCase().includes('external');

  if (hasHighAutonomy && hasExternalAccess) return 'critical';
  if (hasHighAutonomy || hasHighAppetite) return 'high';
  
  // Example for medium: execution with approval or medium initiative
  if (canon.autonomy?.actionMode === 'execute_with_approval') return 'medium';

  return 'low';
}

/**
 * Validates if the configuration requires a legal disclaimer (Overclaw).
 */
export function requiresSafetyDisclaimer(canon: Partial<SpiritData>): boolean {
  const level = calculateRiskLevel(canon);
  return level === 'high' || level === 'critical';
}

/**
 * Log an export event (Placeholder for future telemetry/compliance).
 */
export function logSecurityEvent(event: string, metadata: any) {
  console.log(`[SECURITY_LOG] ${new Date().toISOString()}: ${event}`, metadata);
  // In a production environment, this would send to a secure logging endpoint
}
