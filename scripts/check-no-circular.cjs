#!/usr/bin/env node
/**
 * Static scanner blocking circular blog redirects (`redirect=/blog/...` or `redirect=%2Fblog...`).
 * Enforces Zero-Circular-Redirect across skills, SOP docs, Astro templates, and components.
 * Pass `--strict-all` to also fail on legacy `src/content/blog/*.md` posts once cleaned up.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const STRICT_ALL = process.argv.includes('--strict-all');
const PATTERN = /redirect=(?:\/|%2F)blog\b/i;

const ENFORCED_TARGETS = [
  '.agent/skills',
  'AGENTS.md',
  'BLOG_WRITING_STANDARD.md',
  'src/components',
  'src/pages',
];

const LEGACY_CONTENT_DIR = 'src/content/blog';

function walk(relPath, out = []) {
  const full = path.join(ROOT, relPath);
  if (!fs.existsSync(full)) return out;
  const stat = fs.statSync(full);
  if (stat.isFile()) {
    out.push(relPath);
    return out;
  }
  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
    walk(path.join(relPath, entry.name), out);
  }
  return out;
}

function scanFiles(files) {
  const hits = [];
  for (const rel of files) {
    // Skip docs/checkers describing the banned pattern itself if marked as negative rule
    const full = path.join(ROOT, rel);
    const lines = fs.readFileSync(full, 'utf8').split(/\r?\n/);
    lines.forEach((line, idx) => {
      if (!PATTERN.test(line)) return;
      // Ignore prose/audit lines explicitly explaining the ban in skills, docs, or checkers
      const isRuleProse =
        rel.endsWith('check-no-circular.cjs') ||
        rel.endsWith('audit_article.cjs') ||
        /严禁|禁止|NEVER|do not|Violation|Banned|0 处/i.test(line);
      if (!isRuleProse) {
        hits.push({ file: rel.replace(/\\/g, '/'), line: idx + 1, text: line.trim() });
      }
    });
  }
  return hits;
}

const enforcedFiles = ENFORCED_TARGETS.flatMap((t) => walk(t));
const enforcedHits = scanFiles(enforcedFiles);

const legacyFiles = walk(LEGACY_CONTENT_DIR);
const legacyHits = scanFiles(legacyFiles);

console.log('=== Zero-Circular-Redirect Static Scan ===');
if (enforcedHits.length > 0) {
  console.error(`\n❌ BLOCKED: Found ${enforcedHits.length} circular redirect(s) in enforced files:`);
  enforcedHits.forEach((h) => console.error(`  - ${h.file}:${h.line}: ${h.text}`));
  process.exit(1);
}

if (legacyHits.length > 0) {
  if (STRICT_ALL) {
    console.error(`\n❌ BLOCKED (--strict-all): Found ${legacyHits.length} circular redirect(s) in legacy blog posts.`);
    process.exit(1);
  } else {
    console.warn(`⚠️ Legacy warning: ${legacyHits.length} occurrence(s) remain in ${LEGACY_CONTENT_DIR} (pass --strict-all after batch cleanup).`);
  }
}

console.log('✅ Enforced templates, components, skills, and SOPs passed (0 circular redirect templates).');
