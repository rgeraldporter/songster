const Promise = require('bluebird');
const R = require('ramda');
const SunCalc = require('suncalc');
const storage = require('node-persist');
const player = require('./lib/player');
const server = require('./lib/server.js');
const Config = require('./models/config.js');
const mainLoopInterval = 5000;

let currentTimeout, hasPaused;

storage.initSync();

const defaultConfig = {
    latitude: 43.2258,
    longitude: -79.8711,
    cycle: 'diurnal',
    sort: 'random',
    songFile: './songs/BOBO/BOBO1.mp3',
    interval: 0.2,
    pause: false
};

// in case this is the first run, populate with defaults
// also will populate in new configs as they are added
Config.put(Object.assign(defaultConfig, Config.get()));

const doPause = () => (hasPaused = true);
const unPause = () => (hasPaused = false);
const isPaused = () => hasPaused;

const nextAction = (fn, time) => {
    clearTimeout(currentTimeout);
    currentTimeout = setTimeout(fn, time);
};

// need to change so it'll recalc as long/lat get adjusted, not just first time
const sunTimes = SunCalc.getTimes(
    new Date(),
    Config.get().latitude,
    Config.get().longitude
);
const getMinutes = () => Config.get().interval;
const getSeconds = () => Config.get().interval * 60;
const getMilliseconds = () => Config.get().interval * 1000 * 60;

const isDiurnal = () =>
    new Date() < sunTimes.sunset && new Date() > sunTimes.sunrise;

const isNoctural = () => !isDiurnal();

// @todo change to folders
const songFile = './songs/BOBO/BOBO1.mp3'; // @todo: make into songFolder ?

player.on('end', () =>
    nextAction(playNow, storage.getItemSync('runtime/nextPlay'))
);

const deferPlayback = () =>
    Promise.try(() =>
        nextAction(playNow, storage.getItemSync('runtime/nextPlay'))
    ).then(() =>
        console.log(
            'Cycle set to ' +
                Config.get().cycle +
                ', which does not match current time cycle. Not playing. Rescheduling next attempt in ' +
                getMinutes() +
                ' minutes.'
        )
    );

// disabled for development purposes
const verifyCycle = () =>
    true; /*Config.get().cycle === 'diurnal'
        ? isDiurnal()
        : isNoctural();*/

const attemptPlayback = () =>
    verifyCycle() ? player.play(songFile) : deferPlayback();

const playNow = () =>
    Promise.try(() =>
        storage.setItemSync('runtime/nextPlay', getMilliseconds())
    )
        .then(() =>
            console.log(
                'Scheduling next playback in ' +
                    getMinutes() +
                    ' minutes after this song is complete.'
            )
        )
        .then(attemptPlayback)
        .catch(console.error);

const schedulePause = () =>
    R.T(doPause()) &&
    nextAction(
        () => console.log('PAUSED, skipping... checking again in 5 seconds...'),
        mainLoopInterval
    );

const scheduleResume = () => hasPaused && R.T(unPause()) && playNow();

const checkPauseConfig = R.cond([
    [R.propEq('pause', true), schedulePause],
    [R.propEq('pause', false), scheduleResume]
]);

// setup a loop wherein we check to see if we've paused
const main = setInterval(
    () => checkPauseConfig(Config.get()),
    mainLoopInterval
);

// schedule the first playback
// note that this isn't immediate, as we don't know if the previous run had crashed
const init = () =>
    nextAction(
        playNow,
        storage.getItemSync('runtime/nextPlay') || getMilliseconds()
    );

init();

// start the service
server.listen(8813, () => {
    const instance = server.address();
    console.info(
        `Server instance started: ${instance.address} ${instance.port}`
    );
});
