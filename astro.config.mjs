// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  site: "http://demo.dkuaik.dev",
  vite: {
    server: {
      allowedHosts: [
        "demos-chatbotragindava-aog5if-68d07a-217-196-48-210.traefik.me",
        "localhost",
        "127.0.0.1"
      ],
    },
    preview: {
      allowedHosts: [
        "demos-chatbotragindava-aog5if-68d07a-217-196-48-210.traefik.me",
        "localhost",
        "127.0.0.1"
      ],
    },
  },
});
