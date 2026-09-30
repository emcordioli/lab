const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './',
  testMatch: 'site.spec.cjs',
  timeout: 45000,
  expect: { timeout: 15000 },
  retries: process.env.CI ? 2 : 0,
  workers: 2,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: { browserName: 'chromium', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
});
