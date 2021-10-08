const puppeteer = require("puppeteer");
const fs = require("fs");
const { promisify } = require("util");
const sleep = promisify(setTimeout);
const readline = require("readline");
const interface = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

// function cookieCount(x) {
//   readline.cursorTo(process.stdout, 0);
//   process.stdout.write(` Cookies clicked ${x} `);
// }

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto("https://orteil.dashnet.org/cookieclicker/", {
    waitUntil: "load",
  });

  await sleep(2000);
  let save = fs.readFileSync("save.txt", "utf8");

  await page.evaluate("Game.ImportSave();");
  await page.type("#textareaPrompt", save);
  await page.evaluate(() => {
    if (l("textareaPrompt").value.length > 0) {
      Game.ImportSaveCode(l("textareaPrompt").value);
      Game.ClosePrompt();
    }
  });

  console.log(`\nCommands:`);
  console.log(`\tstop | saves and closes game\n`);

  interface.on("line", async (input) => {
    switch (input.trim()) {
      case "stop":
        console.log("Saving game...");
        await page.evaluate("Game.ExportSave();");
        await page.waitForSelector("#textareaPrompt");
        let element = await page.$("#textareaPrompt");
        let value = await page.evaluate((el) => el.textContent, element);
        await fs.writeFileSync("./save.txt", value);
        console.log("Saved");
        browser.close();
        interface.close();
        process.exit();
        break;
    }
  });

  await page.waitForSelector("#bigCookie");
  while (true) {
    await page.click("#bigCookie");
  }
})();
