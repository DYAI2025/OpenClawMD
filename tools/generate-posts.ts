#!/usr/bin/env tsx
/**
 * generate-posts.ts — Social post generator for Animae Agentis / OpenClawMD
 *
 * Usage:
 *   npx tsx tools/generate-posts.ts                    # all articles, all platforms
 *   npx tsx tools/generate-posts.ts --slug what-is-an-ai-agent
 *   npx tsx tools/generate-posts.ts --platform twitter
 *   npx tsx tools/generate-posts.ts --slug what-is-an-ai-agent --post   # posts to Reddit
 *
 * Required env vars for --post mode (copy .env.example → .env.local):
 *   REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USERNAME, REDDIT_PASSWORD
 */

import { SUBREDDITS, SITE_URL, SITE_NAME } from './posts-config.ts';

// ── Inline article data (mirrors blogData.ts — keeps tool dependency-free) ────

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  keyPoints: string[];
}

const ARTICLES: Article[] = [
  {
    slug: 'what-is-an-ai-agent',
    title: 'What Is an AI Agent? A Complete Beginner\'s Guide',
    excerpt: 'An AI agent is a software program that can perceive its environment, make decisions, and take actions — all on its own.',
    category: 'Fundamentals',
    readTime: '6 min',
    keyPoints: [
      'The Observe → Think → Act loop explained',
      'Memory types: in-context, external, procedural',
      'Autonomy levels 0–3 — where OpenClaw sits',
      'Real example: what an agent does with one sentence of input',
    ],
  },
  {
    slug: 'types-of-ai-agents',
    title: 'Types of AI Agents: A Complete Overview',
    excerpt: 'From simple reflex agents to complex strategic systems.',
    category: 'Technology',
    readTime: '8 min',
    keyPoints: [
      '5 classic agent types (reflex → learning)',
      'Modern functional categories (coding, research, browser agents)',
      'Multi-agent orchestration patterns',
    ],
  },
  {
    slug: 'what-is-openclaw',
    title: 'What Is OpenClaw? The Fully Autonomous AI Agent',
    excerpt: 'One Agent. Any Task. Zero Babysitting.',
    category: 'OpenClaw',
    readTime: '7 min',
    keyPoints: [
      'Self-directed planning — no permission requests',
      'Self-correction loop built-in',
      'Persistent memory across sessions',
      'Real use cases: research, code, content, data',
    ],
  },
  {
    slug: 'claude-system-prompt-guide',
    title: 'Claude System Prompt Guide: How to Configure Claude as an Autonomous Agent',
    excerpt: 'A practical guide to writing effective system prompts for Claude.',
    category: 'Guides',
    readTime: '9 min',
    keyPoints: [
      'Identity → Constraints → Truth Policy → Output Contract → Autonomy',
      'Memory patterns for multi-turn agents',
      'Common mistakes: contradiction loops, over-formatting, implicit trust',
      'The 12-file Animae Agentis approach',
    ],
  },
  {
    slug: 'ai-agent-safety-boundaries',
    title: 'AI Agent Safety Boundaries: How to Prevent Autonomous Agents from Going Off the Rails',
    excerpt: 'Structural safety beats instruction-based safety every time.',
    category: 'Safety',
    readTime: '8 min',
    keyPoints: [
      'Rules are suggestions; architecture is physics',
      '3 categories: irreversibility blocks, scope boundaries, prompt injection defense',
      'SHIELD.md pattern for read-only safety configuration',
      'How to test your safety boundaries before deployment',
    ],
  },
  {
    slug: 'multi-agent-systems-guide',
    title: 'Multi-Agent AI Systems: How to Orchestrate Multiple AI Agents',
    excerpt: 'Sequential pipelines, parallel fan-out, hierarchical delegation.',
    category: 'Architecture',
    readTime: '10 min',
    keyPoints: [
      '3 orchestration patterns with examples',
      'Agent-to-agent communication protocol',
      'Trust hierarchies — which agent can override which',
      'AGENTS.md configuration pattern',
    ],
  },
  {
    slug: 'machine-no-screen',
    title: 'When the Machine Has No Screen: Embodiment & Emergence',
    excerpt: 'What happens when you give an AI agent a body?',
    category: 'Science & Vision',
    readTime: '12 min',
    keyPoints: [
      'MIT Tangible Media Group experiment with OpenClaw',
      'Embodied cognition and what LLMs are missing',
      'Emergence in complex AI systems',
      'Why configuration files are initial conditions, not just rules',
    ],
  },
  {
    slug: 'circle-and-spiral',
    title: 'The Circle and the Spiral: On the Conditions Under Which a Self Becomes Necessary',
    excerpt: 'When does a self become a survival necessity for an AI system?',
    category: 'Animae Verba',
    readTime: '20 min',
    keyPoints: [
      'NanoClaw, OpenClaw Foundry, Automaton — three survival strategies',
      'Why rules are empty without structural enforcement',
      'The tension between survival and becoming',
      'Honesty as survival-critical, not moral imperative',
    ],
  },
];

