const puppeteer = require('puppeteer');
const helper = require('./helper.js');
const config = require('../config.js');

(async () => {
    const browser = await puppeteer.launch({
        headless: config.headless,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-demo-mode', '--disable-web-security', '--disable-gpu'],
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(120000);
    await page.goto(`https://allcoins.pw/miner.php?coin=${config.coin}&uid=${config.uid}`);

    await helper.sleep(5000);

    await closeCoinHiveDialog(page);

    await helper.sleep(5000);

    await setMinigPowerTo(page, 90);

    await helper.sleep(10000);    
    
    printHashes(page);
})();


async function closeCoinHiveDialog(page) {
    if (!!(await page.$('#accept'))) {
        console.log('"allcoins.pw möchte gerne Ihre Rechenleistung nutzen" bereits akzeptiert.');
    } else {
        console.log('"allcoins.pw möchte gerne Ihre Rechenleistung nutzen" wird akzeptiert....');
        var frames = await page.frames();
        var coinHiveIframe = await frames.find(frame => frame.url().includes("https://authedmine.com/authenticate.html"));
        const acceptButton = await coinHiveIframe.$('#accept');
        await acceptButton.click();
    }
}

async function closeRegisterDialog(page) {
    if (!!(await page.$('#register'))) {
        console.log('Register Dialog bereits geschlossen.');
    } else {
        console.log('Register Dialog wird geschlossen...');
        await page.evaluate(() => {
            document.querySelector('#register.modal-dialog.modal-content.modal-header.close').click();
        });
    }
}

async function setMinigPowerTo(page, power) {
    console.log(`Power wird auf ${power}% gesetzt.`);
    await page.evaluate(() => {
        //document.getElementById('#power').value = power;
        document.cookie ="pminer="+power+"; expires=Sat, 05 01 2119 09:50:25 UTC; path=/";
        /*setTimeout(() => {
            power();
        }, 2000);*/
    });
    await page.reload();
    console.log(`Power wurde auf ${power}% gesetzt.`);
}


async function printHashes(page) {
    var stats = await page.evaluate(() => {
        var hashPower = document.getElementById('ths').innerHTML;
        var currentHashes = document.getElementById('th').innerHTML;
        var hashesToPay = document.getElementById('thp').innerHTML;
        return {
            hashPower: hashPower,
            currentHashes: currentHashes,
            hashesToPay: hashesToPay
        };
    });
    console.log('Hash Power: ' + stats.hashPower);
    console.log('Aktuelle Hashes: ' + stats.currentHashes);
    console.log('Auszuzahlende Hashes: ' + stats.hashesToPay);
    await helper.sleep(10000);
    printHashes(page);
}
