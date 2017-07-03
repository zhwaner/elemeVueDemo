require('./check-versions')() // 检查 Node 和 npm 版本

var config = require('../config') // 获取 config/index.js 的默认配置
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')//一个可以强制打开浏览器并跳转到指定 url 的插件
var path = require('path')  // 使用 NodeJS 自带的文件路径工具
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')//使用代理的中间件
var webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf') //使用哪个环境的 webpack 配置

// default port where dev server listens for incoming traffic
/* 如果没有指定运行端口，使用 config.dev.port 作为运行端口 */
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser//是否自动打开浏览器
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable //proxyTable 的代理配置，即http的代理url

var app = express()//使用express启动一个服务

var appData = require('../data.json');//引入数据文件
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

var compiler = webpack(webpackConfig)//启动 webpack 进行编译

//webpack-dev-middleware的作用
//1.将编译后的生成的静态文件放在内存中,所以在npm run dev后磁盘上不会生成文件
//2.当文件改变时,会自动编译。
//3.当在编译过程中请求某个资源时，webpack-dev-server不会让这个请求失败，而是会一直阻塞它，直到webpack编译完毕
var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})
//webpack-hot-middleware的作用就是实现浏览器的无刷新更新
var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})
// force page reload when html-webpack-plugin template changes
//声明hotMiddleware无刷新更新的时机:html-webpack-plugin 的template更改之后
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})
//将代理请求的配置应用到express服务上
// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
// 使用connect-history-api-fallback匹配资源
// 如果不匹配就可以重定向到指定地址
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
// 应用devMiddleware中间件，将暂存到内存中的 webpack 编译后的文件挂在到 express 服务上
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
// 将 Hot-reload 挂在到 express 服务上并且输出相关的状态、错误
app.use(hotMiddleware)

// serve pure static assets
// 配置express静态资源目录
// 拼接 static 文件夹的静态资源路径
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
// 为静态资源提供响应服务
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
//编译成功后打印uri
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)// 如果不是测试环境，自动打开浏览器并跳到我们的开发地址
  }
  _resolve()
})
//启动express服务
var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
