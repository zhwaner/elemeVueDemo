var express = require('express');
var config = require('./config/index');

var port = 9090;

var app = express();

var router = express.Router();

router.get('/', function(req, res, next) {
	req.url = '/index.html';
	next();
});

app.use(router);

var appData = require('./data.json');//引入数据文件
var seller = appData.seller;
var goods = appData.goods;
var ratings = appData.ratings;

var apiRoutes = express.Router();//用express router编写接口请求

apiRoutes.get('/seller', function(req, res) {
  res.json({
    errno: 0,
    data: seller
  });
});

apiRoutes.get('/goods', function(req, res) {
  res.json({
    errno: 0,
    data: goods
  });
});

apiRoutes.get('/ratings', function(req, res) {
  res.json({
    errno: 0,
    data: ratings
  });
});

app.use('/api', apiRoutes);//通过/api/goods访问

app.use(express.static('./dist'));

module.export = app.listen(port, function(err) {
	if(err) {
		console.log(err)
		return
	}
	console.log('Listeninbg at http://localhost:' + port + '\n')
})