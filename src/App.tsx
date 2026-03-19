import { useState, useCallback, useEffect } from 'react';
import './App.css';
import { LandingPage } from './pages/LandingPage';
import { PresetsPage } from './pages/PresetsPage';
import { BuilderPage } from './pages/BuilderPage';
import { AnimaeAgentisExportPage } from './pages/AnimaeAgentisExportPage';
import { AnimaeVerbaPage } from './pages/AnimaeVerbaPage';
import { UsusPage } from './pages/UsusPage';
import { LegalPage } from './pages/LegalPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { IMPRESSUM_DE, PRIVACY_POLICY_DE, TOS_DE } from './lib/legalData';
import { GlobalFooter } from './components/GlobalFooter';
import { AppSidebar } from './components/AppSidebar';
import { CookieConsent } from './components/CookieConsent';
import { getPresetById } from './lib/presets';
import type { GeneratedFile, SpiritData } from './lib/animae-agentis/types';
import { Toaster } from '@/components/ui/sonner';
import { ClayFlowBreadcrumb } from '@/components/clay';
import { useTheme } from '@/hooks/use-theme';
import { AnimaeAgentisInterviewPage } from './pages/AnimaeAgentisInterviewPage';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { useAdSense } from '@/hooks/use-adsense';

export type AppView = 'landing' | 'presets' | 'interview' | 'builder' | 'export' | 'animae-verba' | 'usus' | 'how-it-works' | 'legal-impressum' | 'legal-privacy' | 'legal-tos';

const FLOW_VIEWS: AppView[] = ['presets', 'interview', 'builder', 'export'];

export interface HistoryEntry {
  view: AppView;
  presetId?: string;
  spirit?: Partial<SpiritData>;
  postSlug?: string;
}

// Migrate saved sessions that used the old 'blog' view
function migrateHistory(entries: HistoryEntry[]): HistoryEntry[] {
  return entries.map(entry => {
    if ((entry.view as string) === 'blog') {
      return { ...entry, view: 'usus' as AppView };
    }
    return entry;
  });
}

