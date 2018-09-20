const uidFrameworkDir = "./node_modules/uid-framework/",
	  uidProjectDir = `${uidFrameworkDir}UID-project/`,
	  tasks = require(`${uidFrameworkDir}configs/gulp/tasks.js`),
	  history = require('connect-history-api-fallback'),
	  mocha = require('gulp-mocha'),
	  babel = require('gulp-babel'),
	  gulp = require('gulp');

//get default config
var config = require(`${uidFrameworkDir}/configs/gulp/config.js`);

//set linter rules from uid-framework
config.jshint =`${uidFrameworkDir}.jshintrc`;
config.sassLint = `${uidFrameworkDir}.sasslintrc`;
config.htmlLint = `${uidFrameworkDir}.htmllintrc`;

//change html output
config.paths.htmlOut = config.build;
config.browserSync.options.startPath = '/';

//add nunjucks files from uid-framework
config.nunjucks.options.paths.push(`${uidProjectDir}templates/`);

//add additional directories and files for generating documentation
config.docs.js.src = [`${uidProjectDir}js/**/[_]*.js`, `${uidFrameworkDir}configs/docs/jsdoc.md`, `${uidFrameworkDir}configs/gulp/*.js`];
config.docs.sass.src = [`${uidProjectDir}sass/**/*`];
config.docs.sass.options.descriptionPath = `${uidFrameworkDir}/configs/docs/sassdoc.md`;
config.docs.sass.options.groups["themes"] = "Themes";
config.docs.sass.options.groups["typography"] = "Typography";
config.docs.sass.options.groups["forms"] = "Forms";
config.docs.sass.options.groups["animation"] = "Animation";

//setup svg sources to compile into a single svg
config.svgs.src = [
	`${config.UID}/svg/**/*.svg`,
	`${uidProjectDir}svg/facebook.svg`,
	`${uidProjectDir}svg/instagram.svg`,
	`${uidProjectDir}svg/linkedin.svg`,
	`${uidProjectDir}svg/twitter.svg`,
	`${uidProjectDir}svg/youtube.svg`
]

tasks.setConfig(config, gulp);

tasks.html();
tasks.js();
tasks.css();
tasks.svg();
tasks.images();

tasks.clean();
tasks.dev();
tasks.watch();
tasks.docs();
tasks.build("css");

tasks.browserSync();
tasks.testServer();

gulp.task('test', function() {
    return gulp.src(['uid-project/tests/*.js'])
        .pipe(mocha());
});

gulp.task('copy', function () {
    gulp.src('./static/js/index.js')
		.pipe(gulp.dest('./Site/Scripts/'));
	gulp.src('./static/css/style.css')
        .pipe(gulp.dest('./Site/css/'));
});