var assert = require("assert");
var api = require("supertest")("http://localhost:5990")
var testutils = require('./testUtils');
var ripple = require("ripple-lib");
//信任
describe('trust currency', function() {
    // body...
    console.log('123');
    var wallet = {};
    before(function() {
        //创建一个新账户
        api
            .get('/vi/wallet/new', function(req, res) {
                wallet = req.body.wallet;
            })
    })
    it('::should trust a new currency', function() {
        // body...
        var data = {
            "secret": wallet.secret,
            "trustline": {
                "limit": 10000,
                "currency": "GGG",
                "counterparty": "janxMdrWE2SUzTqRUtfycH4UGewMMeHa9f",
                "account_allows_rippling": false
            }
        }
        api
            .post('/v1/accounts/' + wallet.account + '/trustlines?validated=true')
            .send(data)
            .expect(200)
            .expect(function(res, err) {
                console.log('123');
                console.log(JSON.stringify(res.body))
                assert.ifError(err);
                assert.strictEqual(res.body.success, true);
                assert.strictEqual(typeof res.body.trustline, 'object');
                assert.strictEqual(res.body.pending, 'pending');
                assert(ripple.UInt256.is_valid(res.body.hash), '该次操作的交易号不合法')
                done();
            })
    });
    it('should truly trust new currency', function() {
        // this.timeout(10000); //给信任时间
        // api
        //     .get('/v1/accounts/' + wallet.account + '/trustlines')
        //     .expect(200)
        //     .expect(testutils.checkHeaders)
        //     .expect(function(res, err) {

        //     })
    })
})