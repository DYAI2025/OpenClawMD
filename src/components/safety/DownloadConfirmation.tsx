/**
 * Download Confirmation
 * 
 * Second confirmation step before downloading high-risk configurations
 */

import { useState } from 'react';
import { Shield, Download } from 'lucide-react';
import { ClayButton } from '@/components/clay';

interface DownloadConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
  fileCount: number;
  isHighRisk: boolean;
}

export function DownloadConfirmation({
  onConfirm,
  onCancel,
  fileCount,
  isHighRisk,
}: DownloadConfirmationProps) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="bg-clay-sand/50 rounded-2xl p-6 border-2 border-clay-stone">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full ${isHighRisk ? 'bg-red-100 dark:bg-red-950/30' : 'bg-clay-mint/50'}`}>
          <Shield className={`w-6 h-6 ${isHighRisk ? 'text-red-600' : 'text-clay-charcoal'}`} />
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="font-semibold text-clay-charcoal text-lg">
              Final Confirmation Required
            </h3>
            <p className="text-sm text-clay-charcoal/70 mt-1">
              You are about to download {fileCount} configuration {fileCount === 1 ? 'file' : 'files'}.
            </p>
          </div>

          {isHighRisk && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/30 rounded-xl p-4 text-sm">
              <p className="font-medium text-red-800 mb-2">
                High-Risk Configuration Notice
              </p>
              <p className="text-red-700">
                This configuration grants significant autonomy to your agent. 
                Please review all files before deployment.
              </p>
            </div>
          )}

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1 w-5 h-5 accent-clay-coral"
            />
            <span className="text-sm text-clay-charcoal">
              I confirm that I have reviewed the generated configuration files 
              and accept full responsibility for their deployment and effects.
            </span>
          </label>

          <div className="flex gap-3 pt-2">
            <ClayButton
              variant="pill"
              color="stone"
              onClick={onCancel}
            >
              Review Files
            </ClayButton>
            <ClayButton
              variant="pill"
              color={isHighRisk ? 'coral' : 'mint'}
              onClick={onConfirm}
              disabled={!confirmed}
            >
              <Download className="w-4 h-4" />
              Download {fileCount} Files
            </ClayButton>
          </div>
        </div>
      </div>
    </div>
  );
}
