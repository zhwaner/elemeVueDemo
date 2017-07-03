require('./check-versions')()

process.env.NODE_ENV = 'production'//设置当前环境为production

var ora = require('ora')//终端显示的转轮loading
var rm = require('rimraf')//node环境下rm -rf的命令库
var path = require('path')//文件路径处理库
var chalk = require('chalk')//终端显示带颜色的文字
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.prod.conf')//生产环境下的webpack配置

// 在终端显示ora库的loading效果
var spinner = ora('building for production...')
spinner.start()// 开始 loading 动画

// 删除已编译文件
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  //在删除完成的回调函数中开始编译
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()//停止loading
    if (err) throw err
    // 在编译完成的回调函数中,在终端输出编译的文件
    process.stdout.write(stats.toString({
      // 编译成功的回调函数
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(//  输出提示信息 ～ 提示用户请在 http 服务下查看本页面，否则为空白页
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
