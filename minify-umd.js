var fs = require("fs");
var UglifyJS = require("uglify-js");
var util = require("util");
var packageJson = require("./package.json");

var distInFile = "./dist/lib/umd.js";
var distOutFileUnversioned = "./dist/lib/umd.min.js";

var result = UglifyJS.minify(distInFile, { mangle: true });
fs.writeFileSync(distOutFileUnversioned, result.code, { encoding: "utf-8" });
