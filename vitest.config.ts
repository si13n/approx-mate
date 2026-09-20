import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Vitest owns unit/component tests; Playwright collects the e2e directory.
    exclude: ['e2e/**', '**/node_modules/**', '**/dist/**'],
  },
})
