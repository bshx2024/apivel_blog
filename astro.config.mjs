// @ts-check
import { defineConfig } from 'astro/config';
import fs from 'node:fs';
import path from 'node:path';

import sitemap from '@astrojs/sitemap';

// Build a slug -> ISO date lookup from blog markdown frontmatter for accurate <lastmod>
function loadBlogLastmodMap() {
  const map = new Map();
  let latestIso = new Date().toISOString();
  let latestMs = 0;
  try {
    const blogDir = path.resolve(process.cwd(), 'src/content/blog');
    for (const file of fs.readdirSync(blogDir)) {
      if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;
      const slug = file.replace(/\.(md|mdx)$/, '');
      const raw = fs.readFileSync(path.join(blogDir, file), 'utf8');
      const m = raw.match(/^date:\s*['"]?([^'"\r\n]+)['"]?/m);
      if (m) {
        const parsed = new Date(m[1].trim());
        if (!Number.isNaN(parsed.getTime())) {
          const iso = parsed.toISOString();
          map.set(`/blog/${slug}/`, iso);
          if (parsed.getTime() > latestMs) {
            latestMs = parsed.getTime();
            latestIso = iso;
          }
        }
      }
    }
  } catch {
    // Fallback to build time if content directory is unavailable
  }
  return { map, latestIso };
}

const { map: blogLastmodMap, latestIso: latestBlogIso } = loadBlogLastmodMap();

// Rehype plugin to automatically add rel="nofollow" to parameterized & redirect CTA links
function rehypeNofollowTrackingLinks() {
  return (tree) => {
    function traverse(node) {
      if (!node) return;
      if (node.type === 'element' && node.tagName === 'a' && node.properties?.href) {
        const href = String(node.properties.href);
        if (
          href.includes('redirect=') ||
          href.includes('/pricing?') ||
          href.includes('/sign-up?') ||
          href.includes('/sign-in?') ||
          href.includes('utm_source=')
        ) {
          const rels = Array.isArray(node.properties.rel)
            ? [...node.properties.rel]
            : (node.properties.rel ? String(node.properties.rel).split(/\s+/) : []);
          if (!rels.includes('nofollow')) {
            rels.push('nofollow');
          }
          node.properties.rel = rels;
        }
      }
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(traverse);
      }
    }
    traverse(tree);
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://apivel.com',
  base: '/blog',
  trailingSlash: 'always',
  markdown: {
    rehypePlugins: [rehypeNofollowTrackingLinks]
  },
  redirects: {
    '/blog/gpt-6-cyber-request-access-api-guide/': '/blog/openai-gpt-6-cyber-api-access-guide/',
    '/gpt-6-cyber-request-access-api-guide/': '/blog/openai-gpt-6-cyber-api-access-guide/'
  },
  integrations: [
    sitemap({
      serialize(item) {
        const pathname = new URL(item.url).pathname;
        if (blogLastmodMap.has(pathname)) {
          item.lastmod = blogLastmodMap.get(pathname);
        } else {
          item.lastmod = latestBlogIso;
        }
        return item;
      }
    })
  ]
});