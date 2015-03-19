var assert = require("assert");
var api = require("supertest")("http://rztong.jingtum.com:5000");
var testutils = require('./testUtils');
var ripple = require("ripple-lib");
//创建一个新账户
describe('wallet', function () {
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
});
