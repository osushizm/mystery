// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: 'server', // Cloudflare Workersを利用

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react(), cloudflare()]
});
