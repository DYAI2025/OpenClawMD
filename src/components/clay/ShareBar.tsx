import React, { useCallback } from 'react';
import { Mail, Link } from 'lucide-react';
import { ClayButton } from './ClayButton';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ShareBarProps {
  title?: string;
  url?: string;
  description?: string;
  className?: string;
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function RedditIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-6.627-5.373-12-12-12zm6.066 13.98c.04.207.06.42.06.634 0 3.256-3.788 5.9-8.46 5.9-4.673 0-8.461-2.644-8.461-5.9 0-.214.02-.427.06-.634a1.748 1.748 0 0 1-.98-1.57c0-.966.784-1.75 1.75-1.75.455 0 .87.174 1.18.459 1.163-.812 2.768-1.337 4.546-1.396l.854-4.02.015-.06a.348.348 0 0 1 .412-.256l2.834.6a1.246 1.246 0 0 1 2.377.476c0 .688-.558 1.246-1.246 1.246a1.248 1.248 0 0 1-1.232-1.063l-2.525-.535-.762 3.584c1.747.072 3.318.598 4.462 1.4a1.744 1.744 0 0 1 1.18-.46c.967 0 1.75.785 1.75 1.75 0 .647-.35 1.21-.872 1.515zM9.5 13.75c0 .69.56 1.25 1.25 1.25s1.25-.56 1.25-1.25-.56-1.25-1.25-1.25-1.25.56-1.25 1.25zm5.5 1.25c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25-1.25.56-1.25 1.25.56 1.25 1.25 1.25zm-1.414 2.658c-.842.842-2.33.91-2.586.91-.256 0-1.744-.068-2.586-.91a.354.354 0 1 1 .5-.5c.53.53 1.666.718 2.086.718.42 0 1.556-.188 2.086-.718a.354.354 0 0 1 .5.5z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export const ShareBar = React.forwardRef<HTMLDivElement, ShareBarProps>(
  ({
    title = 'OpenClawMD — AI Agent Config Generator',
    url = 'https://openclawmd.com',
    description = 'OpenClawMD generates and validates 13 Markdown config files for AI agents. No backend, runs in your browser.',
    className,
  }, ref) => {
    const shareWindow = useCallback((shareUrl: string) => {
      window.open(shareUrl, '_blank', 'width=600,height=400,noopener,noreferrer');
    }, []);

    const shareX = () => {
      const params = new URLSearchParams({ text: title, url });
      shareWindow(`https://x.com/intent/tweet?${params}`);
    };

    const shareReddit = () => {
      const params = new URLSearchParams({ url, title });
      shareWindow(`https://www.reddit.com/submit?${params}`);
    };

    const shareLinkedIn = () => {
      const params = new URLSearchParams({ url });
      shareWindow(`https://www.linkedin.com/sharing/share-offsite/?${params}`);
    };

    const shareEmail = () => {
      const subject = encodeURIComponent(title);
      const body = encodeURIComponent(`${description}\n\n${url}`);
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    };

    const copyLink = async () => {
      try {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard');
      } catch {
        toast.error('Failed to copy link');
      }
    };

    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-center gap-3 flex-wrap', className)}
      >
        <ClayButton variant="round" color="stone" size="sm" onClick={shareX} aria-label="Share on X">
          <XIcon className="w-4 h-4" />
        </ClayButton>
        <ClayButton variant="round" color="stone" size="sm" onClick={shareReddit} aria-label="Share on Reddit">
          <RedditIcon className="w-4 h-4" />
        </ClayButton>
        <ClayButton variant="round" color="stone" size="sm" onClick={shareLinkedIn} aria-label="Share on LinkedIn">
          <LinkedInIcon className="w-4 h-4" />
        </ClayButton>
        <ClayButton variant="round" color="stone" size="sm" onClick={shareEmail} aria-label="Share via Email">
          <Mail className="w-4 h-4" />
        </ClayButton>
        <ClayButton variant="round" color="stone" size="sm" onClick={copyLink} aria-label="Copy link">
          <Link className="w-4 h-4" />
        </ClayButton>
      </div>
    );
  }
);

ShareBar.displayName = 'ShareBar';
