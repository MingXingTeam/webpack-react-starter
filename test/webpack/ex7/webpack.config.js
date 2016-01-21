var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    entry: {
        A: "./a",
        B: "./b",
        C: "./c",
    },
    output: {
        path: path.join(__dirname, "js"),
        filename: "[name].js"
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            { test: /\.png$/, loader: "file-loader" }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin("commons", "commons.js", ["A", "B"]),
        new ExtractTextPlugin("[name].css"),
    ]
};