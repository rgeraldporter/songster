const Promise = require('bluebird');
const R = require('ramda');
const SunCalc = require('suncalc');
const storage = require('node-persist');
const player = require('./lib/player');
const server = require('./lib/server.js');
const Config = require('./models/config.js');
const files = require('./lib/files');
const mainLoopInterval = 5000;
const moment = require('moment');

let currentTimeout, hasPaused;

storage.initSync();

const getDefaultConfig = () => ({
    latitude: 43.2258,
    longitude: -79.8711,
    cycle: 'diurnal',
    sort: 'random',
    directory: 'BOBO',
    interval: 0.2,
    pause: false
});

// in case this is the first run, populate with defaults
// also will populate in new configs as they are added
Config.put(Object.assign(getDefaultConfig(), Config.get()));

const doPause = () => (hasPaused = true);
const unPause = () => (hasPaused = false);
const isPaused = () => hasPaused;

const nextAction = (fn, time) => {
    console.log('next action', fn, time);
    clearTimeout(currentTimeout);
    currentTimeout = setTimeout(fn, time);
};

const getSunTimes = () => SunCalc.getTimes(
    moment(),
    Config.get().latitude,
    Config.get().longitude
);

const getMinutes = () => Config.get().interval;
const getSeconds = () => Config.get().interval * 60;
const getMilliseconds = () => Config.get().interval * 1000 * 60;
const getSongFile = () => files.getRandomFile(Config.get().directory);

const isDiurnal = () =>
    moment() < getSunTimes().sunset && moment() > getSunTimes().sunrise;
const isNoctural = () => R.complement(isDiurnal);

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

const verifyCycle = () =>
    Config.get().cycle === 'diurnal'
        ? isDiurnal()
        : isNoctural();

const attemptPlayback = () =>
    verifyCycle() ? player.play(getSongFile()) : deferPlayback();

const playNow = () =>
    Promise.try(() => {
        console.log('Playing', getSongFile());
        storage.setItemSync('runtime/nextPlay', getMilliseconds())
    })
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
