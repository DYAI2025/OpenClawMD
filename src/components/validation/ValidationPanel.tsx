/**
 * ValidationPanel
 *
 * Traffic light validation display with category scores,
 * findings, promises, and repair functionality.
 */

import { useState } from 'react';
import {
  Shield, CheckCircle, AlertTriangle, XCircle,
  Wrench, ChevronDown, ChevronUp, Sparkles,
  FileText, ArrowRight,
} from 'lucide-react';
import { ClayButton, ClayCard } from '@/components/clay';
import type { ValidatorReport, RepairResult, RepairAction } from '@/lib/animae-agentis/validation/types';

interface ValidationPanelProps {
  report: ValidatorReport;
  onRepair: () => RepairResult;
  onRepairApplied: (result: RepairResult) => void;
}

// ============================================================================
// Traffic Light
// ============================================================================

function TrafficLightBadge({ light, score }: { light: ValidatorReport['trafficLight']; score: number }) {
  const config = {
    green: {
      bg: 'bg-emerald-100 dark:bg-emerald-950/40',
      ring: 'ring-emerald-400',
      dot: 'bg-emerald-500',
      text: 'text-emerald-800 dark:text-emerald-300',
      label: 'VALID',
    },
    yellow: {
      bg: 'bg-amber-100 dark:bg-amber-950/40',
      ring: 'ring-amber-400',
      dot: 'bg-amber-500',
      text: 'text-amber-800 dark:text-amber-300',
      label: 'WARNINGS',
    },
    red: {
      bg: 'bg-red-100 dark:bg-red-950/40',
      ring: 'ring-red-400',
      dot: 'bg-red-500',
      text: 'text-red-800 dark:text-red-300',
      label: 'ERRORS',
    },
  }[light];

  return (
    <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl ${config.bg} ring-1 ${config.ring}`}>
      <div className={`w-10 h-10 rounded-full ${config.dot} shadow-clay flex items-center justify-center`}>
        {light === 'green' && <CheckCircle className="w-6 h-6 text-white" />}
        {light === 'yellow' && <AlertTriangle className="w-6 h-6 text-white" />}
        {light === 'red' && <XCircle className="w-6 h-6 text-white" />}
      </div>
      <div>
        <div className={`text-lg font-bold ${config.text}`}>{config.label}</div>
        <div className={`text-sm ${config.text} opacity-80`}>Score: {score}/100</div>
      </div>
      {light === 'green' && (
        <div className={`ml-auto text-sm ${config.text}`}>Ready to download</div>
      )}
      {light === 'yellow' && (
        <div className={`ml-auto text-sm ${config.text}`}>Download available (review recommended)</div>
      )}
      {light === 'red' && (
        <div className={`ml-auto text-sm ${config.text}`}>Repair required before download</div>
      )}
    </div>
  );
}

// ============================================================================
// Category Bars
// ============================================================================

function CategoryBar({ label, score }: { label: string; score: number }) {
  const barColor =
    score >= 80 ? 'bg-emerald-500' :
    score >= 60 ? 'bg-amber-500' :
    'bg-red-500';

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-clay-charcoal/70 w-44 shrink-0 truncate">{label}</span>
      <div className="flex-1 h-2.5 bg-clay-sand/60 dark:bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-sm font-mono text-clay-charcoal/60 w-10 text-right">{score}</span>
    </div>
  );
}

// ============================================================================
// Severity Badge
// ============================================================================

function SeverityBadge({ severity }: { severity: string }) {
  const styles = {
    ERROR: 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400',
    WARN: 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400',
    INFO: 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400',
  }[severity] ?? 'bg-gray-100 text-gray-600';

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles}`}>
      {severity}
    </span>
  );
}

// ============================================================================
// Promise Status
// ============================================================================

function PromiseStatus({ status }: { status: string }) {
  const styles = {
    held: 'text-emerald-600 dark:text-emerald-400',
    'partially-held': 'text-amber-600 dark:text-amber-400',
    'not-held': 'text-red-600 dark:text-red-400',
  }[status] ?? 'text-gray-500';

  const labels = {
    held: 'Held',
    'partially-held': 'Partially held',
    'not-held': 'Not held',
  }[status] ?? status;

  return <span className={`text-sm font-medium ${styles}`}>{labels}</span>;
}

// ============================================================================
// Change Report (after repair)
// ============================================================================

