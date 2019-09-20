/**
 * @file Gulp helpers
 * @author Netcel
 */
const autoprefixer = require("gulp-autoprefixer"),
	  babel = require("gulp-babel"),
	  babelify = require("babelify"),
	  browserify = require("browserify"),
	  cssnano = require("gulp-cssnano"),
	  data = require("gulp-data"),
	  debug = require("gulp-debug"),
	  filter = require("gulp-filter"),
	  foreach = require("gulp-foreach"),
	  fs = require("fs"),
	  imagemin = require("gulp-imagemin"),
	  include = require("gulp-include"),
	  jshint = require("gulp-jshint"),
	  htmllint = require("gulp-htmllint"),
	  merge = require("merge-stream"),
	  notify = require("gulp-notify"),
	  nunjucksRender = require("gulp-nunjucks-render"),
	  path = require("path"),
	  plumber = require("gulp-plumber"),
	  rename = require("gulp-rename"),
	  sass = require("gulp-sass"),
	  source = require("vinyl-source-stream"),
	  stripDebug = require("gulp-strip-debug"),
	  svgstore = require("gulp-svgstore"),
	  sassLint = require("gulp-sass-lint"),
	  uglify = require("gulp-uglify");


var gulp = null,
	config = null,
	browserSync = null;

function getJsSrc() {
	var jsFiles = [`${config.paths.jsSrc}**/*.js`];
	if(Array.isArray(config.entry)){
		for(let entry in config.entry){
			jsFiles.push(`!${config.entry[entry]}`);
		}
	}else if(config.entry !== ""){
		jsFiles.push(`!${config.entry}`);
	}
	
	console.log(jsFiles);
	
    return gulp.src(jsFiles);
}
function customPlumber(errTitle) {
	return plumber({
		errorHandler: notify.onError({
			// Customizing error title
			title: errTitle || "Error running Gulp",
			message: "Error: <%= error.message %>"
		})
	}).on("error", function () {

	});
}
function lintJs(stream) {
	
	if(config.jshint === ""){
		console.log("You must specify a .jshintrc file, found in the UID-framework");
		return null;
	}
	var vendorFilter = filter( ["**/*", "!"+config.paths.jsVendorSrc+"**/*.js"], {restore: true} );
	stream = stream.pipe(vendorFilter)
				   .pipe(customPlumber("JSHint Error"))
				   .pipe(jshint(config.jshint))
				   .pipe(jshint.reporter("default"))
				   .pipe(jshint.reporter("fail"))
				   .pipe(vendorFilter.restore);
	
    return stream;
	
        
}
function htmllintReporter(filepath, issues) {
    if (issues.length > 0) {
        issues.forEach(function (issue) {
            console.log(`[gulp-htmllint] ${filepath} [ ${issue.line}, ${issue.column} ] : ( ${issue.code} ) ${issue.msg}`);
        });
 
        process.exitCode = 1;
    }
}
/**
 * Helpers.
 *
 * @module GulpHelpers
 * @name GulpHelpers
 * @description Functions that process source files to
 * compile them in the build directory.
 */
