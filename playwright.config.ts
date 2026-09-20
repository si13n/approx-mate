import { defineConfig, devices } from '@playwright/test';

const localBaseURL = 'http://127.0.0.1:4173';
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? localBaseURL;
const startLocalServer = !process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: './e2e',
  outputDir: 'test-results',
  fullyParallel: true,

  // CI safeguards catch accidentally committed test.only and reduce flaky failures.
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // GitHub annotations show failures inline; the HTML report remains downloadable.
  reporter: process.env.CI
    ? [['github'], ['html', { outputFolder: 'playwright-report', open: 'never' }]]
    : [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],

  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  // Wrangler serves both the built SPA and Worker API, matching production routing.
  webServer: startLocalServer
    ? {
        command:
          'pnpm build && pnpm exec wrangler dev --local --ip 127.0.0.1 --port 4173 --show-interactive-dev-session=false --log-level error',
        url: localBaseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : undefined,

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});
