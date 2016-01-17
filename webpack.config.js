'use strict';

var webpack = require('webpack');
var path = require('path');
var AssetsPlugin = require('assets-webpack-plugin');
var StatsPlugin = require('stats-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var jsxLoaders = ['babel'];

var port = process.env.PORT || 3000;
var devtool;
var output;
var plugins = [];
var entry = {
    'entryA': './src/scripts/entryA.js',
    'hello': './src/scripts/components/hello.jsx'
}

if (process.env.NODE_ENV === 'development') {//开发配置
  //在Developer Tools的Setting设置中，确认选中"Enable source maps"。
  //作用是：脚本报错时直接反应原始代码行数而非JS被压缩后的行数
  //@see: 
  //http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/
  devtool ='source-map';
  jsxLoaders = ['react-hot'].concat(jsxLoaders);
  output = {
    //webpack打包后bundle所在的目录
    path: path.join(__dirname,"/build"),
     //打包成的文件名：name是entry里面的key
    filename: '[name]-bundle-[hash].js',
    //打包后的chunk名字：id是chunk的id
    chunkFilename: '[id]_[hash].chunk.js',
    // hotUpdateChunkFilename: 'hot.[id]_[hash].bundle.js',
    //webpack-dev-server（也会打包成bundle并且会监听这个目录 但是bundle并不放到这个目录下是在内存中）
    //的目录
    publicPath: '/build'
  }

  plugins = plugins.concat([
    //模块重新打包后会自动注入到页面中（不用刷新页面）
    //@see https://webpack.github.io/docs/webpack-dev-server.html
    new webpack.HotModuleReplacementPlugin(),
    //相当于versionMap: path.join(__dirname, 'server/assets.json'),
    //查看hash之后的文件版本和原始文件的对应关系
    //@see https://www.npmjs.com/package/assets-webpack-plugin
    new AssetsPlugin(),
    //生成bundle相关的信息
    new StatsPlugin('stats.json', {
      //设置为true会包含chunk
      chunkModules: true,
      exclude: [/node_modules[\\\/]react/]
    })
  ]);
  entry = Object.keys(entry).reduce(function (result, key) {
    //每个entry都必须重新组装
    result[key] = [
      //修改文件的话（比如静态文件）自动刷新页面。
      //从浏览器控制台可以看到相关信息
      //是webpack-dev-server --inline命令
      'webpack-dev-server/client?http://0.0.0.0:' + port,
      //模块热加载
      'webpack/hot/only-dev-server',
      entry[key]
    ];
    return result;
  }, {});
} else {//生产配置
  devtool ='source-map';
  output = {
    //webpack打包后bundle所在的目录
    path: path.join(__dirname,"/assets"),
     //打包成的文件名：name是entry里面的key
    filename: 'scripts/[name]-bundle-[hash].min.js',
    //打包后的chunk名字：id是chunk的id
    chunkFilename: 'scripts/[id]_[hash].chunk.min.js',
    // hotUpdateChunkFilename: 'hot.[id]_[hash].bundle.js',
    // 不需要
    publicPath: ''
  }
  plugins = plugins.concat([
    //优化chunck的ID长度
    new webpack.optimize.OccurenceOrderPlugin(),
    //最小化JS
    new webpack.optimize.UglifyJsPlugin(),
    new ExtractTextPlugin('styles/[id]_[hash].[name].min.css', {
                // 当allChunks指定为false时，css loader必须指定怎么处理
                // additional chunk所依赖的css，即指定`ExtractTextPlugin.extract()`
                // 第一个参数`notExtractLoader`，一般是使用style-loader
                // @see https://github.com/webpack/extract-text-webpack-plugin
                allChunks: false
            })
  ]);
}


module.exports = {
  //webpack会打包这里面的JS文件
  //会将依赖的模块自动提取到bundle（按需加载的模块放到chunk）
  //包含了webpack运行时（意思就是可以提取或者管理其他依赖的模块）
  //（当有CommonsChunkPlugin时则将运行时移动到common.js）
  entry: entry,
  output: output,
  module: {
    //@see https://webpack.github.io/docs/list-of-loaders.html
    loaders: [{
        test: /\.jsx?$/,
        exclude: /build|lib|bower_components|node_modules/,
        loaders: jsxLoaders
      },{
          test: /\.css$/,
          //提取JS里面的样式到chunk并且压缩
          loader: ExtractTextPlugin.extract('style', 'css?minimize') // enable minimize
      },{
        test: /\.scss$/,
        //提取JS里面的样式到chunk并且压缩
        loaders: ExtractTextPlugin.extract('style!css?minimize!sass')
      },{
          test: /\.(jpe?g|png|gif|svg)$/i,
          //image-loader:压缩图片
          //url-loader:会把样式中的图片或字体的名字改为hash并且拷贝的ouput的path路径下
          loaders: [
              'image?{bypassOnDebug: true, progressive:true, \
                  optimizationLevel: 3, pngquant:{quality: "65-80", speed: 4}}',
              // url-loader更好用，小于10KB的图片会自动转成dataUrl，
              // 否则则调用file-loader，参数直接传入
              'url?limit=10000&name=img/[hash:8].[name].[ext]',
          ]
      },
      {
          test: /\.(woff|eot|ttf)$/i,
          loader: 'url?limit=10000&name=fonts/[hash:8].[name].[ext]'
      },
      {
        test: /\.(tpl|ejs)$/,
        //加载ejs模板
        loader: 'ejs'
      },
    ],
    //todo
    noParse: [
      path.join(__dirname, 'node_modules', 'babel-core', 'browser.min.js')
    ],
  },
  //todo
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: plugins,
  devtool: devtool
}
