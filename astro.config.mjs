// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    server: {
      // Permitir todos los hosts (cuidado en producción)
      allowedHosts: ['*']
    }
  }
});
