module.exports = {
    entry: {
        ex: "./ex.js"
    },
    output: {
        path:__dirname+"/js",
        filename: "MyLibrary.[name].js",
        library: ["MyLibrary", "[name]"],
        libraryTarget: "umd"
    },
    externals: [
        "add",   
        {
            "subtract": {
                root: "subtract",
                commonjs2: "./subtract",
                commonjs: ["./math", "subtract"],
                amd: "subtract"
            }
        }
    ]
}