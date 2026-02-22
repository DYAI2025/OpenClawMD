import { ExternalLink } from 'lucide-react';

interface GlobalFooterProps {
  onOpenLegal: (type: 'impressum' | 'privacy' | 'tos') => void;
}

export function GlobalFooter({ onOpenLegal }: GlobalFooterProps) {
  return (
    <footer className="w-full px-6 py-12 mt-auto">
      <div className="max-w-6xl mx-auto border-t border-clay-peach/20 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start text-center md:text-left">
          {/* Logo & Vision */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <div className="w-6 h-6 rounded-full bg-clay-coral shadow-clay" />
              <span className="text-lg font-bold text-clay-charcoal">Animae Agentis</span>
            </div>
            <p className="text-sm text-clay-charcoal/50 leading-relaxed">
              Agentic Autopoesis. <br />
              Self-defining autonomous systems built on OpenCLAW 0.1.
            </p>
          </div>

          {/* Ecosystem */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-clay-charcoal/30">Ecosystem</h4>
            <div className="flex flex-col gap-2">
              <a href="https://openclaw.ai" target="_blank" rel="noopener noreferrer" className="text-sm text-clay-charcoal/60 hover:text-clay-coral flex items-center gap-1 justify-center md:justify-start group">
                OpenCLAW.ai <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="https://clawhub.ai" target="_blank" rel="noopener noreferrer" className="text-sm text-clay-charcoal/60 hover:text-clay-coral flex items-center gap-1 justify-center md:justify-start group">
                ClawHub <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-clay-charcoal/30">Legal & Transparency</h4>
            <div className="flex flex-col gap-2">
              <button onClick={() => onOpenLegal('impressum')} className="text-sm text-clay-charcoal/60 hover:text-clay-coral text-center md:text-left">
                Impressum (Legal Notice)
              </button>
              <button onClick={() => onOpenLegal('privacy')} className="text-sm text-clay-charcoal/60 hover:text-clay-coral text-center md:text-left">
                Privacy Policy
              </button>
              <button onClick={() => onOpenLegal('tos')} className="text-sm text-clay-charcoal/60 hover:text-clay-coral text-center md:text-left">
                Terms & Conditions
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-clay-peach/10 flex flex-col md:flex-row items-center justify-between gap-6 opacity-30 italic text-[10px] text-clay-charcoal">
          <div>© 2026 Animae Agentis • Stateless Client-First Generator</div>
          <div>v1.0.0 • Verified for Google AdSense Compliance</div>
        </div>
      </div>
    </footer>
  );
}
