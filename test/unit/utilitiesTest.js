/**
 * Created by greenzhang on 15-3-24.
 */
var assert = require("assert");
var api = require("supertest")("http://rztong.jingtum.com:5000");
var testutils = require('./testUtils');
var ripple = require("ripple-lib");
var http = require("http");
describe('utilities Test', function () {
    describe('Retrieve Jingtum Transaction ', function () {

        var uuid = "";
        var store = {};
        var sender = {
            address: 'jf96oSdxU7kwfCHF2sjm9GmcvhFBcfN8Py', //zhang
            secret: 'snUaJxp2k4WFt5LCCtEx2zjThQhpT'
        };
        var receiver = "j4ciXnrgxMQJbNxgPwL41KCJy58FgzBNuF"; //bbbbb
        var issuer = "janxMdrWE2SUzTqRUtfycH4UGewMMeHa9f";
        before(function (done) {
            var sendParams = {
                hostname: 'rztong.jingtum.com',
                port: 5000,
                path: '/v1/uuid',
                method: 'GET'
            };
            var req = http.request(sendParams, function (res) {
                res.on('data', function (chunk) {
                    chunk = JSON.parse(chunk.toString('utf-8'));
                    uuid = chunk.uuid;
                    callback();
                })
            });
            req.end();
            var callback = function () {
                var sendParams = {
                    hostname: 'rztong.jingtum.com',
                    port: 5000,
                    path: '/v1/accounts/' + sender.address + '/payments?validate=true',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    }
                };
                var data = {
                    secret: sender.secret, //支付方私钥
                    client_resource_id: uuid,
                    payment: {
                        source_account: sender.address,
                        destination_account: receiver,
                        destination_amount: {
                            value: "100.00",
                            currency: "SWT",
                            issuer: ""
                        },
                        path: []
                    }
                };
                var req = http.request(sendParams, function (res) {
                    res.on('data', function (chunk) {
                        chunk = JSON.parse(chunk.toString('utf-8'));
                        if (chunk.success === true) {
                            store.client_resource_ID = chunk.client_resource_id;
                            done();
                        }
                    })
                });
                req.on('error', function (e) {
                    console.log('problem with request: ' + e.message);
                });
                req.write(JSON.stringify(data));
                req.end();
            }
        });
        after(function (done) {
            done();
        });
        it('::should get Transaction', function (done) {
            api
                .get('/v1/transactions/' + store.client_resource_ID)
                .expect(200)
                .expect(function (res, err) {
                    assert.strictEqual(res.body.transaction.Account,sender.address);
                    assert.strictEqual(res.body.transaction.Amount,'100000000');
                    assert.strictEqual(typeof res.body, 'object');
                })
                .end(done)
        })
    });
    describe('uuid test', function () {
        it('::should be a right uuid',function(done){
            api
                .get('/v1/uuid')
                .expect(200)
                .expect(function (res, err) {
                    assert.ifError(err);
                    assert.strictEqual(res.body.success, true);
                    assert(/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/.test(res.body.uuid));
                })
                .end(done);
        }) ;
    });
    describe('transaction-fee',function(){
        it('::should return fee',function(done){
            api
                .get('/v1/transaction-fee')
                .expect(200)
                .expect(function (res, err) {
                    assert.strictEqual(res.body.success, true);
                    assert.strictEqual(res.body.fee,"0.000012");
                })
                .end(done);
        }) ;
    })
});