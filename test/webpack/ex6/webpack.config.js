var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
	entry: "./ex.js",
	output: {
		path: path.join(__dirname,"js"),
		filename: "[name].bundle.js",
		chunkFilename: "[id].chunk.js"
	},
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("css-loader")
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("style.css")
    ]
};