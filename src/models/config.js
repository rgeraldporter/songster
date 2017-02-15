const storage = require('node-persist');

storage.initSync();

const get = () =>
    storage.getItemSync('config');

const put = values =>
    storage.setItemSync('config', values);

module.exports = {get, put};
