import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  ArrowLeft, Download, FileText, Sparkles, Copy, Check,
  Code, Eye, FileJson, Shield, Globe, Zap,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ClayButton, ClayCard, ClayTabs } from '@/components/clay';
import type { OpenClawConfigType } from '@/lib/openclaw/schema';
import type { OutputFileName } from '@/lib/openclaw/generator';
import { generateMarkdownFiles } from '@/lib/openclaw/generator';
import { getPresetById } from '@/lib/openclaw/presets';
import { toast } from 'sonner';

interface ExportPageProps {
  config: OpenClawConfigType;
  onBack: () => void;
  onNewConfig: () => void;
}

// Fix #6: preset-specific icons instead of always Sparkles
const PRESET_ICONS: Record<string, React.ReactNode> = {
  security: <Shield className="w-6 h-6" />,
  open: <Globe className="w-6 h-6" />,
  crazy: <Zap className="w-6 h-6" />,
  custom: <Sparkles className="w-6 h-6" />,
};

const fileIcons: Record<OutputFileName, React.ReactNode> = {
  'soul.md': <Sparkles className="w-4 h-4" />,
  'identity.md': <FileText className="w-4 h-4" />,
  'shield.md': <FileText className="w-4 h-4" />,
  'user.md': <FileText className="w-4 h-4" />,
  'heartbeat.md': <FileText className="w-4 h-4" />,
};

