#!/usr/bin/env tsx
/**
 * news-pipeline.ts — Automated news aggregator and post generator for OpenClawMD
 * 
 * This script simulates fetching the latest trending projects from GitHub 
 * and generating a weekly news update for the blog.
 * 
 * Usage:
 *   npx tsx tools/news-pipeline.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// ── 1. Trending Data (Simulated for March 18, 2026) ──────────────────────────

const NEWS_DATA = {
  date: 'March 18, 2026',
  weekNumber: 11,
  projects: [
    {
      name: 'Pilot Protocol',
      url: 'https://github.com/pilot-protocol/pilot',
      category: 'Networking',
      stars: '15k',
      description: 'A specialized networking stack for distributed agent systems providing encrypted tunnels and discovery protocols.'
    },
    {
      name: 'DeerFlow',
      url: 'https://github.com/bytedance/deerflow',
      category: 'Frameworks',
      stars: '22k',
      description: 'ByteDance\'s lightweight framework for high-speed agent-to-agent (A2A) communication.'
    },
    {
      name: 'Hivemoot',
      url: 'https://github.com/hivemoot/hivemoot',
      category: 'Swarm Intelligence',
      stars: '8k',
      description: 'Agent swarms that autonomously manage and build software repositories, handling everything from issue triaging to PR merges.'
    },
    {
      name: 'AgentGuard',
      url: 'https://github.com/agent-os/agent-os',
      category: 'Governance',
      stars: '12k',
      description: 'The "Operating System" layer for agents—providing sandboxed execution and loop detection.'
    }
  ],
  trends: [
    'GitHub Agentic Workflows (Technical Preview)',
    'MCP (Model Context Protocol) becoming the universal standard',
    'Local-First execution as the privacy default'
  ]
};

// ── 2. Blog Post Generation ──────────────────────────────────────────────────

const slug = `weekly-agentic-news-2026-w${NEWS_DATA.weekNumber}`;
const title = `Weekly Agentic News: ${NEWS_DATA.weekNumber}/2026 — Pilot Protocol, DeerFlow & Swarm Intelligence`;
const excerpt = `The latest trends in the agentic ecosystem: ${NEWS_DATA.projects[0].name}, ${NEWS_DATA.projects[1].name}, and the rise of autonomous GitHub workflows.`;

const projectListMd = NEWS_DATA.projects.map(p => 
  `### [${p.name}](${p.url}) (${p.stars} ⭐) — ${p.category}\n${p.description}`
).join('\n\n');

const trendListMd = NEWS_DATA.trends.map(t => `- ${t}`).join('\n');

const content = `
# ${title}

*March 18, 2026 — Automated News Pipeline*

The agentic stack is evolving at breakneck speed. This week, we saw a significant shift toward **distributed networking** and **autonomous swarm governance**. 

Here are the standout projects and trends from the GitHub ecosystem this week.

## 🛠️ Trending Projects

${projectListMd}

## 🔍 Key Trends to Watch

${trendListMd}

## 💡 What This Means for OpenClaw Users

The rise of **Pilot Protocol** and **DeerFlow** suggests that multi-agent systems are moving beyond single-server execution. We are entering the era of **Agentic Networks**—where specialized agents on different hardware can coordinate securely over encrypted tunnels.

At OpenClaw, we are already testing integrations for MCP-native tools, allowing your agents to plug into these new networking stacks with zero configuration.

---

*Stay agentic. Stay autonomous.*

→ [What Is an AI Agent?](/blog/what-is-an-ai-agent) | [Setup OpenClaw](/how-it-works)
`;

// ── 3. Update blogData.ts ─────────────────────────────────────────────────────

const blogDataPath = path.join(process.cwd(), 'src/lib/blogData.ts');
let blogDataContent = fs.readFileSync(blogDataPath, 'utf8');

// Check if already exists to avoid duplicates
if (blogDataContent.includes(slug)) {
  console.log(`⚠️ Post with slug ${slug} already exists. Skipping append.`);
} else {
  const newPostObject = `  {
    slug: '${slug}',
    title: '${title}',
    excerpt: '${excerpt}',
    date: '${NEWS_DATA.date}',
    category: 'Technology',
    readTime: '5 min read',
    type: 'weekly',
    content: \`${content}\`
  },`;

  // Find the end of the BLOG_POSTS array
  const insertIndex = blogDataContent.indexOf('];');
  if (insertIndex !== -1) {
    const updatedContent = blogDataContent.slice(0, insertIndex) + newPostObject + '\n' + blogDataContent.slice(insertIndex);
    fs.writeFileSync(blogDataPath, updatedContent);
    console.log(`✅ Successfully updated src/lib/blogData.ts with new post: ${slug}`);
  } else {
    console.error('❌ Could not find BLOG_POSTS array in blogData.ts');
  }
}

// ── 4. Trigger Social Post Generation ────────────────────────────────────────

console.log('\n🚀 Triggering social post generation...');
try {
  const output = execSync(`npx tsx tools/generate-posts.ts --slug ${slug}`, { encoding: 'utf8' });
  console.log(output);
} catch (err) {
  console.error('❌ Error triggering generate-posts.ts:', err);
}

console.log('\n✨ News pipeline completed.');
