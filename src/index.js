const SunCalc = require('suncalc');
const player = require('./lib/player');
const storage = require('node-persist');

// @todo: make these `let`, changed by web client
const [latitude, longitude] = [
    process.env.LATITUDE || 43.2557,
    process.env.LONGITUDE || -79.8711
];

const sunTimes = SunCalc.getTimes(new Date(), latitude, longitude);

const isDiurnal = () =>
    new Date() < sunTimes.sunset &&
    new Date() > sunTimes.sunrise;

const isNoctural = () =>
    !isDiurnal();

// these will all become `let`
const songFile = './songs/EAME2.mp3'; // @todo: make into songFolder ?
const cycle = process.env.CYCLE || 'diurnal';
const between = process.env.BREAKS || 30 * 1000; // 3 mins
const sort = process.env.ORDER || 'random';
const pause = process.env.PAUSE || false;

storage.initSync();

// disabled for development purposes
const verifyCycle = () =>
    true; /*cycle === 'diurnal'
    ? isDiurnal()
    : isNoctural();*/

const scheduleNext = () => {
    player.on('play end', () => {
        console.log('scheduling next');
        setTimeout( playNow, between );
    });
    return true;
};

// http: add web endpoint that will accept changes

const playNow = () => {

    storage.setItemSync('nextPlay', between);
    console.log('starting next track: ' + songFile);
    player.add(songFile);

    if ( verifyCycle() ) {

        player.play();
    }
    else {
        console.log('Cycle set to ' + cycle + ', does not match current time cycle. Not playing. Rescheduling...');
    }
    scheduleNext();
};

if ( storage.getItemSync('nextPlay') ) {
    setTimeout( playNow, storage.getItemSync('nextPlay') );
}
else {
    playNow();
}
