const SunCalc = require('suncalc');
const storage = require('node-persist');
const player = require('./lib/player');
const server = require('./lib/server.js');
const Config = require('./models/config.js');

let currentTimeout, hasPaused;

storage.initSync();

const defaultConfig = {
    latitude: 43.2258,
    longitude: -79.8711,
    cycle: 'diurnal',
    sort: 'random',
    songFile: './songs/EAME2.mp3',
    interval: 0.2,
    pause: false
};

const currentConfig = Object.assign( defaultConfig, Config.get() );

const nextPlay = (fn, time) => {
    clearTimeout(currentTimeout);
    currentTimeout = setTimeout(fn, time);
};

// needed when we run the very first time (no storage yet)
Config.put(currentConfig);

// need to change so it'll recalc as long/lat get adjusted, not just first time
const sunTimes = SunCalc.getTimes(new Date(), Config.get().latitude, Config.get().longitude);
const getMinutes = () => Config.get().interval;
const getSeconds = () => Config.get().interval * 60;
const getMilliseconds = () => Config.get().interval * 1000 * 60;

const isDiurnal = () =>
    new Date() < sunTimes.sunset &&
    new Date() > sunTimes.sunrise;

const isNoctural = () =>
    !isDiurnal();

// @todo change to folders
const songFile = './songs/EAME2.mp3'; // @todo: make into songFolder ?

// disabled for development purposes
const verifyCycle = () =>
    true; /*Config.get().cycle === 'diurnal'
        ? isDiurnal()
        : isNoctural();*/

const scheduleNext = () => {
    player.on('end', () => {
        console.log('Scheduling next in: '+ getSeconds() +' seconds.');
        nextPlay(playNow, getMilliseconds());
    });
    return true;
};

const playNow = () => {

    storage.setItemSync('runtime/nextPlay', getMilliseconds());

    console.log('starting next track: ' + songFile + ' in ' + getSeconds() + ' seconds.');

    if ( verifyCycle() ) {

        player.play(songFile);
        nextPlay(playNow, storage.getItemSync('runtime/nextPlay'));
    }
    else {
        console.log('Cycle set to ' + Config.get().cycle + ', does not match current time cycle. Not playing. Rescheduling...'+ ' in ' + getSeconds() + ' seconds.');
        nextPlay(playNow, storage.getItemSync('runtime/nextPlay'));
    }
};


// first run
if ( storage.getItemSync('runtime/nextPlay') ) {
    nextPlay(playNow, storage.getItemSync('runtime/nextPlay'));
}
else {
    playNow();
}

// setup a loop wherein we check to see if we've paused
// and we then kill the next scheduled thing because it could be minutes away
setInterval(() => {

    if ( Config.get().pause ) {
        hasPaused = true;
        nextPlay(() => console.log('PAUSED, skipping... checking again in 5 seconds...'), 5000);
        return;
    }

    if ( hasPaused && ! Config.get().pause ) {
        
        // we've resumed

        playNow();
        hasPaused = false;     
    }
}, 5000);

// start the service
server.listen(8813, () => {
    const instance = server.address();
    console.info(`Server instance started: ${instance.address} ${instance.port}`);
});
