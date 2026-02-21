/**
 * Risk Modal
 * 
 * Mandatory risk acknowledgment for Overclaw/High-risk configurations
 */

import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { ClayButton } from '@/components/clay';

interface RiskModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  riskLevel: 'high' | 'medium';
}

export function RiskModal({ isOpen, onConfirm, onCancel, riskLevel }: RiskModalProps) {
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const isHighRisk = riskLevel === 'high';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-clay-base rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`p-6 ${isHighRisk ? 'bg-red-500' : 'bg-orange-500'} text-white rounded-t-2xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8" />
              <div>
                <h2 className="text-xl font-bold">
                  {isHighRisk ? 'High Autonomy Activation Required' : 'Elevated Risk Configuration'}
                </h2>
                <p className="text-white/80 text-sm">
                  {isHighRisk ? 'Overclaw Profile Selected' : 'Custom High-Risk Settings'}
                </p>
              </div>
            </div>
            <button 
              type="button"
              onClick={onCancel}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              title="Close"
              aria-label="Close"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-3 text-clay-charcoal">
            <p className="font-medium">
              You are enabling {isHighRisk ? 'the Overclaw profile' : 'a high-risk configuration'}.
            </p>
            
            <div>
              <p className="text-sm text-clay-charcoal/70 mb-2">This configuration allows:</p>
              <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                <li>Autonomous external communication</li>
                <li>Strategic initiative without prior approval</li>
                <li>Execution authority within defined scope</li>
              </ul>
            </div>

            <div>
              <p className="text-sm text-clay-charcoal/70 mb-2">This may result in:</p>
              <ul className="list-disc list-inside text-sm space-y-1 ml-2 text-red-600">
                <li>External communications being sent without review</li>
                <li>Strategic or business-impacting decisions</li>
                <li>Reputational or contractual consequences</li>
              </ul>
            </div>

            <div className="bg-clay-sand/50 p-4 rounded-xl text-sm">
              <p className="font-medium text-clay-charcoal mb-1">Important:</p>
              <p className="text-clay-charcoal/70">
                Openclaw does not monitor, intercept, or control your deployed agent. 
                You assume full responsibility for all outcomes.
              </p>
            </div>
          </div>

          {/* Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer p-4 border-2 border-clay-stone rounded-xl hover:border-clay-charcoal/30 transition-colors">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1 w-5 h-5 accent-clay-coral"
            />
            <span className="text-sm text-clay-charcoal">
              I understand and accept the operational risks associated with this configuration.
            </span>
          </label>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <ClayButton
              variant="pill"
              color="stone"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </ClayButton>
            <ClayButton
              variant="pill"
              color={isHighRisk ? 'coral' : 'peach'}
              onClick={onConfirm}
              disabled={!confirmed}
              className="flex-1"
            >
              {isHighRisk ? 'Activate Overclaw' : 'Continue'}
            </ClayButton>
          </div>
        </div>
      </div>
    </div>
  );
}
