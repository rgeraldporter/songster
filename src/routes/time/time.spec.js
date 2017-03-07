const timeModelMock = {get: () => 'Mon  6 Mar 2017 16:58:14 EST', put: () => true};

const proxyquire = require('proxyquire');
const timeController = proxyquire('./time', { '../../models/time': timeModelMock });
const controller = timeController(() => null);

describe('The time endpoint', () => {
    it('should be able to get the system time', done => {
        const request = {};
        const response = { send: () => null };
        const next = () => null;

        spyOn(response, 'send').and.callThrough();

        controller.getTime(request, response, next).then(() => {
            expect(response.send).toHaveBeenCalledWith(200, 'Mon  6 Mar 2017 16:58:14 EST');
            done();
        });
    });

    it('should be able to put to the system time', done => {
        const request = {
            body: { time: 'Mon  6 Mar 2017 20:50:24 EST' },
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const response = { send: () => null };
        const next = () => null;

        spyOn(timeModelMock, 'put').and.callThrough();

        controller.putTime(request, response, next).then(() => {
            expect(timeModelMock.put).toHaveBeenCalledWith({ time: 'Mon  6 Mar 2017 20:50:24 EST' });
            done();
        });
    });
});