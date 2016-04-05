"use strict;"

var browserify  = require("browserify");
var fs = require("fs");
var glob = require("glob");
var mkdirp = require("mkdirp");
var Umd = require("browserify-umdify");
var util = require("util");

mkdirp.sync("./temp");

var packageJson = require("./package.json");
var distOutFileVersioned = util.format("./temp/umd.%s.js", packageJson.version);
var distOutVersioned = fs.createWriteStream(distOutFileVersioned, { encoding: "utf-8", flags: "w"})
var distOutFileUnversioned = "./dist/umd.js";
var distOutUnversioned = fs.createWriteStream(distOutFileUnversioned, { encoding: "utf-8", flags: "w"})

var bundled = browserify({
		extensions: [".js", ".json"],
		debug: true
	})
	.require("./dist/lib/index.js", { expose: "typescript-collections" })
	.bundle()
	.pipe(new Umd());

bundled.pipe(distOutVersioned);
bundled.pipe(distOutUnversioned);


