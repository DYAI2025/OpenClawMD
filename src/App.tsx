import { useState, useCallback, useEffect } from 'react';
import './App.css';
import { LandingPage } from './pages/LandingPage';
import { PresetsPage } from './pages/PresetsPage';
import { BuilderPage } from './pages/BuilderPage';
import { SoulForgeExportPage } from './pages/SoulForgeExportPage';
import { BlogPage } from './pages/BlogPage';
import { LegalPage } from './pages/LegalPage';
import { IMPRESSUM_DE, PRIVACY_POLICY_DE, TOS_DE } from './lib/legalData';
import { GlobalFooter } from './components/GlobalFooter';
import { CookieConsent } from './components/CookieConsent';
import { getPresetById } from './lib/presets';
import type { GeneratedFile, SpiritData } from './lib/soulforge/types';
import { Toaster } from '@/components/ui/sonner';
import { ClayFlowBreadcrumb, ClayThemeToggle } from '@/components/clay';
import { useTheme } from '@/hooks/use-theme';
import { SoulForgeInterviewPage } from './pages/SoulForgeInterviewPage';

export type AppView = 'landing' | 'presets' | 'interview' | 'builder' | 'export' | 'blog' | 'legal-impressum' | 'legal-privacy' | 'legal-tos';

export interface HistoryEntry {
  view: AppView;
  presetId?: string;
  spirit?: Partial<SpiritData>;
}

function App() {
  // History stack – index 0 is always the origin (landing)
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    const saved = localStorage.getItem('soulforge_unified_session');
    if (saved) {
      try {
        return JSON.parse(saved);
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
    localStorage.setItem('soulforge_unified_session', JSON.stringify(history));
  }, [history]);

  const currentEntry = history[history.length - 1];

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

  // Navigation handlers
  const navigateTo = useCallback((view: AppView) => {
    pushView(view);
  }, [pushView]);

  const selectPreset = useCallback((presetId: string) => {
    const preset = getPresetById(presetId);
    if (!preset) return;
    pushView('interview', { presetId, spirit: preset.spirit });
  }, [pushView]);

  const startFresh = useCallback(() => {
    pushView('interview');
  }, [pushView]);

  const renderView = () => {
    switch (currentEntry.view) {
      case 'landing':
        return (
          <LandingPage
            onSelectPreset={() => navigateTo('presets')}
            onStartFresh={startFresh}
            onOpenBlog={() => pushView('blog')}
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
          <SoulForgeInterviewPage
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
              import('./lib/soulforge/generator').then(({ generateSoulForgeFiles }) => {
                const output = generateSoulForgeFiles(spirit, { includeAdvancedPack: true, language: 'en' });
                setSpiritData({ files: output.files, spirit });
                pushView('export');
              });
            }}
            onBack={goBack}
          />
        ) : null;

      case 'export':
        return spiritData ? (
          <SoulForgeExportPage
            spirit={spiritData.spirit}
            onBack={goBack}
            onNewConfig={resetToLanding}
            onFineTune={() => pushView('builder')}
          />
        ) : null;

      case 'blog':
        return <BlogPage onBack={goBack} />;

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
    <div className="min-h-screen bg-clay-base relative overflow-x-hidden">
      {/* Background blobs */}
      <div className="blob-bg blob-1" />
      <div className="blob-bg blob-2" />
      <div className="blob-bg blob-3" />

      {/* Breadcrumb + theme toggle – visible for all views beyond landing */}
      {history.length > 1 && (
        <div className="relative z-20 px-6 pt-3 flex items-center justify-between max-w-5xl mx-auto">
          <ClayFlowBreadcrumb history={history} onNavigate={goToHistoryIndex} />
          <ClayThemeToggle />
        </div>
      )}

      {/* Main content – key triggers slide-up animation on every view change */}
      <main key={currentEntry.view} className="relative z-10 animate-slide-up will-change-transform">
        {renderView()}
      </main>

      <GlobalFooter
        onOpenLegal={(type) => {
          if (type === 'impressum') pushView('legal-impressum');
          if (type === 'privacy') pushView('legal-privacy');
          if (type === 'tos') pushView('legal-tos');
        }}
      />

      <CookieConsent />

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--clay-base)',
            color: 'var(--clay-charcoal)',
            border: `1px solid var(--clay-overlay-border)`,
            boxShadow: 'var(--shadow-ambient), var(--shadow-key)',
            borderRadius: '1rem',
          },
        }}
      />
    </div>
  );
}

export default App;
