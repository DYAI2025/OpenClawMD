#!/usr/bin/env tsx
/**
 * publish-post.ts — Blog post publishing pipeline
 *
 * Adds a new blog post to blogData.ts, commits, and pushes to trigger deploy.
 *
 * Usage:
 *   npx tsx tools/publish-post.ts --file post.md                    # from markdown file
 *   npx tsx tools/publish-post.ts --file post.md --type weekly      # weekly reflection
 *   npx tsx tools/publish-post.ts --file post.md --dry-run          # preview without writing
 *   npx tsx tools/publish-post.ts --file post.md --no-push          # commit but don't push
 *
 * Markdown file format (frontmatter + content):
 *   ---
 *   title: My Post Title
 *   slug: my-post-title
 *   excerpt: Short description for cards
 *   category: Fundamentals
 *   readTime: 5 min read
 *   type: educational
 *   ---
 *   # My Post Title
 *   Content here...
 *
 * Pipeline: write markdown -> parse -> inject into blogData.ts -> git commit -> git push -> auto-deploy
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const BLOG_DATA_PATH = path.resolve(__dirname, '../src/lib/blogData.ts');
const POSTS_DIR = path.resolve(__dirname, '../content/posts');

interface PostFrontmatter {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readTime: string;
  type: 'educational' | 'weekly';
  date?: string;
  image?: string;
}

function parseFrontmatter(raw: string): { frontmatter: PostFrontmatter; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    throw new Error('No frontmatter found. File must start with --- and end frontmatter with ---');
  }

  const [, fmBlock, content] = match;
  const fm: Record<string, string> = {};
  for (const line of fmBlock.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const val = line.slice(colonIdx + 1).trim();
    fm[key] = val;
  }

  const required = ['title', 'slug', 'excerpt', 'category', 'readTime'];
  for (const key of required) {
    if (!fm[key]) throw new Error(`Missing required frontmatter field: ${key}`);
  }

  return {
    frontmatter: {
      title: fm.title,
      slug: fm.slug,
      excerpt: fm.excerpt,
      category: fm.category,
      readTime: fm.readTime,
      type: (fm.type as 'educational' | 'weekly') || 'educational',
      date: fm.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      image: fm.image,
    },
    content: content.trim(),
  };
}

function slugExists(slug: string): boolean {
  const data = fs.readFileSync(BLOG_DATA_PATH, 'utf-8');
  return data.includes(`slug: '${slug}'`);
}

function generateBlogEntry(fm: PostFrontmatter, content: string): string {
  const escaped = content.replace(/`/g, '\\`').replace(/\$/g, '\\$');
  return `  {
    slug: '${fm.slug}',
    title: '${fm.title.replace(/'/g, "\\'")}',
    excerpt: '${fm.excerpt.replace(/'/g, "\\'")}',
    date: '${fm.date}',
    category: '${fm.category}',
    readTime: '${fm.readTime}',
    type: '${fm.type}',${fm.image ? `\n    image: '${fm.image}',` : ''}
    content: \`
${content}
    \`,
  }`;
}

function injectPost(entry: string): void {
  let data = fs.readFileSync(BLOG_DATA_PATH, 'utf-8');

  // Insert at the beginning of ADDITIONAL_POSTS array
  const marker = 'const ADDITIONAL_POSTS: BlogPost[] = [';
  const markerIdx = data.indexOf(marker);

  if (markerIdx === -1) {
    throw new Error('Could not find ADDITIONAL_POSTS array in blogData.ts');
  }

  const insertAt = markerIdx + marker.length;
  data = data.slice(0, insertAt) + '\n' + entry + ',' + data.slice(insertAt);

  fs.writeFileSync(BLOG_DATA_PATH, data, 'utf-8');
}

function gitCommitAndPush(slug: string, noPush: boolean): void {
  const cwd = path.resolve(__dirname, '..');

  execSync('git add src/lib/blogData.ts', { cwd, stdio: 'inherit' });

  // Also stage any new images
  try {
    execSync('git add public/images/blog/', { cwd, stdio: 'pipe' });
  } catch {
    // No images dir yet, that's fine
  }

  const msg = `content: publish "${slug}"`;
  execSync(`git commit -m "${msg}"`, { cwd, stdio: 'inherit' });

  if (!noPush) {
    console.log('\nPushing to main (triggers deploy)...');
    execSync('git push origin main', { cwd, stdio: 'inherit' });
    console.log('Pushed. Deploy will start automatically via GitHub Actions.');
  } else {
    console.log('\n--no-push: committed locally. Run `git push origin main` to deploy.');
  }
}

// ── CLI ────────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const flags = {
  file: '',
  type: '',
  dryRun: false,
  noPush: false,
};

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--file' && args[i + 1]) flags.file = args[++i];
  else if (args[i] === '--type' && args[i + 1]) flags.type = args[++i];
  else if (args[i] === '--dry-run') flags.dryRun = true;
  else if (args[i] === '--no-push') flags.noPush = true;
}

if (!flags.file) {
  console.error('Usage: npx tsx tools/publish-post.ts --file <path-to-markdown>');
  console.error('');
  console.error('Options:');
  console.error('  --file <path>    Markdown file with frontmatter');
  console.error('  --type <type>    Override type (educational|weekly)');
  console.error('  --dry-run        Preview entry without writing');
  console.error('  --no-push        Commit but do not push');
  process.exit(1);
}

const filePath = path.resolve(flags.file);
if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

const raw = fs.readFileSync(filePath, 'utf-8');
const { frontmatter, content } = parseFrontmatter(raw);

if (flags.type) {
  frontmatter.type = flags.type as 'educational' | 'weekly';
}

// Check for duplicate slug
if (slugExists(frontmatter.slug)) {
  console.error(`Slug "${frontmatter.slug}" already exists in blogData.ts`);
  process.exit(1);
}

const entry = generateBlogEntry(frontmatter, content);

if (flags.dryRun) {
  console.log('=== DRY RUN — would inject this entry ===\n');
  console.log(entry);
  console.log('\n=== End of entry ===');
  process.exit(0);
}

// Ensure content/posts dir exists for archival
if (!fs.existsSync(POSTS_DIR)) {
  fs.mkdirSync(POSTS_DIR, { recursive: true });
}
// Copy source file to content/posts/ for archival
fs.copyFileSync(filePath, path.join(POSTS_DIR, path.basename(filePath)));

injectPost(entry);
console.log(`Injected "${frontmatter.title}" into blogData.ts`);

gitCommitAndPush(frontmatter.slug, flags.noPush);
