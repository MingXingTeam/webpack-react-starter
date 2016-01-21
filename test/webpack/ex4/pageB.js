var common = require("./common");
require.ensure(["./shared"], function(require) {
    var shared = require("./shared");//载入两次？
    shared("This is page B");
});