import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: resolve(__dirname, './src'),
      shared: resolve(__dirname, './src/shared'),
      auth: resolve(__dirname, './src/auth'),
      anonymous: resolve(__dirname, './src/anonymous'),
      types: resolve(__dirname, './src/types'),
    },
  },
});
