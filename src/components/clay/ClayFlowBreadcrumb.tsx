import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface HistoryEntry {
  view: string;
  config: unknown | null;
}

interface ClayFlowBreadcrumbProps {
  history: HistoryEntry[];
  onNavigate: (index: number) => void;
}

const VIEW_LABELS: Record<string, string> = {
  landing: 'Home',
  presets: 'Presets',
  interview: 'Interview',
  builder: 'Builder',
  export: 'Export',
  'soulforge-interview': 'SoulForge Interview',
  'soulforge-export': 'SoulForge Export',
};

export const ClayFlowBreadcrumb: React.FC<ClayFlowBreadcrumbProps> = ({
  history,
  onNavigate,
}) => {
  return (
    <nav
      aria-label="Navigation breadcrumb"
      className="flex items-center gap-1 text-xs text-clay-charcoal/50 max-w-5xl mx-auto"
    >
      {history.map((entry, index) => {
        const isLast = index === history.length - 1;
        const label = VIEW_LABELS[entry.view] ?? entry.view;

        return (
          <React.Fragment key={index}>
            {index === 0 ? (
              <button
                onClick={() => onNavigate(0)}
                className="flex items-center gap-1 hover:text-clay-charcoal transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-clay-coral/50 rounded p-0.5"
                aria-label="Go to Home"
              >
                <Home className="w-3 h-3" />
              </button>
            ) : isLast ? (
              <span className="font-medium text-clay-charcoal/70">{label}</span>
            ) : (
              <button
                onClick={() => onNavigate(index)}
                className="hover:text-clay-charcoal transition-colors focus:outline-none hover:underline focus-visible:ring-2 focus-visible:ring-clay-coral/50 rounded p-0.5"
              >
                {label}
              </button>
            )}
            {!isLast && (
              <ChevronRight className="w-3 h-3 flex-shrink-0 text-clay-charcoal/30" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
