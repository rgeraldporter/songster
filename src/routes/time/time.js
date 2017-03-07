const restify = require('restify');
const Promise = require('bluebird');
const Time = require('../../models/time');
const {liftAN, Success, Failure} = require('syfmto');

const successToClient = response => result => code =>
    Promise.try(() => response.send(code, result));

const getTime= (request, response, next) =>
    successToClient(response)(Time.get())(200);

const putTime = (request, response, next) =>
    successToClient(response)(Time.put(request.body))(201);

module.exports = server => ({
    getTime,
    putTime
});


