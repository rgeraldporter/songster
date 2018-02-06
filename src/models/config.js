const storage = require('node-persist');
const R = require('ramda');
const store = storage.create({
    dir: './.node-persist/' + (process.env.NODE_ENV || 'production')
});

store.initSync();

const logChanges = R.pipe(
    R.tap(() => console.log('Config changes: ')),
    R.tap(console.log)
);

const get = () => store.getItemSync('config');
const setStore = values => store.setItemSync('config', values);
const mergeIn = values => Object.assign(get() || {}, values);

const put = R.pipe(mergeIn, logChanges, setStore);

module.exports = { get, put };
