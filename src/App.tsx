import { useState, useCallback, useEffect } from 'react';
import './App.css';
import { LandingPage } from './pages/LandingPage';
import { PresetsPage } from './pages/PresetsPage';
import { InterviewPage } from './pages/InterviewPage';
import { BuilderPage } from './pages/BuilderPage';
import { ExportPage } from './pages/ExportPage';
import { SoulForgeExportPage } from './pages/SoulForgeExportPage';
import { BlogPage } from './pages/BlogPage';
import type { OpenClawConfigType, PresetIdType } from './lib/openclaw/schema';
import { createEmptyConfig } from './lib/openclaw/schema';
import { createConfigFromPreset } from './lib/openclaw/presets';
import { ConfigModeOverlay } from './components/ConfigModeOverlay';
import { Toaster } from '@/components/ui/sonner';
import { ClayFlowBreadcrumb } from '@/components/clay';
import { SoulForgeInterviewPage } from './pages/SoulForgeInterviewPage';
import type { GeneratedFile, CanonData } from './lib/soulforge/types';

export type AppView = 'landing' | 'presets' | 'interview' | 'builder' | 'export' | 'blog' | 'soulforge-interview' | 'soulforge-export';

export interface HistoryEntry {
  view: AppView;
  config: OpenClawConfigType | null;
}

function App() {
  // History stack – index 0 is always the origin (landing)
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    const saved = localStorage.getItem('soulforge_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved session', e);
      }
    }
    return [{ view: 'landing', config: null }];
  });

  const [soulForgeData, setSoulForgeData] = useState<{ files: GeneratedFile[]; canon: CanonData } | null>(null);

  // Persist history to localStorage
  useEffect(() => {
    localStorage.setItem('soulforge_session', JSON.stringify(history));
  }, [history]);

  const [configModeOpen, setConfigModeOpen] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);

  const currentEntry = history[history.length - 1];

  // Push a new view onto the history stack
  const pushView = useCallback((view: AppView, config?: OpenClawConfigType | null) => {
    setHistory(prev => {
      const prevConfig = prev[prev.length - 1].config;
      return [...prev, { view, config: config !== undefined ? config : prevConfig }];
    });
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
    setHistory([{ view: 'landing', config: null }]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Hidden config mode: 7 taps within 3 seconds
  const handleLogoTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTapTime > 3000) {
      setTapCount(1);
    } else {
      const newCount = tapCount + 1;
      if (newCount >= 7) {
        setConfigModeOpen(true);
        setTapCount(0);
      } else {
        setTapCount(newCount);
      }
    }
    setLastTapTime(now);
  }, [tapCount, lastTapTime]);

  // Navigation handlers
  const navigateTo = useCallback((view: AppView) => {
    pushView(view);
  }, [pushView]);

  const selectPreset = useCallback((presetId: PresetIdType) => {
    const config = createConfigFromPreset(presetId);
    pushView('export', config);
  }, [pushView]);

  const startInterview = useCallback(() => {
    pushView('interview', createEmptyConfig());
  }, [pushView]);

  const startBuilder = useCallback((basePreset?: PresetIdType) => {
    const config = basePreset ? createConfigFromPreset(basePreset) : createEmptyConfig();
    pushView('builder', config);
  }, [pushView]);

  const finishInterview = useCallback((config: OpenClawConfigType) => {
    pushView('export', config);
  }, [pushView]);

  const finishBuilder = useCallback((config: OpenClawConfigType) => {
    pushView('export', config);
  }, [pushView]);

  // Import: reset history to landing → export so Back returns to Landing
  const importConfig = useCallback((config: OpenClawConfigType) => {
    setHistory([
      { view: 'landing', config: null },
      { view: 'export', config },
    ]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Check for hidden forge parameter in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('forge') === 'true') {
      setTimeout(() => {
        setSoulForgeData(null);
        pushView('soulforge-interview');
      }, 0);
      
      // Clean up URL without reload
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [pushView]);

  const renderView = () => {
    switch (currentEntry.view) {
      case 'landing':
        return (
          <LandingPage
            onSelectPreset={() => navigateTo('presets')}
            onStartInterview={startInterview}
            onOpenBuilder={() => startBuilder()}
            onLogoTap={handleLogoTap}
            onImportConfig={importConfig}
            onOpenBlog={() => pushView('blog')}
          />
        );

      case 'presets':
        return (
          <PresetsPage
            onSelectPreset={selectPreset}
            onCustomize={startBuilder}
            onBack={goBack}
          />
        );

      case 'interview':
        return (
          <InterviewPage
            initialConfig={currentEntry.config || createEmptyConfig()}
            onComplete={finishInterview}
            onBack={goBack}
          />
        );

      case 'soulforge-interview':
        return (
          <SoulForgeInterviewPage
            onComplete={(files, canon) => {
              setSoulForgeData({ files, canon });
              pushView('soulforge-export');
            }}
            onBack={goBack}
          />
        );

      case 'soulforge-export':
        return soulForgeData ? (
          <SoulForgeExportPage
            canon={soulForgeData.canon}
            onBack={goBack}
            onNewConfig={resetToLanding}
          />
        ) : null;

      case 'builder':
        return (
          <BuilderPage
            initialConfig={currentEntry.config || createEmptyConfig()}
            onComplete={finishBuilder}
            onBack={goBack}
          />
        );

      case 'export':
        return (
          <ExportPage
            config={currentEntry.config || createEmptyConfig()}
            onBack={goBack}
            onNewConfig={resetToLanding}
          />
        );

      case 'blog':
        return (
          <BlogPage
            onBack={goBack}
          />
        );

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

      {/* Breadcrumb – visible for all views beyond landing */}
      {history.length > 1 && (
        <div className="relative z-20 px-6 pt-3">
          <ClayFlowBreadcrumb history={history} onNavigate={goToHistoryIndex} />
        </div>
      )}

      {/* Main content – key triggers slide-up animation on every view change */}
      <main key={currentEntry.view} className="relative z-10 animate-slide-up will-change-transform">
        {renderView()}
      </main>

      <ConfigModeOverlay
        isOpen={configModeOpen}
        onClose={() => setConfigModeOpen(false)}
        onStartSoulForge={() => {
          setSoulForgeData(null);
          pushView('soulforge-interview');
        }}
      />

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#F5F0E8',
            border: '1px solid rgba(255,255,255,0.5)',
            boxShadow:
              '0 2px 4px rgba(61, 58, 54, 0.04), 0 4px 8px rgba(61, 58, 54, 0.03), 0 8px 16px rgba(61, 58, 54, 0.02), 0 1px 2px rgba(61, 58, 54, 0.08)',
            borderRadius: '1rem',
          },
        }}
      />
    </div>
  );
}

export default App;
