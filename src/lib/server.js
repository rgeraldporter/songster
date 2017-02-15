const restify = require('restify');
const configRoute = require('../routes/config/config');

const server = restify.createServer({name: 'Songster REST API'});
const configController = configRoute(server);

server.use(restify.bodyParser());

server.get({
    name: 'config-endpoint',
    path: '/config',
    version: '0.1.0'
}, configController.getConfig);

server.put({
    name: 'put-config-endpoint',
    path: '/config',
    version: '0.1.0'
}, configController.putConfig);

module.exports = server;
