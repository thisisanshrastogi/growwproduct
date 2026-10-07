import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  await page.goto('http://localhost:5174/');
  
  // click on Learn tab
  await page.waitForTimeout(1000);
  await page.evaluate(() => {
    const tabs = document.querySelectorAll('button');
    for (let t of tabs) {
      if (t.innerText && t.innerText.includes('Learn')) {
        t.click();
      }
    }
  });
  await page.waitForTimeout(1000);
  await browser.close();
})();
