var assert = require("assert");
var api = require("supertest")("http://rztong.jingtum.com:5000");
var testutils = require('./testUtils');
var ripple = require("ripple-lib");
var http = require("http");
//交易
describe('payment', function () {
    var uuid = "";
    var store = {};
    var sender = {
        address: 'jf96oSdxU7kwfCHF2sjm9GmcvhFBcfN8Py', //zhang
        secret: 'snUaJxp2k4WFt5LCCtEx2zjThQhpT'
    };
    var receiver = "j4ciXnrgxMQJbNxgPwL41KCJy58FgzBNuF"; //bbbbb
    var issuer = "janxMdrWE2SUzTqRUtfycH4UGewMMeHa9f";
    var body = {};
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
                done();
            })
        });
        req.end();
    });
    after(function (done) {
        done();
    });
    describe('Prepare Payment', function () {

        it('::should get a path', function (done) {
            api
                .get('/v1/accounts/' + sender.address + '/payments/paths/' + receiver + '/200.00+CNY+' + issuer)
                .expect(200)
                .expect(function (res, err) {
                    body = res.body.payments;
                    assert.deepEqual(res.body, {
                        "success": true,
                        "payments": [
                            {
                                "source_account": "jf96oSdxU7kwfCHF2sjm9GmcvhFBcfN8Py",
                                "source_tag": "",
                                "source_amount": {
                                    "value": "200",
                                    "currency": "CNY",
                                    "issuer": ""
                                },
                                "source_slippage": "0",
                                "destination_account": "j4ciXnrgxMQJbNxgPwL41KCJy58FgzBNuF",
                                "destination_tag": "",
                                "destination_amount": {
                                    "value": "200.00",
                                    "currency": "CNY",
                                    "issuer": "janxMdrWE2SUzTqRUtfycH4UGewMMeHa9f"
                                },
                                "invoice_id": "",
                                "paths": "[[{\"account\":\"janxMdrWE2SUzTqRUtfycH4UGewMMeHa9f\",\"type\":1,\"type_hex\":\"0000000000000001\"}]]",
                                "partial_payment": false,
                                "no_direct_ripple": false
                            }
                        ]
                    })
                })
                .end(done);
        });

    });
    describe('Payment success', function () {
        it('::should submit payment', function (done) {
            delete body[0].source_amount;
            var sendData = {
                secret: sender.secret, //支付方私钥
                client_resource_id: uuid,
                payment: body[0]
            };
            api
                .post('/v1/accounts/' + sender.address + '/payments')
                .set('Content-Type', 'application/json') //set header for this test
                .send(JSON.stringify(sendData))
                .expect(200)
                .expect(function (res, err) {
                    assert.ifError(err);
                    assert.deepEqual(res.body, {
                        success: true,
                        client_resource_id: uuid,
                        status_url: 'http://127.0.0.1:5990/v1/accounts/' + sender.address + '/payments/' + uuid
                    });
                    assert.strictEqual(res.body.success, true);
                    store.status_url = '/v1/accounts/' + sender.address + '/payments/' + uuid;
                })
                .end(done);
        });
    });
    describe('confirm payments', function () {
        it('::should confirm payments', function (done) {
            api
                .get(store.status_url)
                .expect(200)
                .expect(function (res, err) {
                    assert.strictEqual(res.body.success, true);
                    var checkkey = testutils.checkObjKeys(res.body, ['success', 'payment', 'client_resource_id', 'hash', 'ledger', 'state']);
                    assert.deepEqual(checkkey, {
                        "hasAllKeys": true,
                        "missingKeys": {}
                    });
                    store.hash = res.body.payment.hash;
                })
                .end(done);
        });
    });
    //describe('payment history',function(){
    //    it('::should have payment history',function(done){
    //        api
    //            .get('/v1/accounts/'+receiver+'/payments')
    //            .expect(200)
    //            //.expect(function(res,err){
    //            //    assert.strictEqual(res.body.payments,'object');
    //            //    res.body.payments[0].forEach(function(key){ //最近的一条记录
    //            //        if(key==='hash')
    //            //        assert.strictEqual(res.body.payments[key],store.hash)
    //            //    })
    //            //})
    //            .end(done);
    //    })
    //})
});
