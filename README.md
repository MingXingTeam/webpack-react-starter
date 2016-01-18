# webpack-react-starter

## 运行方法
>gulp dev 》开发模式
>npm start或者node-dev server.js 》启动服务器 访问localhost:8080/build/some.html（页面直接看src里面的view里面有哪些页面 不要到build里面找页面
build是虚拟目录）
>gulp release 》生产模式
（测试生产模式是否正常运行：http-server [assets目录]）

## todo

调试方法：source-map使用
angular
react
html自动刷新
webpack-assets.json 格式不对
stats.json 格式不对
console warn: a promise was created in a handler but none were returned from it
GET http://127.0.0.1:8080/scripts/entryB.js 

## temp info,please ignore! 
 file-loader
 plugins: [
    new StatsPlugin('stats.json', {
      chunkModules: true,
      exclude: [/node_modules[\\\/]react/]
    })
 ]

{
    output: {
        path: path.join(__dirname, "assets", "[hash]"),
        publicPath: "assets/",
        filename: "output.[hash].bundle.js",
        chunkFilename: "[id].[hash].bundle.js"
    }
}

https://www.npmjs.com/package/assets-webpack-plugin

var path = require('path');
var AssetsPlugin = require('assets-webpack-plugin');
var assetsPluginInstance = new AssetsPlugin();
 
module.exports = {
    // ... 
    output: {
        path: path.join(__dirname, "public", "js"),
        filename: "[name]-bundle-[hash].js",
        publicPath: "/js/"
    },
    // .... 
    plugins: [assetsPluginInstance]
};

@see http://stackoverflow.com/questions/33460420/babel-loader-jsx-syntaxerror-unexpected-token?answertab=votes#tab-top


## contribution
please feel free to pull request!
please open an issue if you have any problems!! 