function ChangeReport({ actions }: { actions: RepairAction[] }) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-clay-charcoal flex items-center gap-2">
        <FileText className="w-4 h-4" />
        Changes Applied
      </h4>
      {actions.map((action, i) => (
        <div key={i} className="bg-white/50 dark:bg-white/[0.03] rounded-lg p-4 border border-white/60 dark:border-white/[0.06]">
          <div className="flex items-center gap-2 mb-2">
            <code className="text-xs font-mono bg-clay-sand/40 dark:bg-white/10 px-1.5 py-0.5 rounded text-clay-charcoal/80">
              {action.code}
            </code>
            <span className="text-sm text-clay-charcoal/60">{action.file}</span>
          </div>
          <p className="text-sm text-clay-charcoal/80 mb-2">{action.description}</p>
          <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-start text-xs">
            <div className="bg-red-50 dark:bg-red-950/20 rounded p-2 text-red-700 dark:text-red-400 font-mono whitespace-pre-wrap">
              {action.before}
            </div>
            <ArrowRight className="w-4 h-4 text-clay-charcoal/40 mt-2 shrink-0" />
            <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded p-2 text-emerald-700 dark:text-emerald-400 font-mono whitespace-pre-wrap">
              {action.after}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Main Panel
// ============================================================================

export function ValidationPanel({ report, onRepair, onRepairApplied }: ValidationPanelProps) {
  const [showFindings, setShowFindings] = useState(report.trafficLight !== 'green');
  const [showPromises, setShowPromises] = useState(false);
  const [repairResult, setRepairResult] = useState<RepairResult | null>(null);
  const [isRepairing, setIsRepairing] = useState(false);

  const handleRepair = () => {
    setIsRepairing(true);
    // Small delay for visual feedback
    setTimeout(() => {
      const result = onRepair();
      setRepairResult(result);
      setIsRepairing(false);
      onRepairApplied(result);
    }, 400);
  };

  const activeReport = repairResult?.reportAfter ?? report;
  const errorCount = activeReport.findings.filter(f => f.severity === 'ERROR').length;
  const warnCount = activeReport.findings.filter(f => f.severity === 'WARN').length;

  return (
    <ClayCard padding="lg" className="mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-clay-sage shadow-clay flex items-center justify-center">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-clay-charcoal">Validation Report</h3>
          <p className="text-xs text-clay-charcoal/50">
            {activeReport.presetDetected
              ? `Preset: ${activeReport.presetDetected.toUpperCase()}`
              : 'Custom configuration'}
            {' • '}
            {errorCount} error{errorCount !== 1 ? 's' : ''}, {warnCount} warning{warnCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Traffic Light */}
      <TrafficLightBadge light={activeReport.trafficLight} score={activeReport.overallScore} />

      {/* Category Scores */}
      <div className="mt-5 space-y-2">
        {activeReport.categories.map(cat => (
          <CategoryBar key={cat.id} label={cat.label} score={cat.score} />
        ))}
      </div>

      {/* Strengths */}
      {activeReport.strengths.length > 0 && (
        <div className="mt-5">
          <h4 className="text-sm font-semibold text-clay-charcoal flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-clay-sage" />
            Strengths
          </h4>
          <ul className="space-y-1">
            {activeReport.strengths.map((s, i) => (
              <li key={i} className="text-sm text-clay-charcoal/70 flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Findings (collapsible) */}
      {activeReport.findings.length > 0 && (
        <div className="mt-5">
          <button
            onClick={() => setShowFindings(!showFindings)}
            className="flex items-center gap-2 text-sm font-semibold text-clay-charcoal hover:text-clay-charcoal/80 transition-colors w-full"
          >
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Findings ({activeReport.findings.length})
            {showFindings ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
          </button>
          {showFindings && (
            <div className="mt-3 space-y-2">
              {activeReport.findings.map((f, i) => (
                <div
                  key={i}
                  className="bg-white/50 dark:bg-white/[0.03] rounded-lg p-3 border border-white/60 dark:border-white/[0.06]"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <code className="text-xs font-mono bg-clay-sand/40 dark:bg-white/10 px-1.5 py-0.5 rounded text-clay-charcoal/80">
                      {f.code}
                    </code>
                    <SeverityBadge severity={f.severity} />
                    <span className="text-xs text-clay-charcoal/50 ml-auto">{f.where}</span>
                  </div>
                  <p className="text-sm text-clay-charcoal/80">{f.what}</p>
                  <p className="text-xs text-clay-charcoal/50 mt-1">{f.impact}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Promise vs Held (collapsible) */}
      {activeReport.promises.length > 0 && (
        <div className="mt-5">
          <button
            onClick={() => setShowPromises(!showPromises)}
            className="flex items-center gap-2 text-sm font-semibold text-clay-charcoal hover:text-clay-charcoal/80 transition-colors w-full"
          >
            <FileText className="w-4 h-4 text-clay-sage" />
            Promise vs Held ({activeReport.promises.length})
            {showPromises ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
          </button>
          {showPromises && (
            <div className="mt-3 space-y-2">
              {activeReport.promises.map((p, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-white/50 dark:bg-white/[0.03] rounded-lg p-3 border border-white/60 dark:border-white/[0.06]"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-clay-charcoal/80">"{p.claim}"</p>
                    <p className="text-xs text-clay-charcoal/50 mt-0.5">{p.detail}</p>
                  </div>
                  <PromiseStatus status={p.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Repair Button (RED only, before repair) */}
      {report.trafficLight === 'red' && !repairResult && (
        <div className="mt-6 flex justify-center">
          <ClayButton
            variant="pill"
            color="coral"
            onClick={handleRepair}
            disabled={isRepairing}
          >
            <Wrench className="w-5 h-5" />
            {isRepairing ? 'Repairing...' : 'Repair Configuration'}
          </ClayButton>
        </div>
      )}

      {/* Change Report (after repair) */}
      {repairResult && repairResult.actions.length > 0 && (
        <div className="mt-6 pt-4 border-t border-clay-stone/20">
          <ChangeReport actions={repairResult.actions} />
        </div>
      )}

      {/* Repair success message */}
      {repairResult && (
        <div className="mt-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-3 text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          Configuration repaired. {repairResult.actions.length} change{repairResult.actions.length !== 1 ? 's' : ''} applied.
          {repairResult.reportAfter.trafficLight !== 'red' && ' Ready to download.'}
        </div>
      )}
    </ClayCard>
  );
}
