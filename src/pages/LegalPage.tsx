import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ClayCard, ClayButton } from '../components/clay';
import { ArrowLeft } from 'lucide-react';

interface LegalPageProps {
  content: string;
  title: string;
  onBack: () => void;
}

export function LegalPage({ content, title, onBack }: LegalPageProps) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-clay-charcoal/60 hover:text-clay-coral transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>
        <h1 className="text-2xl font-black text-clay-charcoal tracking-tight">
          {title}
        </h1>
      </div>

      <article className="animate-slide-up">
        <ClayCard className="p-8 md:p-12 overflow-hidden shadow-clay-lifted border-white/40">
          <div className="prose-clay prose-sm md:prose-base max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        </ClayCard>
      </article>

      <div className="mt-12 text-center">
        <ClayButton color="sand" onClick={onBack}>
          Return to Home
        </ClayButton>
      </div>
    </div>
  );
}
