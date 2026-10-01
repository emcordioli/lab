const { test, expect } = require('@playwright/test');

const targets = [
  ['emcordioli.com.br', process.env.SITE_URL || 'https://emcordioli.com.br/'],
  ['GPT Sites', 'https://emanuel-cordioli-emc.emcordioli.chatgpt.site/'],
];
for (const [name, baseURL] of targets) {
  test.describe(name, () => {
    test.beforeEach(async ({ page }) => {
      expect(baseURL, 'Site URL must be set').toBeTruthy();
      const response = await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
      expect(response.status()).toBe(200);
      expect(new URL(page.url()).origin).toBe(new URL(baseURL).origin);
    });

    test('site, logo and profile photo are available', async ({ page }) => {
      await expect(page).toHaveTitle(/Emanuel Cordioli.*EMC Tech Consulting/);
      await expect(page.locator('h1')).toBeVisible();
      for (const selector of ['.brand-logo', '.profile-photo']) {
        const image = page.locator(selector);
        await expect(image).toBeVisible();
        await expect.poll(() => image.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
        .toBe(true);
    });

    for (const cta of [
      { label: 'Conversar pelo WhatsApp', host: 'wa.me', path: '/5548998039876' },
      { label: 'Falar com Emanuel', host: 'wa.me', path: '/5548998039876' },
      { label: 'Veja minha trajetória no LinkedIn', host: 'www.linkedin.com', path: '/in/emanuelcordioli' },
      { label: 'Visitar a InstaCasa', host: 'instacasa.com.br', path: '/' },
    ]) {
      test('CTA: ' + cta.label, async ({ page, context }, testInfo) => {
        const link = page.getByRole('link', { name: cta.label, exact: true });
        await expect(link).toBeVisible();
        const destination = new URL(await link.getAttribute('href'));
        expect(destination.protocol).toBe('https:');
        expect(destination.hostname).toBe(cta.host);
        expect(destination.pathname.replace(/\/$/, '')).toBe(cta.path.replace(/\/$/, ''));
        if (cta.host === 'wa.me') expect(destination.searchParams.get('text')).toBeTruthy();

        // Open the actual CTA. Observe its initial navigation without interacting
        // with login forms, messaging applications or third-party controls.
        const navigation = context.waitForEvent('request', {
          predicate: req => req.isNavigationRequest() && req.url() === destination.href,
          timeout: 15000,
        });
        const popup = page.waitForEvent('popup');
        await link.click();
        const [request, opened] = await Promise.all([navigation, popup]);
        expect(request.method()).toBe('GET');
        await testInfo.attach('cta-destination', {
          body: Buffer.from(request.url()), contentType: 'text/plain',
        });
        await opened.close();
      });
    }
  });
}
