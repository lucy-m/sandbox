/// <reference types='vitest' />
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig, searchForWorkspaceRoot } from 'vite';

export default defineConfig({
  cacheDir: '../node_modules/.vite/test-app',

  server: {
    port: 4200,
    host: 'localhost',
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd())],
    },
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [svelte(), nxViteTsPaths()],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
});
