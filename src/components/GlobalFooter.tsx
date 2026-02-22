import type { AppView } from '../App';

interface GlobalFooterProps {
  onNavigate?: (view: AppView) => void;
}

export function GlobalFooter({ onNavigate }: GlobalFooterProps) {
  return (
    <footer className="w-full px-6 py-12 mt-auto">
      <div className="max-w-6xl mx-auto border-t border-clay-peach/20 pt-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-clay-coral shadow-clay" />
            <span className="text-lg font-bold text-clay-charcoal">Animae Agentis</span>
          </div>
          <p className="text-sm text-clay-charcoal/50 leading-relaxed">
            Agentic Autopoesis. <br />
            Self-defining autonomous systems built on OpenCLAW 0.1.
          </p>
        </div>

        {onNavigate && (
          <div className="mt-8 flex items-center justify-center gap-6 text-sm">
            <button
              onClick={() => onNavigate('legal-impressum')}
              className="text-clay-charcoal/40 hover:text-clay-coral transition-colors"
            >
              Impressum
            </button>
            <span className="text-clay-charcoal/20">|</span>
            <button
              onClick={() => onNavigate('legal-privacy')}
              className="text-clay-charcoal/40 hover:text-clay-coral transition-colors"
            >
              Privacy Policy
            </button>
            <span className="text-clay-charcoal/20">|</span>
            <button
              onClick={() => onNavigate('legal-tos')}
              className="text-clay-charcoal/40 hover:text-clay-coral transition-colors"
            >
              Terms & Conditions
            </button>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-clay-peach/10 flex flex-col md:flex-row items-center justify-between gap-6 opacity-30 italic text-[10px] text-clay-charcoal">
          <div>&copy; 2026 Animae Agentis &middot; Stateless Client-First Generator</div>
          <div>v1.0.0 &middot; Verified for Google AdSense Compliance</div>
        </div>
      </div>
    </footer>
  );
}
