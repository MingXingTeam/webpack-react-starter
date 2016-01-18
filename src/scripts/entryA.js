// var $ = require("jquery");
var commonAB = require("./modules/common-a-b");
var commonABC = require("./modules/common-a-b-c");
var moduleA = require("./modules/moduleA");
// do some thing 
let a = 12;
(a) => {
	console.info("es6")
}
console.info(commonAB);
console.info(commonABC);
console.info("Hello This is imported success!");

console.info("ccc")
