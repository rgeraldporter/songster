const hippie = require('hippie');
const assert = require('assert');
const server = require('../../src/lib/server');

hippie.assert.showDiff = true;

describe('Songster server', () => {
    describe('PUT /config endpoint', () => {
        it('puts in the config', done => {
            return hippie(server)
                .put('/config')
                .json()
                .send({value: "something"})
                .expectStatus(201)
                .end(function(err, res, body) {
                    if (err) throw err;
                    done();
                });
        });
    });
    describe('GET /config endpoint', () => {
        it('returns a config when requested', done => {
            return hippie(server)
                .get('/config')
                .expectStatus(200)
                .expectBody('{"value":"something"}')
                .end(function(err, res, body) {
                    if (err) throw err;
                    done();
                });
        });
    });
});