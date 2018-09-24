const puppeteer = require('puppeteer');

const CONFIG = require('./config.json');
// const WORKPLACE_URL = 'https://' + CONFIG.workplace_id + '.facebook.com/work/landing/input';
const WORKPLACE_URL = 'https://' + CONFIG.workplace_id + '.facebook.com/login/?next=%2F&email=' + encodeURIComponent(CONFIG.email);

(async () => {
    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()
    
    await page.goto(WORKPLACE_URL);

    // await page.type('#content form input[data-testid="email_input"]', CONFIG.email);
    // await page.click('#content form button[type="submit"]');

    await page.type('#login_form input[type="password"]', CONFIG.password);

    await page.click('#login_form button[type="submit"]');

    await page.waitForNavigation()
    
    await page.goto('https://nfqasia.facebook.com/notifications/hub/unread/');

    await page.waitForSelector('div[data-testid="notif_hub_container"] li[role="presentation"] > a[aria-selected=true] > div');

    const unread_count = await page.$eval('div[data-testid="notif_hub_container"] li[role="presentation"] > a[aria-selected=true] > div', e => e.innerText);

    console.log('Unread count: ' + unread_count);

    // await page.waitForSelector('div[data-testid="notif_hub_notifs_list"] ul[data-testid="see_all_list"]');

    await page.waitFor(3000);

    // const items = await page.$eval('div[data-testid="notif_hub_notifs_list"] ul[data-testid="see_all_list"] > li', e => {
    //     console.log(e);
    //     let anchor = e.querySelector('a');
    //     if(!!anchor) {
    //         let d = {};
    //         console.log('1');
    //         d.text = anchor.innerText;
    //         let t = anchor.querySelector('span.timestampContent');
    //         console.log('2');
    //         d.time = t.innerText;
    //         d.text = d.text.replace(d.time, '');
    //         return d;
    //     }
    // });


    // console.log(JSON.stringify(items));

    await browser.close();

})();