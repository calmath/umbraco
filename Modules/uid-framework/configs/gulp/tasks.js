/**
 * @file Gulp tasks
 * @author Netcel
 */

const helpers = require("./helpers.js"),
	  browserSync = require("browser-sync"),
	  del = require("del"),
	  fs = require("fs"),
	  jsdoc = require("gulp-jsdoc3"),
	  sassdoc = require("sassdoc"),
	  //sys = require('sys'),
	  childProcess = require("child_process"),
	  exec = childProcess.exec,
	  execSync = childProcess.execSync,
	  allTasks = {};

var config = null,
	gulp = null,
	runSequence = null;

function createTask(taskName, arg1, arg2){
	if (!allTasks[taskName]) {
		gulp.task(taskName, arg1, arg2);
		console.log(`Creating task : ${taskName}`);
	}
}
function watchTask(watchId, watchTaskValue, watchTaskKey){
	createTask(watchId, function(cb){
		gulp.watch(
			watchTaskValue,
			[watchTaskKey]
		);
	});
}
function buildTask(task){
	createTask(`build:${task}`, function(cb){
		config.debug = false;
		runSequence(task, cb);
	});
}
function getCommandLine() {
   switch (process.platform) { 
      case "darwin" : return "open";
      case "win32" : return "start";
      case "win64" : return "start";
      default : return "xdg-open";
   }
}
function openSassDoc(){
	openDoc(config.docs.sass.options.dest);
}
function openJsDoc(){
	openDoc(config.docs.js.options.opts.destination);
}
function openDocs(){
	openJsDoc();
	openSassDoc();
}

function openDoc(str, count = 0){
	let filePath = `${str}/index.html`;
	if(fs.existsSync(filePath)){
		execSync(`${getCommandLine()} ${filePath}`);
	}else if(count < 5){
		count++;
		setTimeout(() => {
			openDoc(str, count);
		}, 500);
	}
}

/**
 * 
 * @module GulpTasks
 * @name GulpTasks
 * @description Common gulp tasks and sub tasks that can be reused in multiple projects.
 * Set up the tasks in your gulpfile.js to use by loading in the tasks and config js files
 * from the UID-framework. You can override individual gulp configs by setting the config
 * object before tasks.setConfig(config) is run. List all the gulp tasks you need to
 * run after the config has been set. See later in this documentation for information on
 * the what tasks can be setup. See the example gulpfile.js below.
 * @example 
 * const tasks = require("./configs/gulp/tasks.js"); //point to tasks.js and config.js
 * var config = require("./configs/gulp/config.js"); //in the UID-framework configs/gulp directory
 * 
 * //Override any config changes here before being passed to tasks
 * 
 * config.jshint = ".jshintrc";      //lint files must be supplied for
 * config.sassLint = ".sasslintrc";  //UID code to generate
 * config.htmlLint = ".htmllintrc";
 * 
 * tasks.setConfig(config);
 * 
 * tasks.js();					//setup js task
 * tasks.css();					//setup css task
 * tasks.dev();					//set up dev task
 * tasks.build("css", "js");          //set up build task and build:css build:js sub task
 *
 */
