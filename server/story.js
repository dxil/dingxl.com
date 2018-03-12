var http = require('http');
exports.getChapters = function (req, success) {
  var bid = req.query.bid
  var reqs = http.get(`http://api.zhuishushenqi.com/mix-atoc/${bid}?view=chapters`, function(response) {
    response.setEncoding('utf8');
    response.setCharacterEncoding("UTF-8");//设置响应编码
    response.setHeader("Content-Type","text/html;charset=UTF-8");//通知浏览器如何解码
    response.on('data', function (data) {
      var data = JSON.stringify(data)
      success(response, data)
    });
  });
  reqs.on('error', function (e) {
    console.log('problem with request: ' + e.message);
  });
}