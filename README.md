# webpack-react-starter
 
## please open an issue if you have any problems!! 

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






