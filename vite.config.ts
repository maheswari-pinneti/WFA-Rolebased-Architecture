/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./frontend/src', import.meta.url)),
    },
  },
  server: {
    port: 3001,
    open: false,
    proxy: {
      '/v1': {
        target: `http://localhost:${PORT}`,
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: `http://localhost:${PORT}`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 2200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  test: {
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    exclude: ['node_modules', 'tests/**/*.spec.ts'],
    globals: true
  }
});

