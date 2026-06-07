import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['src/test/setup.js'],
    include: ['src/**/*.test.{js,jsx}'],
    environmentMatchGlobs: [
      ['src/ui/**/*.test.{js,jsx}', 'jsdom'],
    ],
    coverage: {
      provider: 'v8',
      include: ['src/domain/**/*.js', 'src/ui/**/*.jsx'],
      exclude: ['src/domain/mock/**', 'src/test/**'],
    },
  },
});