module.exports = {
	/**
	 * Puts the edited config and gulp objects
	 * into scope.
	 * @function
	 *
	 */
	setEnvir : (_gulp, _config) => {
		gulp = _gulp;
		config = _config;
	},
	/**
	 * Puts the browsersync instance into scope.
	 * @function
	 *
	 */
	setBrowsersync : (_browsersync) => {
		browserSync = _browsersync;
	},
	/**
	 * Compiles javascript. Will use babel to compile any es6
	 * javasript for use in browers. If running a build version
	 * rather than a dev version the javascript will also be
	 * uglified. If browsersync is active the server will refresh
	 * with your changes.
	 * @function
	 * @param {Function} cb - Content callback.
	 *
	 */
	generateJS : (cb) => {
		
		var stream = null;
		
		if(config.entry !== ""){
			
			if(Array.isArray(config.entry)){
				
				config.entry.map(function(entry) {
        			return browserify(entry)
					 	   .transform(babelify, {presets: ["env", "react"]})
			         	   .bundle()
						   .pipe(source(entry))
						   .pipe(rename( function(path){
								path.dirname = `./`;
								path.extname = ".js";
							}))
						   .pipe(gulp.dest("bin/"));
					});
				
			}else{
			
			console.log("entry : " + config.entry);
			stream = browserify(config.entry)
					 .transform(babelify, {presets: ["env", "react"]})
			         .bundle()
					 .pipe(fs.createWriteStream("./bin/index.js"));
			}
			//return stream;
			
		}
		
		stream = lintJs(getJsSrc());
		console.log("filter dest files");
		//filter out files starting with _, or within directories starting with an _
		stream = stream.pipe(filter(function (file) {
			var jsSrc = config.paths.jsSrc.replace(/\//g, path.sep).replace(/\\/g, path.sep);
			var relPath = file.path.substr(file.path.lastIndexOf(jsSrc) + jsSrc.length);
			var regex = new RegExp(path.sep + "_");
			return relPath.charAt(0) !== "_" && !regex.test(relPath);
		}));
		stream = stream.pipe(foreach(function(stream, file){
			return stream.pipe(include());
		}));
		console.log("run babel");
		stream = stream.pipe(babel(config.babel.options));
		if( !config.debug ){
			stream = stream.pipe(stripDebug())
						   .pipe(uglify(config.uglify.options));
		}
		if( !config.debug && config.rename.jsBuild ){
			stream = stream.pipe( rename( config.rename.jsBuild.options ) );
		}
	
		stream = stream.pipe(gulp.dest(config.paths.jsOut));
		if (config.isBrowserSync) {
			stream = stream.pipe(browserSync.reload({ stream: true, reloadDelay: config.browserSync.options.reloadDelay }));//reload page
		}
		
		return stream;
	},
	/**
	 * Compiles html from html and nunjucks files. All files will be
	 * linted, if linting fails check the output window and fix. If
	 * browsersync is active the server will refresh with
	 * the changes.
	 * @function
	 *
	 */
	generateHtml : () => {
		
		if(config.htmlLint === ""){
			console.log("Must provide a .htmllintrc file");
		}
		
		new Promise( (resolve, reject) => {
			
			gulp.src(config.paths.templatesSrc + "**/*.+(html|nunjucks)")
				.pipe(customPlumber("Error Running Nunjucks"))
				.pipe(htmllint({"config" : config.htmlLint, "failOnError" : true}, htmllintReporter))
				.on("error", (err) =>{
				})
				.on("end", (resp) =>{
					resolve(resp);
				});
			
    	}).then( (resp) => {
			
			var stream = gulp.src(config.paths.templatesSrc + "**/*.+(html)")
						 .pipe(customPlumber("Error Running Nunjucks"));
			
			if(config.nunjucks.options.configFile !== ""){
				if(fs.existsSync(config.nunjucks.options.configFile)){
					stream = stream.pipe(data(function () {
						return JSON.parse(fs.readFileSync(config.nunjucks.options.configFile));
					}));
				}
			}
			stream = stream.pipe(nunjucksRender({ path: config.nunjucks.options.paths }))
				     .pipe(gulp.dest(config.paths.htmlOut));
			if (config.isBrowserSync) {
				stream.on("end", function () {
					browserSync.reload();
				});
			}
		}
		).catch( (err) => {
			console.log(err);
		});
	},
	/**
	 * Compiles css from sass files. If
	 * browsersync is active the server will refresh with
	 * the changes. If running a build version the css will
	 * be minified.
	 * @function
	 *
	 */
	generateCSS : () => {
    	
		if(config.sassLint === ""){
			console.log("Must provide a .sasslintrc file");
		}
		
		var sassOptions = !config.debug ? (config.sass.buildOptions || config.sass.options) : config.sass.options;
		
		var stream = gulp.src([config.paths.sassSrc + "**/*.scss"])
						 .pipe(customPlumber("Error Compiling Sass"))
						 .pipe(sassLint({
							 "configFile" : config.sassLint
						 }))
						 .pipe(sassLint.format())
						 .pipe(sassLint.failOnError());

		stream = stream
			.pipe(sass(sassOptions))
			.pipe(autoprefixer(config.autoprefixer.options));

		if (!config.debug) {
			
			stream = stream.pipe(cssnano(config.cssnano.options));
		}

		stream = stream.pipe(gulp.dest(config.paths.cssOut));

		if (config.isBrowserSync) {
			stream = stream.pipe(browserSync.reload({//Inject CSS
				stream: true,
				reloadDelay: config.browserSync.options.reloadDelay
			}));
		}

		return stream;
	},
	/**
	 * Takes list of svgs from congfig.svg and compiles into
	 * a single svg with each svg file available as a symbol
	 * element for reuse in a HTML page.
	 * @function
	 *
	 */
	generateSVG : () => {
	
		return gulp.src(config.svgs.src)
				   .pipe(rename({prefix: config.svgs.prefix}))
				   .pipe(svgstore({ inlineSvg: true }))
        		   .pipe(gulp.dest(config.svgs.dest));
	
	},
	/**
	 * Copies files to the build directory.
	 * @function
	 *
	 */
	copy : (paths, cb) => {
		var stream = merge();

		for (var srcDir in paths) {
			if (!paths.hasOwnProperty(srcDir)) {
				continue;
			}

			var destinationDir = paths[srcDir];

			var readPath = srcDir,
				writePath = destinationDir;

			debug("Read from: " + readPath);
			debug("Write to: " + writePath);

			stream.add(gulp.src(readPath)
				.pipe(gulp.dest(writePath))
			);
		}

		if (stream.isEmpty()) {
			if (cb instanceof Function) {
				cb();
			}

			return;
		}

		return stream;
	},
	customPlumber : (errTitle) => {
		return customPlumber(errTitle);
	},
	/**
	 * Minifies images to the build directory. This
	 * only runs on a build task.
	 * @function
	 *
	 */
	minifyImages : () => {
		return gulp.src(config.paths.imagesSrc + "**/*.+(jpg|jpeg|png|svg|gif)")
			.pipe(imagemin(config.imagemin.options))//minify images
			.pipe(gulp.dest(config.paths.imagesOut));
	}
};