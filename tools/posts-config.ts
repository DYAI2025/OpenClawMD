/**
 * Subreddit configuration — tone, rules, and post style per community.
 * Each subreddit has a different culture; posts must feel native to pass mods.
 */

export interface SubredditConfig {
  name: string;
  flair?: string;
  tone: 'technical' | 'casual' | 'philosophical' | 'maker';
  maxTitleLen: number;
  /** Which article categories are appropriate here */
  allowedCategories: string[];
  /** Subreddit-specific rules to respect in generated posts */
  rules: string[];
  /** Approximate member count for context */
  members: string;
}

export const SUBREDDITS: SubredditConfig[] = [
  {
    name: 'LocalLLaMA',
    tone: 'technical',
    maxTitleLen: 200,
    allowedCategories: ['Guides', 'Technology', 'Architecture', 'Safety', 'OpenClaw'],
    members: '600K',
    rules: [
      'No pure self-promotion — must add value to the community',
      'Prefer technical depth over marketing language',
      'Link is acceptable if post body explains the tool',
    ],
  },
  {
    name: 'artificial',
    tone: 'casual',
    maxTitleLen: 200,
    allowedCategories: ['Fundamentals', 'Technology', 'Future', 'Science & Vision', 'OpenClaw'],
    members: '1M',
    rules: [
      'Broad AI audience — accessible writing preferred',
      'Discussion-oriented posts perform better than link posts',
    ],
  },
  {
    name: 'MachineLearning',
    tone: 'technical',
    maxTitleLen: 200,
    allowedCategories: ['Architecture', 'Technology', 'Science & Vision'],
    members: '3.5M',
    rules: [
      'High bar — must have technical substance',
      'No marketing. Frame as research/tool discussion.',
      'Use [D] (Discussion) or [P] (Project) flairs',
    ],
    flair: '[P]',
  },
  {
    name: 'ClaudeAI',
    tone: 'casual',
    maxTitleLen: 200,
    allowedCategories: ['Guides', 'Safety', 'Architecture'],
    members: '200K',
    rules: [
      'Claude-specific content — always tie back to Claude',
      'Practical tips perform well',
    ],
  },
  {
    name: 'SideProject',
    tone: 'maker',
    maxTitleLen: 200,
    allowedCategories: ['Guides', 'OpenClaw', 'Technology'],
    members: '400K',
    rules: [
      'Show your project — be personal and authentic',
      'Share journey, not just the product',
      'Engagement questions at the end work well',
    ],
  },
  {
    name: 'singularity',
    tone: 'philosophical',
    maxTitleLen: 200,
    allowedCategories: ['Science & Vision', 'Future', 'Animae Verba'],
    members: '500K',
    rules: [
      'Big-picture thinking appreciated',
      'Philosophical angle works well here',
    ],
  },
];

export const SITE_URL = 'https://openclawmd.com';
export const SITE_NAME = 'Animae Agentis (openclawmd.com)';
