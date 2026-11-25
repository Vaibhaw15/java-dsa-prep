import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { handler } from './runner/javaRunner.js';

// Adds the local Java runner (/api/run) to `npm run dev` and `npm run preview`.
const javaRunner = () => ({
  name: 'java-runner',
  configureServer(server) { server.middlewares.use(handler()); },
  configurePreviewServer(server) { server.middlewares.use(handler()); },
});

export default defineConfig(({ mode }) => ({
  plugins: [react(), javaRunner(), ...(mode === 'single' ? [viteSingleFile()] : [])],
  base: './',
  build: { outDir: mode === 'single' ? 'dist-single' : 'dist', chunkSizeWarningLimit: 4000 },
  server: { port: 5173 },
}));
