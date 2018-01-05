var http = require('http');
exports.getChapters = function (req, success) {
  var bid = req.query.bid
  var reqs = http.get(`http://api.zhuishushenqi.com/mix-atoc/${bid}?view=chapters`, function(response) {
    response.setEncoding('utf8');
    response.on('data', function (data) {
      var data = JSON.stringify(data)
      success(response, data)
    });
  });
  reqs.on('error', function (e) {
    console.log('problem with request: ' + e.message);
  });
}