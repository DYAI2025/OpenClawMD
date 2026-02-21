import React from 'react';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, className = '' }) => {
  const config = {
    low: {
      color: 'bg-clay-mint/20 text-clay-charcoal border-clay-mint/30',
      icon: <ShieldCheck className="w-3 h-3" />,
      label: 'Secure'
    },
    medium: {
      color: 'bg-clay-peach/20 text-clay-charcoal border-clay-peach/30',
      icon: <Shield className="w-3 h-3" />,
      label: 'Balanced'
    },
    high: {
      color: 'bg-clay-coral/20 text-clay-coral border-clay-coral/30',
      icon: <ShieldAlert className="w-3 h-3" />,
      label: 'High Autonomy'
    },
    critical: {
      color: 'bg-clay-coral text-white border-clay-coral shadow-sm',
      icon: <ShieldAlert className="w-3 h-3 animate-pulse" />,
      label: 'OVERCLAW'
    }
  };

  const { color, icon, label } = config[level];

  return (
    <div className={`
      inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider
      ${color} ${className}
    `}>
      {icon}
      <span>{label}</span>
    </div>
  );
};
