import { defineConfig } from 'vite';

// GitHub Pages serves this demo from /<repo-name>/demo2/.
// The `PAGES_BASE` env var is set by .github/workflows/pages.yml at build time.
export default defineConfig({
  base: process.env.PAGES_BASE ?? './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
