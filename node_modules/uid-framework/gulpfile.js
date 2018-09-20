const tasks = require("./configs/gulp/tasks.js"),
	  gulp = require("gulp");
var config = require("./configs/gulp/config.js");

//Override any config changes here before being passed to tasks

config.jshint = ".jshintrc";
config.sassLint = ".sasslintrc";
config.htmlLint = ".htmllintrc";
config.svgs.src = [`${config.UID}/svg/plus.svg`];

tasks.setConfig(config, gulp);

tasks.svg();
tasks.html();
tasks.js();
tasks.css();
tasks.images();
tasks.clean();
tasks.dev();
tasks.build();
tasks.watch();
tasks.browserSync();
tasks.testServer();
tasks.docs();