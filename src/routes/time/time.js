const restify = require('restify');
const Promise = require('bluebird');
const Time = require('../../models/time');
const {liftAN, Success, Failure} = require('syfmto');

const respondToClient = response => code => result => response.send(code, result);

const getTime = (request, response, next) =>
    Promise.try(() => Time.get())
        .then(respondToClient(response)(200))
        .catch(respondToClient(response)(500));

const putTime = (request, response, next) =>
    Promise.try(() => Time.put(request.body))
        .then(respondToClient(response)(201))
        .catch(respondToClient(response)(500));

module.exports = server => ({
    getTime,
    putTime
});
