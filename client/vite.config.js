import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'force-exit-after-build',
      apply: 'build',
      closeBundle() {
        console.log('Build completed, forcing exit to prevent Vercel hanging...');
        process.exit(0);
      }
    }
  ],
  build: {
    outDir: 'dist',
  }
});
