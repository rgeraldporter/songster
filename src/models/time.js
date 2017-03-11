const Promise = require('bluebird');
const execPromise = Promise.promisify( require('child_process').exec );
const {liftAN, Success, Failure} = require('syfmto');

// hey we can't go setting the system time on anything that is testing this
// so um, what do we do?
const setTime = time => execPromise('date -s "${time}"')
    .then(err => err
        ? Failure([err])
        : Success(true)
    )
    .catch(err => Failure([err]));

const getTime = () => new Date();

const get = () =>
    getTime();

const put = val =>
   setTime(val)
   .then(result =>
        result.fold(success => ({success}), failures => Promise.reject(failures))
    );

module.exports = {get, put};
