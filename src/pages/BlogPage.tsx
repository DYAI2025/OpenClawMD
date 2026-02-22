import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BLOG_POSTS, type BlogPost } from '../lib/blogData';
import { ClayCard, ClayButton } from '../components/clay';
import { ArrowLeft, Calendar, Clock, Tag, ChevronRight } from 'lucide-react';

interface BlogPageProps {
  onBack: () => void;
}

export function BlogPage({ onBack }: BlogPageProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  if (selectedPost) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <button
          onClick={() => setSelectedPost(null)}
          className="flex items-center gap-2 text-clay-charcoal/60 hover:text-clay-coral mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </button>

        <article className="animate-slide-up">
          <div className="flex flex-wrap gap-4 mb-6">
            <span className="px-3 py-1 bg-clay-peach/20 text-clay-coral text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {selectedPost.category}
            </span>
            <span className="text-clay-charcoal/40 text-sm flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {selectedPost.date}
            </span>
            <span className="text-clay-charcoal/40 text-sm flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {selectedPost.readTime}
            </span>
          </div>

          <ClayCard className="p-8 md:p-12 overflow-hidden shadow-clay-lifted border-white/40 dark:border-white/[0.06]">
            <div className="prose-clay max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {selectedPost.content}
              </ReactMarkdown>
            </div>
          </ClayCard>
        </article>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-clay-charcoal tracking-tight mb-4">
            Animae Agentis <span className="text-clay-coral">Intelligence</span> Lab
          </h1>
          <p className="text-lg text-clay-charcoal/60 max-w-2xl">
            Deep dives into autonomous systems, agency boundaries, and the technical core of the Animae Agentis standard.
          </p>
        </div>
        <ClayButton color="sand" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
          Back Home
        </ClayButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {BLOG_POSTS.map((post) => (
          <button
            key={post.slug}
            onClick={() => setSelectedPost(post)}
            className="text-left group outline-none focus-visible:ring-2 focus-visible:ring-clay-coral rounded-3xl"
          >
            <ClayCard className="p-8 h-full flex flex-col transition-all group-hover:shadow-clay-lifted group-hover:-translate-y-1 border-white/20 dark:border-white/[0.06]">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-clay-peach/20 text-clay-coral text-[10px] font-bold rounded-full uppercase tracking-wider">
                  {post.category}
                </span>
                <span className="text-clay-charcoal/30 text-xs font-medium">
                  {post.date}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-clay-charcoal mb-4 group-hover:text-clay-coral transition-colors">
                {post.title}
              </h3>
              
              <p className="text-clay-charcoal/60 mb-8 line-clamp-3">
                {post.excerpt}
              </p>
              
              <div className="mt-auto flex items-center justify-between">
                <span className="text-clay-charcoal/40 text-sm flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
                <span className="text-clay-coral font-bold flex items-center gap-1 text-sm group-hover:gap-2 transition-all">
                  Read Article <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </ClayCard>
          </button>
        ))}
      </div>
    </div>
  );
}
