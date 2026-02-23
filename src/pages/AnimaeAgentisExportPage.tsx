/**
 * Animae Agentis Export Page
 *
 * Preview and download generated Animae Agentis configuration files
 */

import { useState, useMemo, useCallback } from 'react';
import {
  ArrowLeft, Download, FileText, Sparkles, Copy, Check,
  Code, Eye, FileJson, Shield, Globe, Zap, Package, AlertTriangle, Sliders,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ClayButton, ClayCard, ClayTabs } from '@/components/clay';
import { DownloadConfirmation } from '@/components/safety/DownloadConfirmation';
import type { SpiritData, GeneratedFile } from '@/lib/animae-agentis/types';
import { generateAnimaeAgentisFiles } from '@/lib/animae-agentis/generator';
import { validateAnimaeAgentis } from '@/lib/animae-agentis/validation';
import { exportToJson } from '@/lib/animae-agentis/export/json';
import { toast } from 'sonner';

interface AnimaeAgentisExportPageProps {
  spirit: SpiritData;
  onBack: () => void;
  onNewConfig: () => void;
  onFineTune: () => void;
}

export function AnimaeAgentisExportPage({ spirit, onBack, onNewConfig, onFineTune }: AnimaeAgentisExportPageProps) {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [downloadedFiles, setDownloadedFiles] = useState<Set<string>>(new Set());
  const [viewModes, setViewModes] = useState<Record<string, 'rendered' | 'raw'>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  const options = useMemo(() => ({
    includeAdvancedPack: true,
    language: (spirit.addressing?.language as 'en' | 'de') || 'en',
  }), [spirit]);

  const output = useMemo(() =>
    generateAnimaeAgentisFiles(spirit, options),
    [spirit, options]
  );

  const files = output.files;

  // Validation
  const validation = useMemo(() =>
    validateAnimaeAgentis(files, spirit),
    [files, spirit]
  );

  // Risk assessment
  const isHighRisk =
    spirit.autonomy?.actionMode === 'autonomous_in_sandbox' ||
    spirit.surprise?.appetite === 'high';

  const getViewMode = (fileName: string): 'rendered' | 'raw' =>
    viewModes[fileName] ?? 'rendered';

  const setViewMode = (fileName: string, mode: 'rendered' | 'raw') => {
    setViewModes(prev => ({ ...prev, [fileName]: mode }));
  };

  const downloadFile = useCallback((file: GeneratedFile, silent = false) => {
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

  const executeDownloadAll = useCallback(() => {
    files.forEach((file, index) => {
      setTimeout(() => {
        downloadFile(file, true);
        if (index === files.length - 1) {
          toast.success(`All ${files.length} files downloaded`);
        }
      }, index * 200);
    });
  }, [files, downloadFile]);

  const downloadAll = useCallback(() => {
    if (isHighRisk) {
      setShowConfirmation(true);
      return;
    }
    executeDownloadAll();
  }, [isHighRisk, executeDownloadAll]);

  const exportConfigJson = () => {
    const json = exportToJson(output);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `animae-agentis-config-${spirit.agentMode}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Configuration JSON exported');
  };

  const copyToClipboard = async (file: GeneratedFile) => {
    try {
      await navigator.clipboard.writeText(file.content);
      setCopiedFile(file.name);
      toast.success(`Copied ${file.name} to clipboard`);
      setTimeout(() => setCopiedFile(null), 2000);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  const getFileIcon = (fileName: string) => {
    const icons: Record<string, React.ReactNode> = {
      'SOUL.md': <Sparkles className="w-4 h-4" />,
      'IDENTITY.md': <FileText className="w-4 h-4" />,
      'USER.md': <FileText className="w-4 h-4" />,
      'HEARTBEAT.md': <FileText className="w-4 h-4" />,
      'SHIELD.md': <Shield className="w-4 h-4" />,
      'SPIRIT.md': <Globe className="w-4 h-4" />,
      'CORTEX.md': <FileText className="w-4 h-4" />,
      'MEMORY.md': <FileText className="w-4 h-4" />,
      'VERSION.md': <FileText className="w-4 h-4" />,
      'OPS.md': <Zap className="w-4 h-4" />,
    };
    return icons[fileName] || <FileText className="w-4 h-4" />;
  };

  const tabs = files.map((file) => {
    const fileViewMode = getViewMode(file.name);
    return {
      id: file.name,
      label: file.name,
      icon: getFileIcon(file.name),
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h3 className="text-lg font-semibold text-clay-charcoal">
              {file.name}
            </h3>
            <div className="flex gap-2 flex-wrap">
              <div className="flex items-center bg-clay-sand rounded-full p-1 shadow-clay-inset">
                <button
                  onClick={() => setViewMode(file.name, 'rendered')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-[box-shadow,transform,color,background-color] ${
                    fileViewMode === 'rendered'
                      ? 'bg-white dark:bg-white/10 shadow-clay text-clay-charcoal'
                      : 'text-clay-charcoal/50 hover:text-clay-charcoal'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Preview
                </button>
                <button
                  onClick={() => setViewMode(file.name, 'raw')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-[box-shadow,transform,color,background-color] ${
                    fileViewMode === 'raw'
                      ? 'bg-white dark:bg-white/10 shadow-clay text-clay-charcoal'
                      : 'text-clay-charcoal/50 hover:text-clay-charcoal'
                  }`}
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

          {fileViewMode === 'rendered' ? (
            <div className="bg-white/60 dark:bg-white/[0.04] rounded-xl p-6 border border-white/70 dark:border-white/[0.06] shadow-clay-inset min-h-48 max-h-[32rem] overflow-y-auto">
              <div className="prose prose-sm prose-clay max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {file.content}
                </ReactMarkdown>
              </div>
            </div>
          ) : (
            <pre className="bg-clay-charcoal/5 dark:bg-white/5 rounded-xl p-4 overflow-x-auto text-sm font-mono text-clay-charcoal/80 max-h-[32rem] overflow-y-auto border border-clay-stone/20">
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
              Animae Agentis Export
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
              color={isHighRisk ? 'coral' : 'mint'}
              onClick={downloadAll}
            >
              <Package className="w-4 h-4" />
              Download All
            </ClayButton>
          </div>
        </div>

        {/* Validation Status */}
        {!validation.valid && (
          <div className="mb-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/30 rounded-xl p-4">
            <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Validation Issues Detected
            </h3>
            {validation.qualityGateIssues.length > 0 && (
              <div className="mb-3">
                <p className="text-sm font-medium text-red-700">Quality Gates:</p>
                <ul className="text-sm text-red-600 list-disc list-inside">
                  {validation.qualityGateIssues.slice(0, 3).map((issue, i) => (
                    <li key={i}>{issue.message}</li>
                  ))}
                </ul>
              </div>
            )}
            {validation.resonanceGateIssues.length > 0 && (
              <div>
                <p className="text-sm font-medium text-red-700">Resonance Gates:</p>
                <ul className="text-sm text-red-600 list-disc list-inside">
                  {validation.resonanceGateIssues.slice(0, 3).map((issue, i) => (
                    <li key={i}>{issue.message}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Config Summary */}
        <ClayCard padding="md" className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className={`
                w-12 h-12 rounded-full shadow-clay flex items-center justify-center
                ${spirit.agentMode === 'sidekick' ? 'bg-clay-peach' : ''}
                ${spirit.agentMode === 'chief-of-staff' ? 'bg-clay-mint' : ''}
                ${spirit.agentMode === 'coach' ? 'bg-clay-sage' : ''}
              `}>
                {spirit.agentMode === 'sidekick' && <Sparkles className="w-6 h-6" />}
                {spirit.agentMode === 'chief-of-staff' && <Zap className="w-6 h-6" />}
                {spirit.agentMode === 'coach' && <Shield className="w-6 h-6" />}
              </div>
              <div>
                <h2 className="font-semibold text-clay-charcoal">
                  {spirit.agentName}
                </h2>
                <p className="text-sm text-clay-charcoal/60">
                  {spirit.agentTitle}
                </p>
              </div>
            </div>

            <div className="sm:ml-auto flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-clay-sand text-clay-charcoal capitalize">
                {spirit.agentMode}
              </span>
              <span className={`
                px-3 py-1 rounded-full text-xs font-medium capitalize
                ${isHighRisk ? 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400' : 'bg-clay-mint text-clay-charcoal'}
              `}>
                {spirit.autonomy?.actionMode?.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </ClayCard>

        {/* Download Confirmation for High Risk */}
        {showConfirmation && (
          <div className="mb-6">
            <DownloadConfirmation
              onConfirm={() => {
                setShowConfirmation(false);
                executeDownloadAll();
              }}
              onCancel={() => setShowConfirmation(false)}
              fileCount={files.length}
              isHighRisk={isHighRisk}
            />
          </div>
        )}

        {/* File Preview Tabs */}
        <ClayTabs tabs={tabs} defaultTab="SOUL.md" />

        {/* Quick Download Grid */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-clay-charcoal mb-4">
            Quick Download
          </h3>
          <div className="grid sm:grid-cols-3 md:grid-cols-5 gap-3">
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
                    ${isDownloaded ? 'bg-white dark:bg-white/10 text-clay-sage' : 'bg-clay-mint text-clay-charcoal'}
                  `}>
                    {isDownloaded ? <Check className="w-5 h-5" /> : getFileIcon(file.name)}
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
        <div className="mt-8 flex justify-center gap-4">
          <ClayButton variant="pill" color="sage" onClick={onFineTune}>
            <Sliders className="w-5 h-5" />
            Fine-Tune
          </ClayButton>
          <ClayButton variant="blob" color="sage" onClick={onNewConfig}>
            <Sparkles className="w-5 h-5" />
            Create New Configuration
          </ClayButton>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-clay-charcoal/50">
            Generated with OpenClaw Animae Agentis {output.options.includeAdvancedPack ? '(Advanced Pack)' : '(Base Pack)'}
          </p>
          <p className="text-xs text-clay-charcoal/40 mt-2">
            {new Date(output.generatedAt).toLocaleDateString()} • {files.length} files • Resonance Layer R1
          </p>
        </div>
      </div>
    </div>
  );
}
