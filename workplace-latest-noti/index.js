const puppeteer = require('puppeteer');

const CONFIG = require('./config.json');
// const WORKPLACE_URL = 'https://' + CONFIG.workplace_id + '.facebook.com/work/landing/input';
const WORKPLACE_URL = 'https://' + CONFIG.workplace_id + '.facebook.com/login/?next=%2F&email=' + encodeURIComponent(CONFIG.email);

(async (cb) => {
    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()
    
    await page.goto(WORKPLACE_URL);

    await page.type('#login_form input[type="password"]', CONFIG.password);

    await page.click('#login_form button[type="submit"]');

    await page.waitForNavigation()
    
    await page.goto('https://nfqasia.facebook.com/notifications/hub/unread/');

    await page.waitForSelector('div[data-testid="notif_hub_container"] li[role="presentation"] > a[aria-selected=true] > div');

    const unread_count = await page.$eval('div[data-testid="notif_hub_container"] li[role="presentation"] > a[aria-selected=true] > div', e => e.innerText);

    await page.waitFor(3000);

    const list = await page.$$eval('div[data-testid="notif_hub_notifs_list"] ul[data-testid="see_all_list"] > li', lis => lis.map(e => {
            let anchor = e.querySelector('a');
            if(!!anchor) {
                return {
                    text: anchor.innerText.split('\n')[0],
                    time: anchor.innerText.split('\n')[1],
                    url : anchor.href
                }
            }
        })
    );


    await browser.close();

    if(!!cb) {
        cb({
            unread_count,
            items: list
        })
    }

})(render);

function render(data) {
    console.log('========================================================');
    console.log('| WORKPLACE AUTOMATION TOOLS                           |');
    console.log('| Developed by Pete Houston <contact@petehouston.com>  |');
    console.log('========================================================');
    console.log('Your Workplace: https://' + CONFIG.workplace_id + '.facebook.com/');
    console.log('Your email    : ' + CONFIG.email);
    console.log('---------- Please wait for a moment --------------------\n');
    console.log('[UNREAD NOTIFICATION] ' + data.unread_count);
    

    data.items.forEach(i => {
        console.log('   - "' + i.text + '"' + ' [about ' + i.time + ' ago]');        
        console.log('     Visit: ' + i.url);
    });

    console.log('--------------------------------------------------------');
    console.log('Feel free to contact if you have any question!');
}