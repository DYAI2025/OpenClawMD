import { Copy, Download, Check } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { FILE_SKELETONS } from '@/lib/soulforge/skeletons';

interface FilePreviewDialogProps {
  fileName: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FilePreviewDialog: React.FC<FilePreviewDialogProps> = ({
  fileName,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const skeleton = fileName ? FILE_SKELETONS[fileName] : null;

  if (!skeleton) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(skeleton.skeleton);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([skeleton.skeleton], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName!;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col bg-clay-base border-white/50 dark:border-white/[0.06] shadow-clay-lifted">
        <DialogHeader>
          <DialogTitle className="text-clay-charcoal font-mono">
            {skeleton.title}
          </DialogTitle>
          <DialogDescription className="text-clay-charcoal/60">
            {skeleton.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto rounded-xl bg-white/40 dark:bg-white/[0.03] border border-white/50 dark:border-white/[0.06] p-4">
          <pre className="text-sm text-clay-charcoal/80 whitespace-pre-wrap font-mono leading-relaxed">
            {skeleton.skeleton}
          </pre>
        </div>

        <DialogFooter className="flex-row gap-2 sm:gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 dark:bg-white/[0.06] border border-white dark:border-white/[0.08] shadow-clay hover:shadow-clay-lifted hover:-translate-y-0.5 transition-all text-sm font-semibold text-clay-charcoal"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-clay-coral text-white shadow-clay hover:shadow-clay-lifted hover:-translate-y-0.5 transition-all text-sm font-semibold"
          >
            <Download className="w-4 h-4" />
            Download .md
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
