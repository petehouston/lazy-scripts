const puppeteer = require('puppeteer');
const CONFIG = require('./config.json');

async function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


(async () => {
  const browser = await puppeteer.launch({
    headless: true
  });

  const page = await browser.newPage();
  await page.goto(CONFIG.mail_url, {waitUntil: 'networkidle2'});
  await page.type(CONFIG.selector.user, CONFIG.credential.user);
  await page.type(CONFIG.selector.pass, CONFIG.credential.pass);
  await page.click(CONFIG.selector.submit);
  await timeout(2000)

  const selUnread = CONFIG.selector.unread_mail;
  await page.waitForSelector(selUnread);
  const unreadCount = await page.evaluate(s => document.querySelector(s).innerText, selUnread);
  console.log('Unread Mail: ' + unreadCount);
  await browser.close();
})();