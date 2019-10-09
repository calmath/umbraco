const uidFrameworkDir = "./node_modules/uid-framework/",
	  uidProjectDir = `${uidFrameworkDir}UID-project/`,
	  tasks = require(`${uidFrameworkDir}configs/gulp/tasks.js`),
	  history = require('connect-history-api-fallback'),
	  mocha = require('gulp-mocha'),
	  babel = require('gulp-babel'),
	  gulp = require('gulp'),
	  gutil = require('gulp-util'),
	  del = require('del'),
	  ftp = require('vinyl-ftp');

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

gulp.task('copy', ['build'], function () {
    gulp.src('./static/js/index.js')
		.pipe(gulp.dest('./Scripts/'));
	gulp.src('./static/css/style.css')
        .pipe(gulp.dest('./css/'));
});

gulp.task('publish', ['copy'], function () {
	(async () => {
		await del('./publish/**', {force:true});
		gulp.src('./App_Data/packages/*')
			.pipe(gulp.dest('./publish//App_Data/packages/'));
		gulp.src('./App_Plugins/**/*')
			.pipe(gulp.dest('./publish//App_Plugins/'));
		gulp.src('./bin/**/*')
			.pipe(gulp.dest('./publish//bin/'));
		gulp.src('./Config/**/*')
			.pipe(gulp.dest('./publish//Config/'));
		gulp.src('./css/**/*')
			.pipe(gulp.dest('./publish//css/'));
		gulp.src('./scripts/**/*')
			.pipe(gulp.dest('./publish//scripts/'));
		gulp.src('./Umbraco/**/*')
			.pipe(gulp.dest('./publish//Umbraco/'));
		gulp.src('./uSync/**/*')
			.pipe(gulp.dest('./publish//uSync/'));
		gulp.src('./Views/**/*')
			.pipe(gulp.dest('./publish//Views/'));
		gulp.src('./Global.asax')
			.pipe(gulp.dest('./publish/'));
	})();
});

const host = '',
	user = ''
	pwd = ''
	remoteLocation = 'site/wwwroot/';

gulp.task('deploy', ['publish'], function () {
	var conn = ftp.create( {
        host:     host,
        user:     user,
        password: pwd,
        parallel: 3,
        log:      gutil.log
	} );
	
	var ftpFiles = ['./publish/**/*', '!./publish/bin/**', '!./publish/Umbraco/**', '!./publish/App_Plugins/**'];

    return gulp.src(ftpFiles, {base: './publish', buffer: false})
        .pipe(conn.newer(remoteLocation))
		.pipe(conn.dest(remoteLocation))
		.pipe(conn.clean(['site/wwwroot/**', '!site/wwwroot/web.config', '!site/wwwroot/robots.txt', '!site/wwwroot/media/**/*', '!site/wwwroot/App_Data/**/*'], './publish/'))
});