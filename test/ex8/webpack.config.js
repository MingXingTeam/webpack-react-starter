var path = require("path");
var webpack = require("webpack");
// var CommonsChunkPlugin = require("../../lib/optimize/CommonsChunkPlugin");
module.exports = {
    entry: {
        pageA: "./pageA",
        pageB: "./pageB",
        pageC: "./pageC",
        adminPageA: "./adminPageA",
        adminPageB: "./adminPageB",
        adminPageC: "./adminPageC",
    },
    output: {
        path: path.join(__dirname, "js"),
        filename: "[name].js"
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin("admin-commons.js", ["adminPageA", "adminPageB"]),
        new webpack.optimize.CommonsChunkPlugin("commons.js", ["pageA", "pageB", "admin-commons.js"], 2),
        new webpack.optimize.CommonsChunkPlugin("c-commons.js", ["pageC", "adminPageC"]),
    ]
}