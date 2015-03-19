var assert = require("assert");
var api = require("supertest")("http://rztong.jingtum.com:5000");
var testutils = require('./testUtils');
var ripple = require("ripple-lib");
var http = require("http");
//交易
describe('payment', function () {
    var uuid = "";
    before(function (done) {
        sendParams = {
            hostname: 'rztong.jingtum.com',
            port: 5000,
            path: '/v1/uuid',
            method: 'GET'
        };
        var req = http.request(sendParams, function (res) {
            res.on('data', function (chunk) {
                chunk = JSON.parse(chunk.toString('utf-8'));
                uuid = chunk.uuid;
                done();
            })
        });
        req.end();
    });
    describe('payment success', function () {
        it('::should send another one cny!', function (done) {
            var sender = {
                address: 'jf96oSdxU7kwfCHF2sjm9GmcvhFBcfN8Py', //zhang
                secret: 'snUaJxp2k4WFt5LCCtEx2zjThQhpT'
            };
            var receiver = "j4ciXnrgxMQJbNxgPwL41KCJy58FgzBNuF"; //bbbbb
            var issuer = "janxMdrWE2SUzTqRUtfycH4UGewMMeHa9f";
            var sendData = {
                secret: sender.secret, //支付方私钥
                client_resource_id: uuid,
                payment: {
                    source_account: sender.address,
                    destination_account: receiver,
                    destination_amount: {
                        value: "100",
                        currency: "CNY",
                        issuer: issuer
                    },
                    path: []
                }
            };
            api
                .post('/v1/accounts/' + sender.address + '/payments')
                .set('Content-Type', 'application/json') //set header for this test
                .send(JSON.stringify(sendData))
                .expect(200)
                .expect(function (res, err) {
                    assert.ifError(err);
                    assert.strictEqual(res.body.success, true);
                })
                .end(done)
        })
    });
});
