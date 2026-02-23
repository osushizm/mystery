// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: 'server', // Cloudflare Pages SSR

  adapter: cloudflare({
    platformProxy: {
      enabled: true, // ローカル開発時に D1 などのバインディングを使用可能にする
    },
  }),

  vite: {
    plugins: [tailwindcss()],
    ssr: {
      target: 'webworker',
    },
  },

  integrations: [react()],
});
