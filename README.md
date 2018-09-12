# mb-server-monero-miner
A miner for my server, that starts mining at night when server is unused. 
The miner loads the allcoins.pw site and starts javascript mining.
Uid and available coins can be found at https://allcoins.pw/miner.php

Installation
============

    npm install
     
    
Run
============

* Start server: `npm start`

Config.js
============

```javascript
module.exports = {
    'miningTimeHours': 12, // Time to mine
    'miningStartingDayHour': 9, // Hour to start
    'miningStartingDayMinute': 54, // Minute to start
    'headless': true, // Runs Chromium Browser in headless mode
    'uid': '12345',
    'coin': 'BTC', // Coinname example: BTC, ETC, ETH
};
```
