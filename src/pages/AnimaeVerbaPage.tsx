import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getWeeklyPosts, getLatestWeeklyPost, type BlogPost } from '../lib/blogData';
import { ClayCard } from '../components/clay';
import { ArrowLeft, Calendar, Clock, Tag, ChevronRight, BookOpen } from 'lucide-react';

interface AnimaeVerbaPageProps {
  onBack?: () => void;
}

export function AnimaeVerbaPage({ onBack }: AnimaeVerbaPageProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const weeklyPosts = getWeeklyPosts();
  const latestPost = getLatestWeeklyPost();

  if (selectedPost) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <button
          onClick={() => setSelectedPost(null)}
          className="flex items-center gap-2 text-clay-charcoal/60 hover:text-clay-coral mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Animae Verba
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

  if (weeklyPosts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <BookOpen className="w-12 h-12 text-clay-charcoal/20 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-clay-charcoal mb-4">Animae Verba</h1>
        <p className="text-lg text-clay-charcoal/60 mb-2">Weekly reflections on autonomous agency</p>
        <p className="text-clay-charcoal/40">Coming soon. Check back next week for our first article.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-clay-charcoal/60 hover:text-clay-coral mb-6 transition-colors group text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
        )}
        <h1 className="text-4xl md:text-5xl font-black text-clay-charcoal tracking-tight mb-4">
          Animae <span className="text-clay-coral">Verba</span>
        </h1>
        <p className="text-lg text-clay-charcoal/60 max-w-2xl">
          Weekly reflections on autonomous agency, agent configuration, and the evolving relationship between humans and AI systems.
        </p>
      </div>

      {/* Featured: Article of the Week */}
      {latestPost && (
        <section className="mb-16">
          <h2 className="text-xs font-black uppercase tracking-widest text-clay-charcoal/30 mb-6">
            Article of the Week
          </h2>
          <button
            onClick={() => setSelectedPost(latestPost)}
            className="w-full text-left group outline-none focus-visible:ring-2 focus-visible:ring-clay-coral rounded-3xl"
          >
            <ClayCard className="p-8 md:p-12 transition-all group-hover:shadow-clay-lifted group-hover:-translate-y-1 border-white/20 dark:border-white/[0.06]">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-clay-coral/10 text-clay-coral text-[10px] font-bold rounded-full uppercase tracking-wider">
                  {latestPost.category}
                </span>
                <span className="text-clay-charcoal/30 text-xs">{latestPost.date}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-clay-charcoal mb-4 group-hover:text-clay-coral transition-colors">
                {latestPost.title}
              </h3>
              <p className="text-clay-charcoal/60 text-lg mb-6 line-clamp-3">
                {latestPost.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-clay-charcoal/40 text-sm flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {latestPost.readTime}
                </span>
                <span className="text-clay-coral font-bold flex items-center gap-1 text-sm group-hover:gap-2 transition-all">
                  Read Article <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </ClayCard>
          </button>
        </section>
      )}

      {/* Archive */}
      {weeklyPosts.length > 1 && (
        <section>
          <h2 className="text-xs font-black uppercase tracking-widest text-clay-charcoal/30 mb-6">
            Archive
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {weeklyPosts.slice(1).map((post) => (
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
                    <span className="text-clay-charcoal/30 text-xs">{post.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-clay-charcoal mb-3 group-hover:text-clay-coral transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-clay-charcoal/60 mb-6 line-clamp-3">{post.excerpt}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-clay-charcoal/40 text-sm flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </span>
                    <span className="text-clay-coral font-bold flex items-center gap-1 text-sm group-hover:gap-2 transition-all">
                      Read <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </ClayCard>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