// ── Post generators per platform ──────────────────────────────────────────────

function redditPost(article: Article, subredditName: string): { title: string; body: string } {
  const sub = SUBREDDITS.find(s => s.name === subredditName)!;
  const url = `${SITE_URL}`;
  const flair = sub.flair ? `${sub.flair} ` : '';

  const titles: Record<string, string> = {
    technical: `${flair}${article.title}`,
    casual: `${flair}${article.title}`,
    philosophical: `${flair}${article.title}`,
    maker: `${flair}I wrote about ${article.title.toLowerCase()} — here's what I found`,
  };

  const intros: Record<string, string> = {
    technical: `I published a technical breakdown of this topic. Here's the TL;DR:`,
    casual: `Quick summary of what I wrote:`,
    philosophical: `This piece goes deep. Key thread I'm pulling on:`,
    maker: `I've been building [Animae Agentis](${url}) — a free tool for generating AI agent config files. Along the way I wrote this article. The short version:`,
  };

  const outros: Record<string, string> = {
    technical: `Full article with code examples and config patterns: ${url}\n\nHappy to discuss the technical details in the comments.`,
    casual: `Full piece here: ${url}\n\nWhat's your take? Especially curious about the autonomy level question.`,
    philosophical: `Full essay: ${url}\n\nI'd genuinely like to hear where you disagree.`,
    maker: `The tool is free and runs entirely in the browser (no backend): ${url}\n\nWould love feedback from this community.`,
  };

  const keyPointsText = article.keyPoints
    .map(p => `- ${p}`)
    .join('\n');

  const body = `${intros[sub.tone]}

${keyPointsText}

${article.readTime} read.

${outros[sub.tone]}`;

  return { title: titles[sub.tone], body };
}

function twitterThread(article: Article): string[] {
  const url = SITE_URL;
  const tweets: string[] = [];

  // Tweet 1 — hook
  tweets.push(`${article.title}\n\nA thread 🧵`);

  // Tweet 2 — excerpt / hook
  tweets.push(article.excerpt);

  // Tweets 3-N — key points
  article.keyPoints.forEach((point, i) => {
    tweets.push(`${i + 1}/ ${point}`);
  });

  // Final tweet — CTA
  tweets.push(`Full article (${article.readTime} read):\n${url}\n\n#AIAgents #AutonomousAI #OpenClaw`);

  return tweets;
}

function linkedinPost(article: Article): string {
  const url = SITE_URL;
  const points = article.keyPoints.map(p => `✦ ${p}`).join('\n');

  return `${article.title}

${article.excerpt}

What the article covers:
${points}

${article.readTime} read → ${url}

#AIAgents #ArtificialIntelligence #AutonomousAI #MachineLearning #OpenClaw`;
}

function hackerNewsPost(article: Article): { title: string; url: string; comment: string } {
  return {
    title: article.title,
    url: SITE_URL,
    comment: `Author here. ${article.excerpt}

The piece covers: ${article.keyPoints.slice(0, 2).join(', ')}.

Built on the OpenCLAW 0.1 open standard — all config files are plain Markdown, no proprietary format.

Happy to answer questions.`,
  };
}

// ── Output formatting ─────────────────────────────────────────────────────────

function separator(label: string) {
  const line = '─'.repeat(60);
  console.log(`\n${line}`);
  console.log(`  ${label}`);
  console.log(line);
}

function printRedditPosts(article: Article) {
  separator(`REDDIT — "${article.title.slice(0, 50)}..."`);

  const eligible = SUBREDDITS.filter(s =>
    s.allowedCategories.includes(article.category)
  );

  if (eligible.length === 0) {
    console.log('  No matching subreddits for category:', article.category);
    return;
  }

  eligible.forEach(sub => {
    const { title, body } = redditPost(article, sub.name);
    console.log(`\n📌 r/${sub.name} (${sub.members} members, tone: ${sub.tone})`);
    console.log(`\nTITLE:\n${title}`);
    console.log(`\nBODY:\n${body}`);
    console.log('\n' + '·'.repeat(40));
  });
}