module.exports = {
	/**
	 * Passes the edited config object into scope
	 * @function
	 * @param {Object} _config - Configuration for gulp tasks
	 *
	 */
	setConfig : (_config, _gulp) => {
		config = _config;
		gulp = _gulp;
	  	runSequence = require("run-sequence").use(gulp);
		helpers.setEnvir(gulp, config);
	},
	/**
	 * Compiles nunjucks as html. Html needs to follow htmllint rules. See [htmllint]{@linkplain module:GulpConfig.htmlLint} for linting rules
	 * @function
	 * @uses 
	 * @example gulp html
	 *
	 */
	html : () => {
		createTask("html", function(){
			return helpers.generateHtml();
		});
	},
	/**
	 * Compiles javascript for the browser. If using react, the
	 * javascript is passed through browserify. You'll need to
	 * set at least one entry in the config.entry variable to
	 * trigger the gulp browserify and not the default javasript. See [jsHint]{@linkplain module:GulpConfig.jshint} for linting rules
	 * @function
	 * @example gulp js
	 *
	 */
	"js" : () => {
		createTask("js", function(cb){
			return helpers.generateJS(cb);
		});
	},
	/**
	 * Compiles css from sass. Sass is linted so this task will
	 * fail if the sasslint rules aren't followed. See [sasslint]{@linkplain module:GulpConfig.sassLint} for linting rules
	 * @function
	 * @example gulp css
	 *
	 */
	"css" : () => {
		createTask("css", function(cb){
			return helpers.generateCSS();
		});
	},
	/**
	 * Compiles svgs into a single svg file with symbols that can be included
	 * as markup in the page. The symbols can be reused throughout the page
	 * and styled using css.
	 * @function
	 * @example gulp css
	 *
	 */
	"svg" : () => {
		createTask("svg", function(cb){
			return helpers.generateSVG();
		});
	},
	/**
	 * Compiles jpg, gif and png images. The develop version will
	 * just copy the images, whilst the build will apply compression
	 * to the files to reduce weights.
	 * @function
	 * @example gulp images
	 *
	 */
	"images" : () => {
		createTask("images", function(cb){
			if(config.debug){
				var imagesCopy = {
					[config.paths.imagesSrc + "**/*.*"] : config.paths.imagesOut
				};
				return helpers.copy(imagesCopy, cb);
			}else{
				return helpers.minifyImages();
			}
		});
	},
	/**
	 * Starts a local server serving content from the build directory. If
	 * gulp dev or gulp build hasn't already been run, then an error will
	 * return in the browser. Edited files will not be updated if this
	 * task it run on it's own. This should be used to preview the last
	 * successful compile only.
	 * @function
	 * @example gulp browserSync
	 *
	 */
	browserSync : () =>
	{
		createTask("browserSync", function(cb){
			config.isBrowserSync = true;
			var browserSyncRef =  browserSync(config.browserSync.options);
			helpers.setBrowsersync(browserSyncRef);
    		return browserSyncRef;
		});
	},
	/**
	 * Compiles development versions of files to the build directory each
	 * time you make a change to the source. Sass, html and js are all
	 * linted and won't compile if lint rules aren't followed. See [sasslint]{@linkplain module:GulpConfig.sassLint},
	 * [htmllint]{@linkplain module:GulpConfig.htmlLint} and [jsHint]{@linkplain module:GulpConfig.jshint} for linting rules
	 * @function
	 * @example gulp watch 				//all source files
	 * @example gulp watch:html 		//html/nunjucks files only
	 * @example gulp watch:js 			//js/jsx files only
	 * @example gulp watch:css			//scss files only
	 * @example gulp watch:images		//copies files from the images src directory
	 * @example gulp watch:svg			//Compiles multiple svgs into single svg file for iniling in pages
	 * @example gulp watch:docs			//Updates documentation
	 * @example gulp watch:docs:js		//Updates javscript documentation
	 * @example gulp watch:docs:sass	//Updates sass documentation
	 *
	 */
	"watch" : () => {
		
		let watchTasks = {
			html : [
				config.paths.templatesSrc + "**/*.+(html|nunjucks)",
				config.nunjucks.options.configFile
			],
			js : config.paths.jsSrc + "/**/*.{js,jsx}",
			css : config.paths.sassSrc + "**/*.scss",
			images : config.paths.imagesSrc + "**/*.*",
			svg : config.UID + "**/*.svg",
			"docs" : [
				config.paths.jsSrc + "/**/*.{js,jsx}",
				config.paths.sassSrc + "**/*.scss",
				config.docs.js.src,
				config.docs.sass.src
			],
			"docs:js" : [
				config.paths.jsSrc + "/**/*.{js,jsx}",
				...config.docs.js.src
			],
			"docs:sass" : [
				config.paths.sassSrc + "**/*.scss",
				...config.docs.sass.src
			]
		};
		let watchTasksRef = [];
		
		for(let watchTaskKey in watchTasks){
			let watchTaskValue = watchTasks[watchTaskKey];
			let watchId = `watch:${watchTaskKey}`;
			watchTasksRef.push(watchId);
			console.log(watchTaskValue);
			watchTask(watchId, watchTaskValue, watchTaskKey);
		}
		createTask("watch", function(cb){
			config.isWatch = true;
			runSequence(watchTasksRef, () => {
				openDocs();
				cb();
			});
		});
	},
	/**
	 * Compiles development versions of html, js, css, images and svg if set in config.tasks
	 * directory. By default all these tasks will be run, you can override the config.tasks
	 * array in the gulpfile.js before tasks.setConfig(config) is run. Dev command will not
	 * compile if the linting rules aren't followed. See [sasslint]{@linkplain module:GulpConfig.sassLint},
	 * [htmllint]{@linkplain module:GulpConfig.htmlLint} and [jsHint]{@linkplain module:GulpConfig.jshint} for linting rules.
	 * @function
	 * @example gulp dev	//all dev files
	 *
	 */
	"dev" : () => {
		
		createTask("dev", function(cb){
			runSequence(config.tasks, cb);
		});
	},
	/**
	 * Compiles release versions of files ready for production. By default
	 * all tasks will be run, you can override the config.tasks array in
	 * the gulpfile.js before tasks.setConfig(config) is run to exclude any tasks.
	 * @function
	 * Sub task must be in the config.tasks file
	 * @example gulp build 			//all source files
	 * @example gulp build:html 	//html/nunjucks files only
	 * @example gulp build:js		//js/jsx files only
	 * @example gulp build:css	    //scss files only
	 * @example gulp build:images   //copies files from the images src directory
	 * @example gulp build:svg		//compiles svg files into single svg with symbols
	 *
	 */
	"build" : (...subTasks) => {
		
		let tasks = [];
		if(subTasks.length > 0){
			tasks = config.tasks.filter(task => subTasks.indexOf(task) > -1);
		}
		createTask("build", function(cb){
			config.debug = false;
			runSequence(config.tasks, cb);
		});
		for(let task of tasks){
			buildTask(task);
		}
		
	},
	/**
	 * Clears are generated files from the build directory.
	 * @function
	 * @example gulp clean
	 *
	 */
	"clean" : () => {
		createTask("clean", function(cb){
			return del([`${config.build}/**/*`, `!${config.build}`]);
		});
	},
	/**
	 * Generates documetion for js and sass. Js or Sass only files can
	 * be generated by running the sub tasks.
	 * @function
	 * @example gulp docs		//all docs generated
	 * @example gulp docs:js	//generate js documentation
	 * @example gulp docs:sass	//generate sass documentation
	 *
	 */
	"docs" : () => {
		createTask("docs:js", function(cb){
			
			let gulpSrc = ["configs/docs/jsdoc.md", `${config.paths.jsSrc}**/*`, "configs/gulp/*.js"];
			gulpSrc = gulpSrc.concat(config.docs.js.src);
			
			return gulp.src(gulpSrc)
        	.pipe(jsdoc(config.docs.js.options)).on("end", () => {
				if(!config.isWatch){
					openJsDoc();
				}
			});
			
		});
		createTask("docs:sass", function(cb){
			
			let gulpSrc = [`${config.paths.sassSrc}**/*`];
			gulpSrc = gulpSrc.concat(config.docs.sass.src);
			
			return gulp.src(gulpSrc)
        	.pipe(sassdoc(config.docs.sass.options)).on("end", () => {
				if(!config.isWatch){
					openSassDoc();
				}
			});
			
		});
		createTask("docs", function(cb){
			runSequence(["docs:js", "docs:sass"], cb);
		});
	},
	/**
	 * Compiles a develop version of all files and runs a local server. Any
	 * changes you make to the source files whilst this task is running will
	 * update in the site. The documentation will also be generated and any
	 * changes to source file comments will be reflected in the
	 * documentation on refresh.
	 * @function
	 * @example gulp test-server
	 *
	 */
	testServer : () =>
	{
		createTask("test-server", (cb) => {
			// Gets .html and .nunjucks files in pages
			runSequence("clean", "dev", "docs", () => {
				runSequence(["watch", "browserSync"], () => {
					if(config.isWatch){
						openDocs();
					}
					cb();
				});
			});
		});
	}
};
