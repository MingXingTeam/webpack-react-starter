var path = require("path");
var webpack = require("webpack");
module.exports = {
	entry: {
		pageA: './pageA',
		pageB: './pageB'
	},
	output: {
		path: path.join(__dirname,"js"),
		filename: "[name].bundle.js",
		chunkFilename: "[id].chunk.js"
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin("commons.js")
	]
}