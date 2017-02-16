const configModelMock = { get: () => ({ data: 1 }), put: () => true };

const proxyquire = require('proxyquire');
const configController = proxyquire('./config', { '../../models/config': configModelMock });
const controller = configController(() => null);

describe('The config endpoint', () => {
    it('should be able to get the configuration', done => {
        const request = {};
        const response = { send: () => null };
        const next = () => null;

        spyOn(response, 'send').and.callThrough();

        controller.getConfig(request, response, next).then(() => {
            expect(response.send).toHaveBeenCalledWith(200, { data: 1 });
            done();
        });
    });

    it('should be able to put to the configuration', done => {
        const request = { body: '{ "data": 101 }' };
        const response = { send: () => null };
        const next = () => null;

        spyOn(configModelMock, 'put').and.callThrough();

        controller.putConfig(request, response, next).then(() => {
            expect(configModelMock.put).toHaveBeenCalledWith({ data: 101 });
            done();
        });
    });
});