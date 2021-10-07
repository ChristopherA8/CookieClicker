const puppeteer = require("puppeteer");
const { promisify } = require("util");
const sleep = promisify(setTimeout);
(async () => {
  const browser = await puppeteer.launch({ headless: false });
  page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto("https://orteil.dashnet.org/cookieclicker/", {
    waitUntil: "load",
  });
  // Wait 10 seconds to let you import save data
  await sleep(10000);
  while (true) {
    await page.click("#bigCookie");
  }
})();