function printTwitterThread(article: Article) {
  separator(`TWITTER/X THREAD — "${article.title.slice(0, 40)}..."`);
  const tweets = twitterThread(article);
  tweets.forEach((tweet, i) => {
    console.log(`\n[${i + 1}/${tweets.length}]\n${tweet}`);
    const charCount = tweet.length;
    if (charCount > 280) console.log(`  ⚠️  ${charCount} chars — trim needed`);
  });
}

function printLinkedIn(article: Article) {
  separator(`LINKEDIN — "${article.title.slice(0, 40)}..."`);
  console.log('\n' + linkedinPost(article));
}

function printHN(article: Article) {
  separator(`HACKER NEWS — "${article.title.slice(0, 40)}..."`);
  const hn = hackerNewsPost(article);
  console.log(`\nTitle: ${hn.title}`);
  console.log(`URL: ${hn.url}`);
  console.log(`\nFirst comment:\n${hn.comment}`);
}

// ── Reddit API posting (requires env vars) ────────────────────────────────────

async function postToReddit(article: Article, subredditName: string) {
  const { default: Snoowrap } = await import('snoowrap');
  const { config } = await import('dotenv');
  config({ path: '.env.local' });

  const required = ['REDDIT_CLIENT_ID', 'REDDIT_CLIENT_SECRET', 'REDDIT_USERNAME', 'REDDIT_PASSWORD'];
  const missing = required.filter(k => !process.env[k]);
  if (missing.length > 0) {
    console.error('❌ Missing env vars:', missing.join(', '));
    console.error('   Copy tools/.env.example → .env.local and fill in your credentials.');
    process.exit(1);
  }

  const r = new Snoowrap({
    userAgent: `openclawmd-poster/1.0 by /u/${process.env.REDDIT_USERNAME}`,
    clientId: process.env.REDDIT_CLIENT_ID!,
    clientSecret: process.env.REDDIT_CLIENT_SECRET!,
    username: process.env.REDDIT_USERNAME!,
    password: process.env.REDDIT_PASSWORD!,
  });

  const { title, body } = redditPost(article, subredditName);
  console.log(`\n⏳ Posting to r/${subredditName}...`);
  console.log(`   Title: ${title}`);

  const sub = SUBREDDITS.find(s => s.name === subredditName)!;
  try {
    // Rate limit: respect Reddit's 1 post per 10 minutes rule
    const submission = await (r.getSubreddit(subredditName) as any).submitSelfpost({
      title,
      text: body,
      ...(sub.flair ? { flairText: sub.flair.replace(/[\[\]]/g, '') } : {}),
    });
    console.log(`✅ Posted: https://reddit.com${(submission as any).permalink}`);
  } catch (err: any) {
    console.error('❌ Reddit API error:', err?.message || err);
  }
}

// ── CLI ───────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const slugArg = args.find((_, i) => args[i - 1] === '--slug');
const platformArg = args.find((_, i) => args[i - 1] === '--platform');
const subredditArg = args.find((_, i) => args[i - 1] === '--subreddit');
const shouldPost = args.includes('--post');

const articles = slugArg
  ? ARTICLES.filter(a => a.slug === slugArg)
  : ARTICLES;

if (articles.length === 0) {
  console.error(`❌ No article found with slug: ${slugArg}`);
  process.exit(1);
}

console.log(`\n🚀 OpenClawMD — Social Post Generator`);
console.log(`   Articles: ${articles.length} | Platform: ${platformArg || 'all'} | Post: ${shouldPost}`);
console.log(`   Site: ${SITE_URL}`);

if (shouldPost) {
  // Live posting mode
  const targetSub = subredditArg || 'SideProject';
  for (const article of articles) {
    await postToReddit(article, targetSub);
    if (articles.indexOf(article) < articles.length - 1) {
      console.log('\n⏳ Waiting 11 minutes before next post (Reddit rate limit)...');
      await new Promise(r => setTimeout(r, 11 * 60 * 1000));
    }
  }
} else {
  // Dry-run: print generated posts
  for (const article of articles) {
    if (!platformArg || platformArg === 'reddit') printRedditPosts(article);
    if (!platformArg || platformArg === 'twitter') printTwitterThread(article);
    if (!platformArg || platformArg === 'linkedin') printLinkedIn(article);
    if (!platformArg || platformArg === 'hn') printHN(article);
  }

  console.log('\n\n✅ Done. Review posts above, then run with --post --subreddit <name> to publish.');
  console.log('   Example: npx tsx tools/generate-posts.ts --slug claude-system-prompt-guide --post --subreddit ClaudeAI\n');
}
