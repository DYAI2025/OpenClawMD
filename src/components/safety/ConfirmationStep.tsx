import React, { useState } from 'react';
import { Download, FileWarning, CheckCircle } from 'lucide-react';
import { ClayButton, ClayCard } from '@/components/clay';

interface ConfirmationStepProps {
  onConfirm: () => void;
  fileName: string;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ onConfirm, fileName }) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <ClayCard padding="lg" className="border-2 border-clay-coral/30">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 bg-clay-coral/10 rounded-xl">
          <FileWarning className="w-6 h-6 text-clay-coral" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-clay-charcoal">Final Responsibility Check</h3>
          <p className="text-sm text-clay-stone">
            You are about to export <code className="bg-clay-sand px-1 rounded">{fileName}</code>.
          </p>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className={`
            flex-shrink-0 w-6 h-6 rounded-lg border-2 mt-0.5 transition-all flex items-center justify-center
            ${agreed ? 'bg-clay-coral border-clay-coral' : 'bg-clay-base border-clay-stone group-hover:border-clay-coral'}
          `}>
            <input 
              type="checkbox" 
              className="hidden" 
              checked={agreed} 
              onChange={(e) => setAgreed(e.target.checked)}
            />
            {agreed && <CheckCircle className="w-4 h-4 text-white" />}
          </div>
          <div className="text-sm text-clay-charcoal leading-snug">
            I confirm that I have reviewed the generated Animae Agentis config and will audit its execution within a sandboxed environment first.
          </div>
        </label>
      </div>

      <ClayButton
        variant="pill"
        color="coral"
        className="w-full"
        disabled={!agreed}
        onClick={onConfirm}
      >
        <Download className="w-4 h-4" />
        Finalize & Download ZIP
      </ClayButton>
      
      <p className="text-[10px] text-center text-clay-stone mt-4 uppercase tracking-tighter">
        Timestamp and Version will be logged for this export
      </p>
    </ClayCard>
  );
};
