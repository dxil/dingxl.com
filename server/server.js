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
  var url = req.query.url
  console.log(url)
  req.pipe(http.get(`${url}`, function(response) {
    response.setEncoding('utf8');
    response.pipe(res)
  }))
})

app.get('/api/storys/detail', function (req, res) {
  var url = req.query.url
  req.pipe(http.get(`${url}`, function(response) {
    response.setEncoding('utf8');
    response.pipe(res)
  }))
});
app.get('/api/storys/search', function (req, res) {
  var query = req.query.q
  req.pipe(http.get(`http://zhannei.baidu.com/cse/search?q=${encodeURIComponent(query)}&click=1&s=5541116575338011306&nsid=`, function(response) {
    response.setEncoding('utf8');
    response.pipe(res)
  }))
})

app.listen(3000, function () {
  console.log('server listening at port 3000')
})
