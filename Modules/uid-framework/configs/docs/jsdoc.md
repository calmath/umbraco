# Javascript documentation

This documentaion covers :
- Writing styles
- Configuring gulp tasks
- Running gulp tasks
- Class, functions and methods used within the project

## About gulp tasks

For information on setting up gulp tasks [click here]{@linkplain module:GulpTasks}. You'll find information on the available gulp tasks and how to run them, as well as how to configure and ovverride the defaults.
For a list of configurable options, see the [gulp config]{@linkplain module:GulpConfig}.

## Writing Javascript

This uid framework uses [jsHint]{@linkplain module:GulpConfig.jshint} to make sure that javascript is valid and neat.
Specific information about classes and modules can be found under the top navigation.

[Browserify]{@linkplain http://browserify.org/} and [Babel]{@linkplain https://babeljs.io/} are used to compile ES6 > javascript for browsers.
Each javascript file should be written so that classes and functions can be exported.

*Example of exporting a class*

```
export class Tables {
	/* code */
}
```

*Example of importing a class*

```
import Tables from "./path/to/tables.js";
var tables = new Tables();
```

*Writing and running components es6 components*

- All javascript should be run through the preloader so any polyfill dependencies can be added to the page before the main script is run.
- Component classes in the framework should initialise with a default value