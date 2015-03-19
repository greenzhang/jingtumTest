//检查http头信息
var assert = require("assert");
function checkHeaders(res) {
    assert.strictEqual(res.headers['content-type'], 'application/json; charset=utf-8');
    assert.strictEqual(res.headers['access-control-allow-origin'], '*');
    assert.strictEqual(res.headers['access-control-allow-headers'], 'X-Requested-With, Content-Type');
}
//检查是否信任
function checkTrust(res, currency, amount) {//返回值，比较货币，比较信任量
    var a = 0;
    console.log(res.body.trustlines);
    for (var i = 0; i < res.body.trustlines.length; i++) {
        if (currency === res.body.trustlines[i].currency
            && amount === res.body.trustlines[i].limit) {
            a++;
        }
    }
    assert.strictEqual(a, 1);
}
module.exports = {
    checkHeaders: checkHeaders,
    checkTrust: checkTrust
};
//var wallet = {}; //新用户钱包
//var sendParams = {};//http params
//var path = [];//支付路径
//var uuid = "";//UUID
//before(function (done) {
//    //创建一个新账户
//    sendParams = {
//        hostname: 'rztong.jingtum.com',
//        port: 5000,
//        path: '/v1/wallet/new',
//        method: 'GET'
//    };
//    var req = http.request(sendParams, function (res) {
//        res.on('data', function (chunk) {
//            chunk = JSON.parse(chunk.toString('utf-8'));
//            wallet = chunk.wallet;
//            callback()
//        })
//    });
//    req.end();
//    var callback = function () { //获得支付路径
//        sendParams = {
//            hostname: 'rztong.jingtum.com',
//            port: 5000,
//            path: '/v1/accounts/jf96oSdxU7kwfCHF2sjm9GmcvhFBcfN8Py/payments/paths/' + wallet.address + '/50+SWT',
//            method: 'GET'
//        };
//        var req = http.request(sendParams, function (res) {
//            res.on('data', function (chunk) {
//                chunk = JSON.parse(chunk.toString('utf-8'));
//                path = chunk.payments;
//                if (chunk.success === true) {
//                    callback2(path);
//                }
//            })
//        });
//        req.end();
//    };
//    var callback2 = function (path) {
//        sendParams = {
//            hostname: 'rztong.jingtum.com',
//            port: 5000,
//            path: '/v1/uuid',
//            method: 'GET'
//        };
//        var req = http.request(sendParams, function (res) {
//            res.on('data', function (chunk) {
//                chunk = JSON.parse(chunk.toString('utf-8'));
//                uuid = chunk.uuid;
//                callback3(uuid, path);
//            })
//        });
//        req.end();
//    };
    var callback3 = function (uuid, path) { //提交支付
        sendParams = {
            hostname: 'rztong.jingtum.com',
            port: 5000,
            path: '/v1/accounts/jf96oSdxU7kwfCHF2sjm9GmcvhFBcfN8Py/payments',
            method: 'POST'
        };
        var sendData = {
            secret: 'snUaJxp2k4WFt5LCCtEx2zjThQhpT', //支付方私钥
            client_resource_id: uuid,
            payment: path[0]
        };
        var content = qs.stringify(sendData);
        var req = http.request(sendParams, function (res) {
            res.on('data', function (chunk) {
                chunk = JSON.parse(chunk.toString('utf-8'));
                console.log(chunk.success);
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
//    //api
//    //    .get('/vi/wallet/new')
//    //    .expect(200)
//    //    .expect(function(res,err){
//    //        if(err) throw err;
//    //    })
//});