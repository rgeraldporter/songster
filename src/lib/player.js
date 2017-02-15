const StreamPlayer = require('stream-player');

const player = new StreamPlayer();

player.on('play start', args => {
    console.log('Playing...');
});

player.on('play end', () => {
    console.log('Completed');
});
 
player.on('song added', (file, meta) => {
    console.log('Queued up', file, meta);
});

module.exports = player;
