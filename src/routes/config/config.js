const storage = require('node-persist');
const restify = require('restify');
const Config = require('../../models/config');
const Promise = require('bluebird');
const {liftAN, Success, Failure} = require('syfmto');

const successToClient = response => result => code =>
    response.send(code, result);

const getConfig = (request, response, next) =>
    successToClient(response)(Config.get())(200);

const putConfig = (request, response, next) =>
    successToClient(response)(Config.put(JSON.parse(request.body)))(201);

module.exports = server => ({
    getConfig,
    putConfig
});
