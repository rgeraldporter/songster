const storage = require('node-persist');
const restify = require('restify');
const Config = require('../../models/config');
const Promise = require('bluebird');
const { getDirectories } = require('../../lib/files');
const { liftAN, Success, Failure } = require('syfmto');

const configResponse = () => Object.assign({}, Config.get(), {folderNameOptions: getDirectories()});

const successToClient = response => result => code =>
    Promise.try(() => response.send(code, result));

const getConfig = (request, response, next) =>
    successToClient(response)(configResponse())(200);

const putConfig = (request, response, next) =>
    successToClient(response)(Config.put(request.body))(201);

module.exports = server => ({
    getConfig,
    putConfig
});