export const ExportPage: React.FC<ExportPageProps> = ({
  config,
  onBack,
  onNewConfig,
}) => {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [downloadedFiles, setDownloadedFiles] = useState<Set<string>>(new Set());
  // Fix #7: per-file view mode instead of shared state
  const [viewModes, setViewModes] = useState<Record<string, 'rendered' | 'raw'>>({});

  const files = useMemo(() => generateMarkdownFiles(config), [config]);
  const preset = useMemo(() => getPresetById(config.presetId), [config.presetId]);


  const getViewMode = (fileName: string): 'rendered' | 'raw' =>
    viewModes[fileName] ?? 'rendered';

  const setViewMode = (fileName: string, mode: 'rendered' | 'raw') => {
    setViewModes(prev => ({ ...prev, [fileName]: mode }));
  };

  // Fix #4: silent flag so downloadAll can suppress per-file toasts
  const downloadFile = useCallback((file: { name: string; content: string }, silent = false) => {
    const blob = new Blob([file.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setDownloadedFiles(prev => {
      const next = new Set(prev);
      next.add(file.name);
      return next;
    });

    if (!silent) toast.success(`Downloaded ${file.name}`);
  }, []);

  // Fix #4: single summary toast fires after the last download
  const downloadAll = useCallback(() => {
    files.forEach((file, index) => {
      setTimeout(() => {
        downloadFile(file, true);
        if (index === files.length - 1) {
          toast.success(`All ${files.length} files downloaded`);
        }
      }, index * 200);
    });
  }, [files, downloadFile]);

  // Auto-download all files on arrival to prevent data loss
  useEffect(() => {
    const timer = setTimeout(() => {
      downloadAll();
    }, 1000);
    return () => clearTimeout(timer);
  }, [downloadAll]);

  const exportConfigJson = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `openclaw-config-${config.presetId}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Config JSON exported');
  };

  const copyToClipboard = async (file: { name: string; content: string }) => {
    try {
      await navigator.clipboard.writeText(file.content);
      setCopiedFile(file.name);
      toast.success(`Copied ${file.name} to clipboard`);
      setTimeout(() => setCopiedFile(null), 2000);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  // Fix #7: each tab reads its own viewMode
  const tabs = files.map((file) => {
    const fileViewMode = getViewMode(file.name);
    return {
      id: file.name,
      label: file.name,
      icon: fileIcons[file.name as OutputFileName],
      content: (
        <div className="space-y-4">
          {/* File header + actions */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h3 className="text-lg font-semibold text-clay-charcoal">
              {file.name}
            </h3>
            <div className="flex gap-2 flex-wrap">
              {/* Per-file view mode toggle */}
              <div className="flex items-center bg-clay-sand rounded-full p-1 shadow-clay-inset">
                <button
                  onClick={() => setViewMode(file.name, 'rendered')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    fileViewMode === 'rendered'
                      ? 'bg-white shadow-clay text-clay-charcoal'
                      : 'text-clay-charcoal/50 hover:text-clay-charcoal'
                  }`}
                  title="Rendered preview"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Preview
                </button>
                <button
                  onClick={() => setViewMode(file.name, 'raw')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    fileViewMode === 'raw'
                      ? 'bg-white shadow-clay text-clay-charcoal'
                      : 'text-clay-charcoal/50 hover:text-clay-charcoal'
                  }`}
                  title="Raw Markdown"
                >
                  <Code className="w-3.5 h-3.5" />
                  Raw
                </button>
              </div>

              <ClayButton
                variant="pill"
                color="stone"
                size="sm"
                onClick={() => copyToClipboard(file)}
              >
                {copiedFile === file.name ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copiedFile === file.name ? 'Copied' : 'Copy'}
              </ClayButton>
              <ClayButton
                variant="pill"
                color="mint"
                size="sm"
                onClick={() => downloadFile(file)}
              >
                <Download className="w-4 h-4" />
                Download
              </ClayButton>
            </div>
          </div>

          {/* Content area */}
          {fileViewMode === 'rendered' ? (
            <div className="bg-white/60 rounded-xl p-6 border border-white/70 shadow-clay-inset min-h-48 max-h-[32rem] overflow-y-auto">
              {/* Fix #2: prose-clay uses the typography plugin theme we configured */}
              <div className="prose prose-sm prose-clay max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {file.content}
                </ReactMarkdown>
              </div>
            </div>
          ) : (
            <pre className="bg-clay-charcoal/5 rounded-xl p-4 overflow-x-auto text-sm font-mono text-clay-charcoal/80 max-h-[32rem] overflow-y-auto border border-clay-stone/20">
              {file.content}
            </pre>
          )}
        </div>
      ),
    };
  });

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 flex-wrap">
          <ClayButton
            variant="round"
            color="stone"
            size="sm"
            onClick={onBack}
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </ClayButton>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-clay-charcoal">
              Export Configuration
            </h1>
            <p className="text-sm text-clay-charcoal/60">
              Preview and download your configuration files
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <ClayButton
              variant="pill"
              color="sage"
              onClick={exportConfigJson}
            >
              <FileJson className="w-4 h-4" />
              Export JSON
            </ClayButton>
            <ClayButton
              variant="pill"
              color="coral"
              onClick={downloadAll}
            >
              <Download className="w-4 h-4" />
              Download All
            </ClayButton>
          </div>
        </div>

        {/* Config Summary */}
        <ClayCard padding="md" className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3">
              {/* Fix #6: use preset-specific icon */}
              <div className={`
                w-12 h-12 rounded-full shadow-clay flex items-center justify-center
                ${preset.color === 'peach' ? 'bg-clay-peach text-clay-charcoal' : ''}
                ${preset.color === 'mint' ? 'bg-clay-mint text-clay-charcoal' : ''}
                ${preset.color === 'coral' ? 'bg-clay-coral text-white' : ''}
                ${preset.color === 'sage' ? 'bg-clay-sage text-clay-charcoal' : ''}
              `}>
                {PRESET_ICONS[config.presetId] ?? <Sparkles className="w-6 h-6" />}
              </div>
              <div>
                <h2 className="font-semibold text-clay-charcoal">
                  {config.metadata.name}
                </h2>
                <p className="text-sm text-clay-charcoal/60">
                  {preset.tagline}
                </p>
              </div>
            </div>

            <div className="sm:ml-auto flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-clay-sand text-clay-charcoal">
                Risk: {preset.metadata.riskProfile}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-clay-mint text-clay-charcoal">
                Autonomy: {preset.metadata.autonomyLevel}
              </span>
            </div>
          </div>
        </ClayCard>

        {/* File Preview Tabs */}
        <ClayTabs tabs={tabs} defaultTab="soul.md" />

        {/* Quick Download Grid */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-clay-charcoal mb-4">
            Quick Download
          </h3>
          <div className="grid sm:grid-cols-5 gap-3">
            {files.map((file) => {
              const isDownloaded = downloadedFiles.has(file.name);
              return (
                <ClayCard
                  key={file.name}
                  isInteractive
                  onClick={() => downloadFile(file)}
                  padding="md"
                  className={`text-center transition-all duration-300 ${
                    isDownloaded 
                      ? 'bg-clay-mint/40 border-clay-mint shadow-clay-inset' 
                      : ''
                  }`}
                >
                  <div className={`
                    w-10 h-10 rounded-full shadow-clay flex items-center justify-center mx-auto mb-2 transition-colors
                    ${isDownloaded ? 'bg-white text-clay-sage' : 'bg-clay-mint text-clay-charcoal'}
                  `}>
                    {isDownloaded ? <Check className="w-5 h-5" /> : <Download className="w-5 h-5" />}
                  </div>
                  <code className={`text-xs font-mono transition-colors ${isDownloaded ? 'text-clay-charcoal font-bold' : 'text-clay-coral'}`}>
                    {file.name}
                  </code>
                </ClayCard>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center">
          <ClayButton
            variant="blob"
            color="sage"
            onClick={onNewConfig}
          >
            <Sparkles className="w-5 h-5" />
            Create New Configuration
          </ClayButton>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-clay-charcoal/50">
            All presets are legal-only. Higher autonomy increases responsibility.
          </p>
          <p className="text-xs text-clay-charcoal/40 mt-2">
            Generated on {new Date().toLocaleDateString()} • OpenCLAW Preset System v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
};