function App() {
  // History stack - index 0 is always the origin (landing)
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    const saved = localStorage.getItem('animae_agentis_unified_session');
    if (saved) {
      try {
        return migrateHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved session', e);
      }
    }
    return [{ view: 'landing' }];
  });

  // Initialize theme (applies .dark class to <html>)
  useTheme();

  const [spiritData, setSpiritData] = useState<{ files: GeneratedFile[]; spirit: SpiritData } | null>(null);

  // Persist history to localStorage
  useEffect(() => {
    localStorage.setItem('animae_agentis_unified_session', JSON.stringify(history));
  }, [history]);

  const currentEntry = history[history.length - 1];

  // Pause ads on tool screens, enable on content screens
  useAdSense(currentEntry.view);

  // Push a new view onto the history stack
  const pushView = useCallback((view: AppView, extra?: Partial<HistoryEntry>) => {
    setHistory(prev => [...prev, { view, ...extra }]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Jump to a specific history index (breadcrumb navigation)
  const goToHistoryIndex = useCallback((index: number) => {
    setHistory(prev => prev.slice(0, index + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Pop the top of the history stack
  const goBack = useCallback(() => {
    setHistory(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Reset to landing (used by "Create New Configuration")
  const resetToLanding = useCallback(() => {
    setHistory([{ view: 'landing' }]);
    setSpiritData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Navigation handlers — sidebar navigations reset the stack so breadcrumb stays clean
  const navigateTo = useCallback((view: AppView) => {
    setHistory([{ view: 'landing' }, { view }]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const selectPreset = useCallback((presetId: string) => {
    const preset = getPresetById(presetId);
    if (!preset) return;
    pushView('interview', { presetId, spirit: preset.spirit });
  }, [pushView]);

  const startFresh = useCallback(() => {
    pushView('interview');
  }, [pushView]);

  const showBreadcrumb = history.length > 1 && FLOW_VIEWS.includes(currentEntry.view);

  const renderView = () => {
    switch (currentEntry.view) {
      case 'landing':
        return (
          <LandingPage
            onSelectPreset={() => navigateTo('presets')}
            onStartFresh={startFresh}
            onOpenAnimaeVerba={() => pushView('animae-verba')}
            onOpenUsus={() => pushView('usus')}
            onOpenUsusArticle={(slug) => pushView('usus', { postSlug: slug })}
            onHowItWorks={() => pushView('how-it-works')}
          />
        );

      case 'presets':
        return (
          <PresetsPage
            onSelectPreset={selectPreset}
            onBack={goBack}
          />
        );

      case 'interview':
        return (
          <AnimaeAgentisInterviewPage
            initialSpirit={currentEntry.spirit}
            onComplete={(files, spirit) => {
              setSpiritData({ files, spirit });
              pushView('export');
            }}
            onBack={goBack}
          />
        );

      case 'builder':
        return spiritData ? (
          <BuilderPage
            initialSpirit={spiritData.spirit}
            onComplete={(spirit: SpiritData) => {
              // Regenerate files from updated spirit
              import('./lib/animae-agentis/generator').then(({ generateAnimaeAgentisFiles }) => {
                const output = generateAnimaeAgentisFiles(spirit, { includeAdvancedPack: true, language: 'en' });
                setSpiritData({ files: output.files, spirit });
                pushView('export');
              });
            }}
            onBack={goBack}
          />
        ) : null;

      case 'export':
        return spiritData ? (
          <AnimaeAgentisExportPage
            spirit={spiritData.spirit}
            onBack={goBack}
            onNewConfig={resetToLanding}
            onFineTune={() => pushView('builder')}
          />
        ) : null;

      case 'how-it-works':
        return (
          <HowItWorksPage
            onBack={goBack}
            onStartFresh={startFresh}
            onSelectPreset={() => navigateTo('presets')}
          />
        );

      case 'animae-verba':
        return <AnimaeVerbaPage onBack={goBack} />;

      case 'usus':
        return <UsusPage onBack={goBack} initialPostSlug={currentEntry.postSlug} />;

      case 'legal-impressum':
        return <LegalPage title="Impressum" content={IMPRESSUM_DE} onBack={goBack} />;
      case 'legal-privacy':
        return <LegalPage title="Datenschutzerklärung" content={PRIVACY_POLICY_DE} onBack={goBack} />;
      case 'legal-tos':
        return <LegalPage title="Terms & Conditions" content={TOS_DE} onBack={goBack} />;

      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-clay-base relative overflow-x-hidden flex w-full">
        {/* Background blobs */}
        <div className="blob-bg blob-1" />
        <div className="blob-bg blob-2" />
        <div className="blob-bg blob-3" />

        <AppSidebar
          currentView={currentEntry.view}
          onNavigate={navigateTo}
          onStartFresh={startFresh}
        />

        <SidebarInset className="bg-transparent flex flex-col min-h-screen">
          {/* Global Sticky Header */}
          <div className="sticky top-0 z-40 w-full bg-clay-base/60 backdrop-blur-xl border-b border-clay-stone/10 supports-[backdrop-filter]:bg-clay-base/40">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 h-14 md:h-16">
              <div className="flex items-center gap-2 md:gap-3">
                <SidebarTrigger className="text-clay-charcoal hover:bg-clay-peach/20 rounded-full w-9 h-9 md:w-10 md:h-10 transition-colors" aria-label="Toggle sidebar" />
                <div className="h-5 w-px bg-clay-stone/20 mx-0.5 hidden sm:block" />
                <button 
                  onClick={resetToLanding}
                  className="flex items-center gap-2 group transition-all"
                >
                  <span className="text-sm md:text-base font-black text-clay-charcoal tracking-tight group-hover:text-clay-coral">Animae Agentis</span>
                  <span className="hidden lg:inline-block px-2 py-0.5 rounded-full bg-clay-mint/20 text-[10px] font-black text-clay-mint uppercase tracking-widest border border-clay-mint/10">v1.0.0</span>
                </button>
              </div>

              <div className="flex items-center gap-3 md:gap-4">
                {currentEntry.view !== 'landing' && (
                  <button
                    onClick={goBack}
                    className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-clay-charcoal/60 hover:text-clay-coral transition-colors"
                  >
                    <span className="md:inline">Back</span>
                  </button>
                )}
                <button
                  onClick={startFresh}
                  className="px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-clay-coral text-white text-[10px] md:text-xs font-black uppercase tracking-widest shadow-clay hover:shadow-clay-lifted hover:-translate-y-0.5 transition-all"
                >
                  <span className="hidden xs:inline">New Agent</span>
                  <span className="xs:hidden">New</span>
                </button>
              </div>
            </div>
          </div>

          {/* Breadcrumb - only for flow views */}
          {showBreadcrumb && (
            <div className="relative z-20 px-6 pt-6 max-w-5xl mx-auto w-full">
              <ClayFlowBreadcrumb history={history} onNavigate={goToHistoryIndex} />
            </div>
          )}

          {/* Main content */}
          <main id="main-content" key={currentEntry.view} className="relative z-10 animate-slide-up will-change-transform flex-1 pt-2">
            {renderView()}
          </main>

          <GlobalFooter onNavigate={navigateTo} />

          <CookieConsent />

          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'var(--clay-base)',
                color: 'var(--clay-charcoal)',
                border: '1px solid var(--clay-overlay-border)',
                boxShadow: 'var(--shadow-ambient), var(--shadow-key)',
                borderRadius: '1rem',
              },
            }}
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default App;
