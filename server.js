'use strict';

//开发工具
process.env.NODE_ENV = 'development';

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var port = process.env.PORT || 3000;

new WebpackDevServer(webpack(config), {
  //监听目录：JS文件改变了后会重新编译打包 相当于webpack的--watch命令
  //打包后的bundle是在内存中的
  //假定publicPath是assets,则
  //浏览器可以直接访问打包后的bundle：localhost:8080/assets/bundle.js
  //要使用bundle.js必须在assets里面创建静态页面引用bundle。
  //然后浏览器可以直接访问这个静态页面
  publicPath: config.output.publicPath,
  //模块热加载HMR：是webpack-dev-server --hot命令
  //@see https://webpack.github.io/docs/webpack-dev-server.html
  hot: true,
  stats: {
    //控制台输出是否要打印chunk的信息
    chunkModules: false,
    //是webpack-dev-server --colors命令
    //控制台输出是否有颜色
    colors: true,
  }
}).listen(port, '0.0.0.0', function (err) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at 0.0.0.0:' + port);
});