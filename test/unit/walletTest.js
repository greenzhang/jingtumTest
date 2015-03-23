var assert = require("assert");
var api = require("supertest")("http://rztong.jingtum.com:5000");
var testutils = require('./testUtils');
var ripple = require("ripple-lib");
var http = require("http");
//账号接口
describe('wallet', function () {
    //创建一个新账户
    describe('wallet new', function () {
        it('::should create a new wallet account!', function (done) {
            api
                .get('/v1/wallet/new')
                .expect(200)
                .expect(testutils.checkHeaders)
                .expect(function (res, err) {
                    assert.ifError(err);
                    assert.strictEqual(res.body.success, true);
                    assert.strictEqual(typeof res.body.wallet, 'object');
                    assert(ripple.UInt160.is_valid(res.body.wallet.address), '这不是一个合法的井通地址');
                    assert(ripple.Seed.from_json(res.body.wallet.secret).get_key(res.body.wallet.address), '私钥不合法');
                })
                .end(function (err, res) {
                    done(err);
                })
        })
    });
    describe('wallet balance',function(){
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
        it('::should have 50 swt',function(done){
            api
                .get('/v1/accounts/'+wallet.address+'/balances')
                .expect(200)
                .expect(testutils.checkHeaders)
                .expect(function(res,err){
                    assert.strictEqual(res.body.success,true);
                    assert.strictEqual(res.body.balances.length,1);
                    testutils.checkBalance(res,'SWT','50');
                })
                .end(done);
        });
        it('::should have 200 cny',function(done){
            api
                .get('/v1/accounts/jaLywjTWxTBruEvDoZ5uZBDm6BWf1otRV9/balances')
                .expect(200)
                .expect(testutils.checkHeaders)
                .expect(function(res,err){
                    assert.strictEqual(res.body.success,true);
                    assert.strictEqual(res.body.balances.length,2);
                    testutils.checkBalance(res,'CNY','200');
                })
                .end(done);
        })
    });
    after(function(done){
        done();
    })
});
