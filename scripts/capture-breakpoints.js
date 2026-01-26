// screenshots with Playwright
// Usage: npm run screenshot
// Installs required: npm i -D playwright
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const out = path.resolve(__dirname, '..', 'screenshots');
  if (!fs.existsSync(out)) fs.mkdirSync(out);

  const pagePath = 'file://' + path.resolve(__dirname, '..', 'index.html');
  const breakpoints = [
    { name: 'xl', width: 1400, height: 900 },
    { name: 'lg', width: 1200, height: 800 },
    { name: 'md', width: 1000, height: 800 },
    { name: 'sm', width: 800, height: 700 },
    { name: 'xs', width: 600, height: 900 },
    { name: 'xxs', width: 480, height: 900 }
  ];

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();

  for (const bp of breakpoints) {
    await page.setViewportSize({ width: bp.width, height: bp.height });
    await page.goto(pagePath, { waitUntil: 'load' });
    // wait a bit for fonts/images
    await page.waitForTimeout(400);
    const file = path.join(out, `screenshot-${bp.name}-${bp.width}x${bp.height}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log('Saved', file);
  }

  await browser.close();
})();
