import { defineConfig } from 'vite';

// base './' makes the build work on GitHub Pages sub-paths (user.github.io/repo/)
export default defineConfig({
  base: './',
  build: { target: 'es2019', assetsInlineLimit: 0 },
});
