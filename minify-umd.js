var fs = require("fs");
var UglifyJS = require("uglify-js");
var util = require("util");
var packageJson = require("./package.json");

var distInFile = "./dist/typescript-collections.js";
var distOutFileVersioned = util.format("./temp/typescript-collections.%s.min.js", packageJson.version);
var distOutFileUnversioned = "./dist/typescript-collections.min.js";

var result = UglifyJS.minify(distInFile, { mangle: false });
fs.writeFileSync(distOutFileVersioned, result.code, { encoding: "utf-8" });
fs.writeFileSync(distOutFileUnversioned, result.code, { encoding: "utf-8" });
