/**
 * Created by greenzhang on 15-3-24.
 */
var assert = require("assert");
var api = require("supertest")("http://rztong.jingtum.com:5000");
var testutils = require('./testUtils');
var ripple = require("ripple-lib");
var http = require("http");
describe('server test', function () {
    it('::should get server ', function (done) {
        api
            .get('/v1/server')
            .expect(200)
            .expect(testutils.checkHeaders)
            .expect(function(res,err){
                var checkkey = testutils.checkObjKeys(res.body, ['success', 'api_documentation_url', 'rippled_server_url', 'rippled_server_status']);
                assert.deepEqual(checkkey, {
                    "hasAllKeys": true,
                    "missingKeys": {}
                });
            })
            .end(done);
    });
    it('::should get server ok', function (done) {
        api
            .get('/v1/server/connected')
            .expect(200)
            .expect(testutils.checkHeaders)
            .expect(function (res, err) {
                assert.strictEqual(res.body.success,true);
                assert.strictEqual(res.body.connected,true);
            })
            .end(done);
    });
});