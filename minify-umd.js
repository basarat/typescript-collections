var fs = require("fs");
var UglifyJS = require("uglify-js");
var util = require("util");
var packageJson = require("./package.json");

var inputFilePath = "./dist/lib/umd.js";
var outputFilePath = "./dist/lib/umd.min.js";

var code = fs.readFileSync(inputFilePath, { encoding: "utf-8" });
var result = UglifyJS.minify(code);
if (result.error) {
    console.log('Error during minification: ');
    console.log(result)
    throw result.error;
}
fs.writeFileSync(outputFilePath, result.code, { encoding: "utf-8" });
