const Promise = require('bluebird');
const execPromise = Promise.promisify( require('child_process').exec );
const {liftAN, Success, Failure} = require('syfmto');

// hey we can't go setting the system time on anything that is testing this
// so um, what do we do?
const setTime = time => execPromise('date -s "${time}"')
    .then(error => error
        ? Failure([error])
        : Success(true)
    )
    .catch(error => Failure([error]));

const getTime = () => new Date();

const get = () =>
    getTime();

const put = val =>
   setTime(val);
   // todo: fold & catch

module.exports = {get, put};
