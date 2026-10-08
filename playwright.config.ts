import { defineConfig, devices } from '@playwright/test';

/**
 * Testes automatizados da entrega VZS-142 (cupom de desconto e frete grátis) da Verzel Store.
 * Documentação do Playwright: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './automacao/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  /* O ambiente é compartilhado com outros candidatos: poucos workers para não gerar carga. */
  workers: 2,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'https://verzel-store.qa-test-verzel-store.workers.dev',
    locale: 'pt-BR',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'api',
      testDir: './automacao/tests/api',
      use: { extraHTTPHeaders: { 'Content-Type': 'application/json' } },
    },
    {
      name: 'e2e',
      testDir: './automacao/tests/e2e',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
