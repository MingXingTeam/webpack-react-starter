var a = require("./a");
var b = require("./b");
//c是按需加载的
require.ensure(["./c"], function(require) {
	//d是按需加载的
	//b会被优化 因为上面已经加载过一次了
    require("./b").xyz();
    var d = require("./d");
});