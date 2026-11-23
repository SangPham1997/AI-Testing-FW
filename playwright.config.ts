import { defineConfig, devices } from '@playwright/test';
import * as os from 'node:os';
import { environments } from './config/environments';

export default defineConfig({
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html-report', open: 'never' }],
    ['junit', { outputFile: 'reports/junit.xml' }],
    [
      'allure-playwright',
      {
        resultsDir: 'allure-results',
        detail: true,
        suiteTitle: true,
        environmentInfo: {
          os_platform: os.platform(),
          os_release: os.release(),
          os_version: os.version(),
          node_version: process.version,
          test_env: process.env.TEST_ENV ?? 'dev',
          ci: process.env.CI === 'true' ? 'true' : 'false',
        },
      },
    ],
  ],
  projects: [
    {
      name: 'ui',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: environments.uiBaseURL,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: environments.apiBaseURL,
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    },
  ],
});
