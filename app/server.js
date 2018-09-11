const forever = require('forever-monitor');
const schedule = require('node-schedule');
const config = require('../config');

console.log('App startet...');

timeChecker();

function timeChecker() {
    var now = new Date();
    var nowHours = now.getHours();
    var miningTime = config.miningTimeHours * 60000;
    console.log(`Gemint wird für ${config.miningTimeHours} Stunden(${miningTime}ms) ab ${config.miningStartingDayHour} Uhr.`);

    if (nowHours >= config.miningStartingDayHour) {

        var miningProzess = new(forever.Monitor)('app/miner.js');

        miningProzess.on('restart', () => {
            console.error(`'Miner startet zum ${miningProzess.times} mal neu.`);
        });

        miningProzess.on('exit:code', function (code) {
            console.error('Miner gestoppt mit Code: ' + code);
        });

        // Miningprozess starten
        console.log('Miner wird versucht zu starten...');
        miningProzess.start();

        // Miningprozess Stoppen und timeChecker loop ausführen
        setTimeout(() => miningProzess.stop(), miningTime); //stopt miner.js
        setTimeout(() => timeChecker(), miningTime + 30000); //miningTime + 10 Sekunden
    } else {
        console.log('Miner läuft erst später.');
        setTimeout(() => timeChecker(), 60000); //1 Stunde
    }
}
