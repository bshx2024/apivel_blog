// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://apivale.com',
  base: '/blog',
  redirects: {
    '/connect-glm-5-3-to-claude-code-cli': '/connect-glm-5-3-to-claude-code-cli-cursor',
    '/how-to-connect-glm-5-3-to-claude-code-cli-cursor': '/connect-glm-5-3-to-claude-code-cli-cursor',
    '/cursor-pro-vs-own-api-key': '/cursor-pro-vs-custom-api-key'
  },
  integrations: [sitemap()]
});