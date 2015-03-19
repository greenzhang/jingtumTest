//检查http头信息
function checkHeaders(res) {
  assert.strictEqual(res.headers['content-type'], 'application/json; charset=utf-8');
  assert.strictEqual(res.headers['access-control-allow-origin'], '*');
  assert.strictEqual(res.headers['access-control-allow-headers'], 'X-Requested-With, Content-Type');
};
module.exports = {
  checkHeaders:checkHeaders
}