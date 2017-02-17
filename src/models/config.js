const storage = require('node-persist');
const store = storage.create({ dir: './.node-persist/' + (process.env.NODE_ENV || 'production') });

store.initSync();

const get = () =>
    store.getItemSync('config');

const put = values =>
    store.setItemSync('config', values);

module.exports = {get, put};
