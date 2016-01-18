'use strict';

//temp: windows环境不支持NODE_ENV变量
process.env.NODE_ENV = 'development';
// process.env.NODE_ENV = 'production';

var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var AssetsPlugin = require('assets-webpack-plugin');
var StatsPlugin = require('stats-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var jsxLoaders = ['babel'];
var cssLoader;
var sassLoader;

//@see https://github.com/webpack/webpack-dev-server/issues/326
//必须改为8080 当用npm run webpack-dev-server(node server.js默认是3000端口)启动的时候
//否则控制台报错 [WS] Disconnected, net::ERR_CONNECTION_REFUSED
var port = process.env.PORT || 8080;
var devtool;
var output;
var plugins = [
  //@see https://github.com/webpack/webpack/issues/292#issuecomment-44804366
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
  ];
var entry = {
    'entryA': './src/scripts/entryA.js',
    'entryB': './src/scripts/entryB.js',
    'entryC': './src/scripts/entryC.js'
    // ,
    // 'hello': './src/scripts/components/hello.jsx'
}

if (process.env.NODE_ENV === 'development') {//开发配置
  //在Developer Tools的Setting设置中，确认选中"Enable source maps"。
  //作用是：脚本报错时直接反应原始代码行数而非JS被压缩后的行数
  //@see: 
  //http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/
  //https://github.com/webpack/webpack/issues/168
  //http://webpack.github.io/docs/configuration.html#devtool
  devtool ='source-map';
  jsxLoaders = ['react-hot'].concat(jsxLoaders);
  //模块里的样式通过JS内嵌在元素里面（header中没有link标签）
  cssLoader = 'style!css';
  sassLoader = 'style!css!sass';
  output = {
    //webpack打包后bundle所在的目录
    path: path.join(__dirname,"/build"),
     //打包成的文件名：name是entry里面的key
    filename: '[id]_[name]_[hash:8].js',
    //打包后的chunk名字：id是chunk的id
    chunkFilename: '[id]_[hash:8].chunk.js',
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
  //webpack会自动把模块里的样式放到header的link中
  var cssLoader = ExtractTextPlugin.extract('style', 'css?minimize'); // enable minimize
  var sassLoader = ExtractTextPlugin.extract('style!css?minimize!sass');
  output = {
    //webpack打包后bundle所在的目录
    path: path.join(__dirname,"/assets"),
     //打包成的文件名：name是entry里面的key
    filename: 'scripts/[id]_[name]_[hash:8].min.js',
    //打包后的chunk名字：id是chunk的id
    chunkFilename: 'scripts/[id]_[hash:8].chunk.min.js',
    // hotUpdateChunkFilename: 'hot.[id]_[hash].bundle.js',
    // 不需要
    publicPath: ''
  }
  plugins = plugins.concat([
    //优化chunck的ID长度
    new webpack.optimize.OccurenceOrderPlugin(),
    // new webpack.optimize.CommonsChunkPlugin({
    //     name: 'vendors',
    //     chunks: ['entryA','entryB','entryC'],
    //     // Modules must be shared between all entries
    //     // 提取所有chunks共同依赖的模块
    //     minChunks: 3 
    // }),
    // new webpack.optimize.CommonsChunkPlugin({
    //     name: 'vendors2',
    //     chunks: ['entryA','entryB'],
    //     minChunks: 2
    // }),
    //最小化JS
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
    //styles/[id]_[name]_[hash:8].min.css 这个是提取后的CSS文件相对
    //（相对output的publicPath）路径
    new ExtractTextPlugin('styles/[id]_[name]_[hash:8].min.css', {
                // 当allChunks指定为false时，css loader必须指定怎么处理
                // additional chunk所依赖的css，即指定`ExtractTextPlugin.extract()`
                // 第一个参数`notExtractLoader`，一般是使用style-loader
                // @see https://github.com/webpack/extract-text-webpack-plugin
                allChunks: false
            })
  ]);
}

// 自动生成入口文件，入口js名必须和入口文件名相同
// 例如，a页的入口文件是a.html，那么在js目录下必须有一个a.js作为入口文件

var pages = fs.readdirSync("src/views/");

pages.forEach(function(filename) {
    var m = filename.match(/(.+)\.html$/);

    if(m) {
        // @see https://github.com/kangax/html-minifier
        var conf = {
            template: path.resolve("src/views/", filename),
            // @see https://github.com/kangax/html-minifier
            // minify: {
            //     collapseWhitespace: true,
            //     removeComments: true
            // },
            filename: filename
        };
        
        if(m[1] in entry) {
            conf.inject = 'body';
            conf.chunks = ['vendors', m[1]];
        }

        plugins.push(new HtmlWebpackPlugin(conf));
    }
});

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
        exclude: /assets|build|lib|bower_components|node_modules/,
        loaders: jsxLoaders
      },{
          test: /\.css$/,
          //提取JS里面的样式到chunk并且压缩
          loader: cssLoader
      },
      {
        test: /\.scss$/,
        //提取JS里面的样式到chunk并且压缩
        loaders: sassLoader
      },
      {
          test: /\.(jpe?g|png|gif|svg)$/i,
          //image-loader:压缩图片
          //url-loader:会把样式中的图片或字体的名字改为hash并且拷贝的ouput的path路径下
          //@see https://github.com/tcoopman/image-webpack-loader
          loaders: [
              'image?{bypassOnDebug: true, progressive:true, \
                  optimizationLevel: 3, pngquant:{quality: "65-80", speed: 4}}',
              // url-loader更好用，小于10KB的图片会自动转成dataUrl，
              // 否则则调用file-loader，参数直接传入
              'url?limit=10000&name=images/[hash:8].[name].[ext]',
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
    // preLoaders: [
    //   {test: /\.jsx?$/, loader: 'eslint', exclude: /build|lib|bower_components|node_modules/},
    // ],
    //With noParse you can exclude big libraries from parsing, but this can break stuff.
    //@see https://webpack.github.io/docs/build-performance.html
    noParse: [
      path.join(__dirname, 'node_modules', 'babel-core', 'browser.min.js')
    ],
  },
  //require的时候可以不带后缀
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: plugins,
  devtool: devtool
}
