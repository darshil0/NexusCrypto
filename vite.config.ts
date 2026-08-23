import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const rawBasePath =
    env.VITE_BASE_PATH ??
    env.NEXT_PUBLIC_BASE_PATH ??
    env.BASE_PATH ??
    '/';

  const base = rawBasePath.endsWith('/') ? rawBasePath : `${rawBasePath}/`;

  return {
    base,

    plugins: [react(), tailwindcss()],

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,

      // HMR is disabled in AI Studio when DISABLE_HMR is true.
      hmr: env.DISABLE_HMR !== 'true',

      // Disable watching during agent edits to reduce CPU use and visual flicker.
      watch: env.DISABLE_HMR === 'true' ? null : {},
    },

    build: {
      outDir: 'out',
      emptyOutDir: true,
      sourcemap: mode !== 'production',
    },

    test: {
      environment: 'jsdom',
      globals: true,
      css: true,
    },
  };
});
