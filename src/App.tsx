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
import { useIsMobile } from '@/hooks/use-mobile';
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
  const isMobile = useIsMobile();

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

        <SidebarInset className="bg-transparent">
          {/* Mobile header with hamburger */}
          {isMobile && (
            <div className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-clay-base/80 backdrop-blur-sm border-b border-clay-stone/20">
              <SidebarTrigger className="text-clay-charcoal" aria-label="Toggle sidebar" />
              <span className="text-sm font-semibold text-clay-charcoal">Animae Agentis</span>
            </div>
          )}

          {/* Breadcrumb - only for flow views */}
          {showBreadcrumb && (
            <div className="relative z-20 px-6 pt-3 max-w-5xl mx-auto">
              <ClayFlowBreadcrumb history={history} onNavigate={goToHistoryIndex} />
            </div>
          )}

          {/* Main content */}
          <main id="main-content" key={currentEntry.view} className="relative z-10 animate-slide-up will-change-transform flex-1 min-h-screen pt-2 md:pt-4">
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
