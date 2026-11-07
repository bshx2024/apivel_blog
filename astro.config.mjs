// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

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
  integrations: [sitemap()]
});