/// <reference types="vitest" />
import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [Vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
  resolve: {
    alias: {
      '@protos': path.resolve(__dirname, '../protos/gen/ts/protos'),
    },
  },
}); 