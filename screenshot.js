import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/');
  await page.setViewport({ width: 1280, height: 2500 });
  await page.screenshot({ path: 'home-screenshot.png', fullPage: true });
  await browser.close();
})();
