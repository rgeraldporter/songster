const restify = require('restify');
const configRoute = require('../routes/config/config');

const server = restify.createServer({ name: 'Songster REST API' });
const configController = configRoute(server);

server.use(restify.CORS());

server.opts(/.*/, function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Methods',
        req.header('Access-Control-Request-Method')
    );
    res.header(
        'Access-Control-Allow-Headers',
        req.header('Access-Control-Request-Headers')
    );
    res.send(200);
    return next();
});

server.use(restify.bodyParser());

server.get(
    {
        name: 'config-endpoint',
        path: '/config',
        version: '0.1.0'
    },
    configController.getConfig
);

server.put(
    {
        name: 'put-config-endpoint',
        path: '/config',
        version: '0.1.0'
    },
    configController.putConfig
);

module.exports = server;
