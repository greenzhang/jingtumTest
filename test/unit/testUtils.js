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
    for (var i = 0; i < res.body.trustlines.length; i++) {
        if (currency === res.body.trustlines[i].currency
            && amount === res.body.trustlines[i].limit) {
            a++;
        }
    }
    assert.strictEqual(a, 1);
}
//检查余额
function checkBalance(res, currency, amount) {
    for (var i = 0; i < res.body.balances.length; i++) {
        if (currency === res.body.balances[i].currency) {
            assert.strictEqual(res.body.balances[i].value, amount)
        }
    }
}
//检查对象是否有keys
function checkObjKeys(obj, keys) {
    var list = Object.keys(obj),
        hasAllKeys = true,
        missingKeys = {};
    keys.forEach(function (key) {
        if (list.indexOf(key) === -1) {
            hasAllKeys = false;
            missingKeys[key] = true
        }
    });
    return {hasAllKeys: hasAllKeys, missingKeys: missingKeys}
}

module.exports = {
    checkHeaders: checkHeaders,
    checkTrust: checkTrust,
    checkBalance: checkBalance,
    checkObjKeys: checkObjKeys
};
