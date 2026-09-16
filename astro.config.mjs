// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://apivale.com',
  base: '/blog',
  redirects: {
    '/connect-glm-5-3-to-claude-code-cli': '/blog/connect-glm-5-3-to-claude-code-cli-cursor',
    '/how-to-connect-glm-5-3-to-claude-code-cli-cursor': '/blog/connect-glm-5-3-to-claude-code-cli-cursor',
    '/cursor-pro-vs-own-api-key': '/blog/cursor-pro-vs-custom-api-key',
    '/gpt-6-sol-vs-deepseek-v4-migration-guide': '/blog/gpt-6-sol-vs-deepseek-v4'
  },
  integrations: [sitemap()]
});