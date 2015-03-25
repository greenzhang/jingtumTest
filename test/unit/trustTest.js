var assert = require("assert");
var api = require("supertest");
var ripple = require("ripple-lib");
var http = require("http");
var qs = require('querystring');
var testutils = require('./testutils');
request = api("http://rztong.jingtum.com:5000");

//信任
describe('trust', function () {
    // body...
    var wallet = {}; //新用户钱包
    var sendParams = {};//http params
    var path = [];//支付路径
    var uuid = "";//UUID
    before(function (done) {
        //创建一个新账户
        sendParams = {
            hostname: 'rztong.jingtum.com',
            port: 5000,
            path: '/v1/wallet/new',
            method: 'GET'
        };
        var req = http.request(sendParams, function (res) {
            res.on('data', function (chunk) {
                chunk = JSON.parse(chunk.toString('utf-8'));
                wallet = chunk.wallet;
                callback()
            })
        });
        req.end();
        var callback = function () {
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
                    callback2(uuid);
                })
            });
            req.end();
        };
        var callback2 = function (uuid) { //提交支付
            sendParams = {
                hostname: 'rztong.jingtum.com',
                port: 5000,
                path: '/v1/accounts/jf96oSdxU7kwfCHF2sjm9GmcvhFBcfN8Py/payments',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                }
            };
            var sendData = {
                secret: 'snUaJxp2k4WFt5LCCtEx2zjThQhpT', //支付方私钥
                client_resource_id: uuid,
                payment: {
                    source_account: "jf96oSdxU7kwfCHF2sjm9GmcvhFBcfN8Py",
                    destination_account: wallet.address,
                    destination_amount: {
                        value: "50",
                        currency: "SWT",
                        issuer: ""
                    },
                    path: []
                }
            };
            var content = JSON.stringify(sendData);
            var req = http.request(sendParams, function (res) {
                res.on('data', function (chunk) {
                    chunk = JSON.parse(chunk.toString('utf-8'));
                    if (chunk.success === true) {
                        done();
                    }
                })
            });
            req.on('error', function (e) {
                console.log('problem with request: ' + e.message);
            });
            req.write(content);
            req.end();
        };
    });
    afterEach(function (done) {
        done();
    });
    describe('::trust currency', function () {
        it('::should return pendding', function (done) {
            // body...
            var data = {
                secret: wallet.secret,
                trustline: {
                    limit: 10000,
                    currency: "CNY",
                    counterparty: "janxMdrWE2SUzTqRUtfycH4UGewMMeHa9f",
                    account_allows_rippling: false
                }
            };
            request
                .post('/v1/accounts/' + wallet.address + '/trustlines')
                .send(data)
                .expect(201)
                .expect(function (res, err) {
                    assert.ifError(err);
                    assert.strictEqual(res.body.success, true);
                    assert.strictEqual(typeof res.body.trustline, 'object');
                    assert.strictEqual(res.body.state, 'pending');
                    assert(ripple.UInt256.is_valid(res.body.hash), '该次操作的交易号不合法');
                })
                .end(done)
        });
    });
    describe('::trust currency', function () {
        it('::should return pendding', function (done) {
            // body...
            var data = {
                secret: wallet.secret,
                trustline: {
                    limit: 10000,
                    currency: "800000000000000000000000F906A51E110BE7E7",//融资通名称：测试3
                    counterparty: "janxMdrWE2SUzTqRUtfycH4UGewMMeHa9f",
                    account_allows_rippling: false
                }
            };
            request
                .post('/v1/accounts/' + wallet.address + '/trustlines')
                .send(data)
                .expect(201)
                .expect(function (res, err) {
                    assert.ifError(err);
                    assert.strictEqual(res.body.success, true);
                    assert.strictEqual(typeof res.body.trustline, 'object');
                    assert.strictEqual(res.body.state, 'pending');
                    assert(ripple.UInt256.is_valid(res.body.hash), '该次操作的交易号不合法');
                })
                .end(done)
        });
        it('::should get trustLines', function (done) {
            request
                .get('/v1/accounts/' + wallet.address + '/trustlines')
                .expect(200)
                .expect(testutils.checkHeaders)
                .expect(function (res, err) {
                    assert.ifError(err);
                    testutils.checkTrust(res, 'CNY', '10000');
                    testutils.checkTrust(res, '800000000000000000000000F906A51E110BE7E7', '10000');
                })
                .end(done);
        });
    });
    //describe('should get total trustLines',function(){
    //    before(function(done){
    //        sendParams = {
    //            hostname: 'rztong.jingtum.com',
    //            port: 5000,
    //            path: '/v1/accounts/' + wallet.address + '/trustlines',
    //            method: 'POST'
    //        };
    //        var data = {
    //            secret: wallet.secret,
    //            trustline: {
    //                limit: 10000,
    //                currency: "USD",
    //                counterparty: "janxMdrWE2SUzTqRUtfycH4UGewMMeHa9f",
    //                account_allows_rippling: false
    //            }
    //        };
    //        var data1 = {
    //            secret: wallet.secret,
    //            trustline: {
    //                limit: 10000,
    //                currency: "800000000000000000000000F906A51E110BE7E7",//融资通名称：测试3
    //                counterparty: "janxMdrWE2SUzTqRUtfycH4UGewMMeHa9f",
    //                account_allows_rippling: false
    //            }
    //        };
    //        var req = http.request(sendParams, function (res) {
    //            res.on('data', function (chunk) {
    //                chunk = JSON.parse(chunk.toString('utf-8'));
    //                if (chunk.success === true) {
    //                    done()
    //                }
    //            })
    //        });
    //        req.on('error', function (e) {
    //            console.log('problem with request: ' + e.message);
    //        });
    //        req.write(JSON.stringify(data));
    //        req.end();
    //        //var callback = function(){
    //        //    var req = http.request(sendParams, function (res) {
    //        //        res.on('data', function (chunk) {
    //        //            chunk = JSON.parse(chunk.toString('utf-8'));
    //        //            if (chunk.success === true) {
    //        //                done()
    //        //            }
    //        //        })
    //        //    });
    //        //    req.on('error', function (e) {
    //        //        console.log('problem with request: ' + e.message);
    //        //    });
    //        //    req.write(JSON.stringify(data1));
    //        //    req.end();
    //        //}
    //    });
    //    it('::should get trustLines', function (done) {
    //        request
    //            .get('/v1/accounts/' + wallet.address + '/trustlines')
    //            .expect(200)
    //            .expect(testutils.checkHeaders)
    //            .expect(function (res, err) {
    //                assert.ifError(err);
    //                testutils.checkTrust(res, 'USD', '10000');
    //                testutils.checkTrust(res, 'CNY', '10000');
    //                //testutils.checkTrust(res, '800000000000000000000000F906A51E110BE7E7', '10000');
    //            })
    //            .end(done);
    //    });
    //
    //});

});