const SunCalc = require('suncalc');
const player = require('./lib/player');

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

const songFile = './songs/EAME.mp3';
const cycle = process.env.CYCLE || 'diurnal';
const between = process.env.BREAKS || 3 * 60 * 1000; // 3 mins
const sort = process.env.ORDER || 'random';
const pause = process.env.PAUSE || false;

console.log('is diurnal', isDiurnal());
console.log('is nocturnal', isNoctural());

player.add(songFile);

player.play();
