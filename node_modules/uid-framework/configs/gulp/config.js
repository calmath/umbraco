/**
 * @file Gulp config
 * @author Netcel
 */
const UID = "UID-project/",
	  build = "static/",
	  bower = "bower_components/",
	  core = "",
	  path = require("path"),
	  imageminPngOpts = {
		  usePngquant: true,
		  options: {
			  quality: "65-80",
			  speed: 3
		  }
	  },
	  imageminPngquant = require("imagemin-pngquant"),
	  htmlOut = build + "html/",
	  templatesSrc = UID + "templates/";
/**
 * 
 * @module GulpConfig
 * @name GulpConfig
 * @description Default configuration that can be overriden in the
 * local gulpfile.js. For a list of gulp tasks [click here]{@linkplain module:GulpTasks}
 *
 */
module.exports = {
	
	UID : UID,
    build : build,
    bower : bower,
    core : core,
	debug : true,
	/**
	 * Directory paths for compiling and outputing files
	 * @typedef {Object} paths
	 * @property {string} jsSrc - Javascript source files
	 * @property {string} jsOut - Javascript output directory
	 * @property {string} jsVendorSrc - Directory of vendor resources
	 * @property {string} sassSrc - Sass source files
	 * @property {string} cssOut - Destination of css files
	 * @property {string} svgsSrc - SVG source files
	 * @property {string} svgsOut - Destination of svg files
	 * @property {string} imagesSrc - Image sources
	 * @property {string} imagesSrc - Image output directroy
	 * @property {string} assetsSrc - Asset files
	 * @property {string} assetsOut - Asset outputs
	 * @property {string} templatesSrc - Nunjucks html template directory
	 * @property {string} htmlOut - Output directory for compiled nunjuck files
	 */
	paths : {
		jsSrc: UID + "js/",
        jsOut: build + "js/",
        jsVendorSrc: UID + "js/_vendor/",
        sassSrc: UID + "sass/",
        cssOut: build + "css/",
        svgsSrc: UID + "images/svgs/",
        svgsOut: build + "images/svgs/",
        imagesSrc: UID + "images/",
        imagesOut: build + "images/",
        assetsSrc: UID + "assets/",
        assetsOut: build,
        templatesSrc: templatesSrc,
        htmlOut: htmlOut
	},
	dev : {
		copy : {
			images : {
				[UID + "images/icon-assets/**"] : UID + "images/icons/"
			}
		}
	},
	/**
	 * Sass task options
	 * @typedef {Object} sass
	 * @property {Object} options - Dev options for compiling sass
	 * @property {Object} buildOptions - Build options for compiling sass
	 */
	sass : {
        options: {
            outputStyle : "nested", //nested, expanded, compact, compressed
            precision : 8,
            includePaths : [bower, core + "sass"],
        },
        buildOptions: {
            outputStyle : "nested", //nested, expanded, compact, compressed
            precision : 8,
            includePaths : [bower, core + "sass"],
        }
    },
	/**
	 * Autoprefixer task options
	 * @typedef {Object} autoprefixer
	 * @property {Object} options - Options for prefixing css rules
	 */
	autoprefixer : {
        options : {
            browsers: ["ie 8-9", "last 3 versions"],
            grid: false
        }
    },
	/**
	 * Nunjucks task options
	 * @typedef {Object} nunjucks
	 * @property {Object} options - Options for compiling html and nunjucks files to html
	 */
	nunjucks : {
        options : {
            configFile: UID + "template-data.json",
			paths : [templatesSrc]
        }
	},
	/**
	 * Uglify task options
	 * @typedef {Object} uglify
	 * @property {Object} options - Uglify options
	 */
	uglify : {
        options: {}
    },
	/**
	 * Cssnano task options
	 * @typedef {Object} cssnano
	 * @property {Object} options - Cssnano options for compressing css files
	 */
	cssnano : {
        options: {
            safe: true,
            autoprefixer: false
        }
    },
	/**
	 * CombineMq task options
	 * @typedef {Object} combineMq
	 * @property {Object} options - Combine-mq default options
	 */
	combineMq : {
        options: {
            beautify: false
        }
    },
	raster : {},
	rename : {},
	/**
	 * Imagemin task options
	 * @typedef {Object} imagemin
	 * @property {Object} options - Options for compressing images on build
	 */
	imagemin : {
        options: {
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: (imageminPngquant ? [imageminPngquant(imageminPngOpts)] : [])
        }
    },
	/**
	 * BrowserSync task options
	 * @typedef {Object} browserSync
	 * @property {Object} options - Configure a test server for working with the UID project
	 */
	browserSync : {
        options: {
            server: {
                baseDir: build
            },
            startPath: path.relative(build, htmlOut),
            //port: 8080, //change port
            browser: ["chrome"],//,"firefox"
            reloadDelay: 400//Time (in milliseconds), to wait before instructing the browser to reload/inject following a change event
        }
    },
	/**
	 * Babel task options
	 * @typedef {Object} babel
	 * @property {Object} options - Options for parsing ES6 javascript to ES5
	 */
	babel : {
        options : {
            presets : [
				["env",
				 {
					"targets": {
						"browsers": [
							"Chrome >= 52",
							"FireFox >= 44",
							"Safari >= 7",
							"Explorer 9",
							"last 4 Edge versions"
						]
					},
					useBuiltIns: false
				}
				]
			],
            compact : false
        }
    },
	isBrowserSync : false,
	isWatch : false,
	/**
	 * List of default tasks to run. Override in the gulp file for only the tasks you need to compile
	 * @typedef {Array} tasks
	 * @property {string} html - HTML compile task
	 * @property {string} js - JS compile task
	 * @property {string} css - CSS compile task
	 * @property {string} images - Images compile task
	 * @property {string} svg - SVG compile task
	 */
	tasks : [
		"html",
		"js",
		"css",
		"images",
		"svg"
	],
	/**
	 * Rules to follow when developing javascript. The code will
	 * not compile whilst these rules are failing, and you won't
	 * be able to commit any non compliant javascript.
	 * @typedef {Object} module:GulpConfig.jshint
	 * @property esversion - Allow ES6 syntax
	 * @property browser - Allow use of browser level objects, e.g. window
	 * @property worker - Allow worker syntax e.g. new Worker("worker.js")
	 * @property devel - Allow console and alerts
	 * @property debug - Surpresses debugger statments
	 * @property camelcase - variables and functions follow camelcase naming
	 * @property eqeqeq - Must use === and !==
	 * @property asi - Must end lines with a semi colon
	 * @property node - Allows for nodejs syntax
	 * @property curly - If statments that are on multiple lines must have a curly bracket
	 * @property immed - Functions must be wrapped in parentheses
	 * @property globals - Use of third party namespaces
	 * @property latedef - Variables must be defined before use
	 * @property newcap - Class instantiations need to be in capitals
	 * @property noarg - Prohibits caller and callee on an argument
	 * @property quotmark - Strings must use double quotes
	 * @property undef - No undefined variables
	 * @property unused - Warns if variables are unused, will ignore parameter variables
	 * @property trailing - No trailing whitespace after text
	 * @property loopfunc - No new functions within a loop
	 * @property sub - Objects must be access using . and not []
	 */
	jshint : "",
	/**
	 * A set of functional and style rules to follow when developing
	 * with sass. The sass will not compile to css or allow you to
	 * commit whilst these rule are invalid. If erroring, check the
	 * gulp output window to see which rules are not being matched.
	 * @typedef {Object} module:GulpConfig.sassLint - sassLint rules
	 * @property sassLint.attribute-quotes - Attributes must have double quotes to match value
	 * @property sassLint.bem-depth - maximum depth of 3
	 * @property sassLint.bem-depth - maximum depth of 3
	 * @property sassLint.border-zero - border set to 0, not none
	 * @property sassLint.brace-style - 1tbs
	 * @property sassLint.class-name-format - class name rules
	 * @property sassLint.class-name-format.allow-leading-underscore - Cannot lead with a underscore for classes
	 * @property sassLint.class-name-format.convention - camelcase
	 * @property sassLint.class-name-format.convention-explanation - Class must be written in camel case
	 * @property sassLint.class-name-format.ignore - Array of classnames to ignore
	 * @property sassLint.clean-import-paths - options for importing sass files
	 * @property sassLint.clean-import-paths.leading-underscore - imports should start with an underscore
	 * @property sassLint.clean-import-paths.filename-extension - no file extension when importing
	 * @property sassLint.declarations-before-nesting - declarations of parent rule to be written before any nesting rules
	 * @property sassLint.empty-args - must use () after includes
	 * @property sassLint.empty-line-between-blocks - rules for line breaks
	 * @property sassLint.empty-line-between-blocks.include - nested blocks must include a space between the last declration
	 * @property sassLint.empty-line-between-blocks.allow-single-line-rulesets - single line rules are not allowed
	 * @property sassLint.extends-before-declarations - extends must be before any further declarations
	 * @property sassLint.extends-before-mixins - extends must be before mixins
	 * @property sassLint.final-newline - files must end in a new line
	 * @property sassLint.force-attribute-nesting - attributes don't need to be nested
	 * @property sassLint.force-element-nesting - elements don't need to be nested
	 * @property sassLint.force-pseudo-nesting - pseudo selectors don't need to be nested
	 * @property sassLint.function-name-format - rules for naming function
	 * @property sassLint.function-name-format.allow-leading-underscore - function names can't start with underscores
	 * @property sassLint.function-name-format.convention - Function names to be camelcased
	 * @property sassLint.function-name-format.convention-explanation - Message to display when rules don't evaluate to true
	 * @property sassLint.hex-length - Rules for hex values
	 * @property sassLint.hex-length.style - Hex values should be long
	 * @property sassLint.hex-notation - Rules for hex casing
	 * @property sassLint.hex-notation.style - Hex values should lowsercase
	 * @property sassLint.indentation - Indent by using tab
	 * @property sassLint.leading-zero - Decimals must lead with a whole number, including 0
	 * @property sassLint.max-line-length - Lines can be no longer than 90 characters
	 * @property sassLint.mixin-name-format.allow-leading-underscore - mixin names can't start with underscores
	 * @property sassLint.mixin-name-format.convention - mixin names to be camelcased
	 * @property sassLint.mixin-name-format.convention-explanation - Message to display when rules don't evaluate to true
	 * @property sassLint.mixins-before-declarations - mixins must be before declarations
	 * @property sassLint.no-attribute-selectors - attribute selectors are allowed
	 * @property sassLint.no-color-hex - hex values are allowed
	 * @property sassLint.no-color-keywords - string values must not be used for colours
	 * @property sassLint.no-color-literals - Colour literals are allowed for sass declarations
	 * @property sassLint.no-color-literals.allow-map-identifiers - can use literals in maps
	 * @property sassLint.no-color-literals.allow-rgba - can use rgba in declarations
	 * @property sassLint.no-color-literals.allow-variable-identifiers - can use literals in variable identifiers
	 * @property sassLint.no-combinators - must used nested rules instead of combinators
	 * @property sassLint.no-css-comments - css comments are allowed
	 * @property sassLint.no-debug - debug comments can be used
	 * @property sassLint.no-duplicate-properties - duplicate properties are allowed
	 * @property sassLint.no-empty-rulesets - don't leave rules empty
	 * @property sassLint.no-extends - extends are allowed
	 * @property sassLint.no-ids - id's can't be styled
	 * @property sassLint.no-important - importants are allowed
	 * @property sassLint.invalid-hex - no invalid hex values
	 * @property sassLint.mergeable-selectors - can't have multiple selectors that are the same
	 * @property sassLint.no-misspelled-properties - check for spelling errors in properties
	 * @property sassLint.no-qualifying-elements - elements can be styled
	 * @property sassLint.no-trailing-whitespace - don't leave trailing white space
	 * @property sassLint.no-trailing-zero - decimals can't end with a zero
	 * @property sassLint.no-transition-all - To prevent performance issues and accidental animation
	 * @property sassLint.no-universal-selectors - For performance, try minimising * selectors
	 * @property sassLint.no-url-domains - All valid urls are ok
	 * @property sassLint.no-url-protocols - Use protocoless urls
	 * @property sassLint.vendor-prefixes - Autoprefixer will handle most of these, will warn as a guide only
	 * @property sassLint.no-warn - Warnings allowed
	 * @property sassLint.one-declaration-per-line - Only allow one declaration per line
	 * @property sassLint.property-sort-order - No ordering for properties
	 * @property sassLint.quotes - Must use double quotes
	 * @property sassLint.shorthand-values - Values should be written as short as possible
	 * @property sassLint.single-line-per-selector - Selectors can be on single line
	 * @property sassLint.space-after-colon - Space must be after colon
	 * @property sassLint.space-after-comma - Space must be after comma
	 * @property sassLint.space-around-operator - Spaces should be around any operator
	 * @property sassLint.space-before-bang - Include a space before !important
	 * @property sassLint.space-before-brace - Include a space before {
	 * @property sassLint.space-between-parens - No spaces between ()
	 * @property sassLint.trailing-semicolon - Always end in semi colon
	 * @property sassLint.url-quotes - Urls should always be in quotes
	 * @property sassLint.variable-name-format - Variable names should be camelcase
	 */
	sassLint : "",
	/**
	 * A set of functional and style rules to follow when writing
	 * with jyml. The nunjucks templates will not compile to css or
	 * allow you to commit whilst these rule are invalid. If
	 * erroring, check the gulp output window to see which rules
	 * are not being matched.
	 * @typedef {Object} module:GulpConfig.htmlLint - htmlLint rules
	 * @property htmlLint.attr-bans - List of invalid attributes.
	 * Never add "align", "background", "bgcolor", "border",
	 * "frameborder", "longdesc", "marginwidth", "marginheight",
	 * "scrolling", "style" or "width" on inline HTML.
	 * @property htmlLint.indent-style - Tab indents only
	 * @property htmlLint.tag-bans - List of tags no longer supported in html5
	 * @property htmlLint.tag-close - Tags must be closed
	 * @property htmlLint.tag-name-lowercase - Tags must be lowercase
	 * @property htmlLint.tag-name-match - Tags must match name and case when closing
	 * @property htmlLint.doctype-html5 - Only use html5 doctypes
	 * @property htmlLint.attr-name-style - Attribute names need to have dashes between words
	 * @property htmlLint.attr-no-dup - No duplicate attributes
	 * @property htmlLint.attr-no-unsafe-char - Don't use undate characters in attribute values
	 * @property htmlLint.attr-quote-style - use double quotes for setting attribute values
	 * @property htmlLint.attr-req-value - attribues cannot end with an equal sign
	 * @property htmlLint.attr-validate - attributes must be compliant
	 * @property htmlLint.id-no-dup - no duplicate ids
	 * @property htmlLint.id-class-style - ids must be written camel case
	 * @property htmlLint.class-no-dup - no duplicated classes in the class attribute
	 * @property htmlLint.class-style - matches the same class style in the sass linter
	 * @property htmlLint.img-req-alt - images must have alt text
	 * @property htmlLint.img-req-src - images must have a source. If source is set through javascript,
	 * use the Img() javscript class to load the source and build the tag
	 * @property htmlLint.html-valid-content-model - html should only have body and head child nodes
	 * @property htmlLint.head-valid-content-model - head should only contain base, link, meta, noscript, script, style template and title tags.
	 * @property htmlLint.label-req-for - label tags must have a for attribute
	 * @property htmlLint.line-no-trailing-whitespace - no trailing whitespace on lines
	 * @property htmlLint.head-req-title - head requires a title tag
	 * @property htmlLint.title-no-dup - title must only appear once
	 * @property htmlLint.input-radio-req-name - radio elements require a name
	 * @property htmlLint.input-req-label - all inputs require a label
	 */
	htmlLint : "",
	/**
	 * Documentaion compiler for js and sass. Set the src
	 * as an array for each documentation to compile.
	 * @typedef {Object} docs
	 * @property {Object} js - JSdoc configuration
	 * @property {Object} sass - SASSdoc configuration
	 */
	docs : {
		js : {
			options : {
				"opts": {
					"destination": "./docs/js",
					"includePattern": ".+\\.js(doc|x)?$",
					"excludePattern": "(^|\\/|\\\\)_"
				}
			},
			src : []
		},
		sass : {
			options : {
				"dest": "./docs/sass",
				"groups" : {
					"components" : "Components",
					"configuration" : "Configuration",
					"utils" : "Utils",
					"undefined" : "Misc"
				},
				"descriptionPath" : "configs/docs/sassdoc.md"
			},
			src : []
		}
	},
	/**
	 * Sets the broserify entry javasript file for compiling
	 * javscript based applications e.g. React, Vue, Angular etc
	 * @typedef {String|Array} entry - Entry file for browserify. Set an array for multiple entry files.
	 */
	entry : "",
	/**
	 * SVG compiler task to compile multiple svgs into reusable svg symbols
	 * @typedef {string} prefix - Prefix to use svg ids
	 * @property {Array} src - Glob directories to svg files
	 * @property {string} dest - Output directory for compiled svg.svg file
	 */
	svgs : {
		"prefix" : "svg-",
		"src" : [],
		"dest" : `${templatesSrc}/components`
	}
};