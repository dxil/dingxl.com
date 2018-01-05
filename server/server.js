var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var http = require('http');
var proxy = require('express-http-proxy');

params={};
params['is_allow_preference']=1;
params['post_fee']="0";
params['price_change']="0.02";

app.use(bodyParser.json({ type: 'application/json' }));

app.get('/api/storys/chapters', function (req, res) {
  var bid = req.query.bid
  req.pipe(http.get(`http://api.zhuishushenqi.com/mix-atoc/${bid}?view=chapters`, function(response) {
    response.pipe(res)
  }))
})

app.get('/api/storys/detail', function (req, res) {
  var link = encodeURIComponent(req.query.link)
  req.pipe(http.get(`http://chapter2.zhuishushenqi.com/chapter/${link}?k=2124b73d7e2e1945&t=1468223717`, function(response) {
    response.pipe(res)
  }))
})

app.listen(3000, function () {
  console.log('server listening at port 3000')
})
