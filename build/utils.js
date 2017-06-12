var path = require('path')
var config = require('../config')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',//生产环境下压缩文件
      sourceMap: options.sourceMap//根据参数是否生成sourceMap文件
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    var loaders = [cssLoader]// 默认是css-loader
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {//将loaderOptions和sourceMap组成一个对象
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({//ExtractTextPlugin分离js中引入的css文件
        use: loaders,
        fallback: 'vue-style-loader'//没有被提取分离时使用的loader
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return { //返回css类型对应的loader组成的对象 generateLoaders()来生成loader
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  var output = []//定义返回的数组，数组中保存的是针对各类型的样式文件的处理方式
  var loaders = exports.cssLoaders(options)// 调用cssLoaders方法返回各类型的样式对象(css: loader)
  for (var extension in loaders) { //循环遍历loaders
    var loader = loaders[extension] //根据遍历获得的key(extension)来得到value(loader)
    output.push({ // 处理的文件类型
      test: new RegExp('\\.' + extension + '$'),//用loader来处理，loader来自loaders[extension]
      use: loader
    })
  }
  return output
}
