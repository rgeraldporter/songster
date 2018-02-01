const mpg321 = require('mpg321');
const player = mpg321().remote();

player.on('start', () => console.log('Playing...'));
player.on('end', () => console.log('Completed'));
process.on('SIGINT', () => process.exit());

module.exports = player;
