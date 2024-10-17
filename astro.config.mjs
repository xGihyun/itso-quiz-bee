// @ts-check
import { defineConfig, envField } from 'astro/config';

import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind({
    applyBaseStyles: false
  })],
  output: "server",
  experimental: {
    env: {
      schema: {
        DATABASE_URL: envField.string({ context: "server", access: "secret" }),
      },
    },
  },
  security: {
    checkOrigin: false
  }
});
