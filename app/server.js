const forever = require('forever-monitor');
const schedule = require('node-schedule');
const config = require('../config');

console.log('App startet...');

var rule = new schedule.RecurrenceRule();
rule.hour = config.miningStartingDayHour;
rule.minute = config.miningStartingDayMinute;

console.log(`Miner startet um ${rule.hour}:${rule.minute}`);

var minerJob = schedule.scheduleJob(rule, function () {

    var miningProzess = new(forever.Monitor)('app/miner.js');

    miningProzess.on('restart', () => {
        console.error(`'Miner startet zum ${miningProzess.times} mal neu.`);
    });

    miningProzess.on('exit:code', function (code) {
        console.error('Miner gestoppt mit Code: ' + code);
        if (code === 100) {
            console.log(`Prozess erfolgreich gestoppt (Code: ${code})`);
            miningProzess.stop();
        }
    });

    // Miningprozess starten
    console.log('Miner wird versucht zu starten...');
    miningProzess.start();
});
