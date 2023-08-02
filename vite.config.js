// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2018', // or another target of your choice
    rollupOptions: {
      // Add the esbuild loader configuration for JSX
      // Note that the key is '.js' because JSX files typically use the .js extension
      loader: {
        '.js': 'jsx',
      },
    },
  },
});