# Sass documentation

This documentation covers information about available mixins, funcions and
variables available in the project.

## Directory setup

All sass files should be written in the ```UID-project/sass``` directory.
Any files with a leading ```_``` will not be output as css and must be
used as imports in other sass files. The files witout a leading ```_```
will be output as css files.

## Writing Sass

Follow the sasslint rules found in the Javascript documentation under Gulp
Config. If the sasslint rules are not followed the css won't compile and
commits cannot be made to git.

If you haven't already generated the javascript documentation, you can do
so by running ```gulp docs:js``` in the project root.

Once the javascript documentation has been run, you can find the [sasslint
rules here](../js/module-GulpConfig.html#.sassLint__anchor).

## Working with layouts

Each CMS platform we support has it's own bespoke layout to work with the
platforms html. Each platform also has a shared layout that controls
core flex layout behaviours. Each project should include the shared layout
file, as well as a platform sass file. Any brand or functionaliy specfic
files are included at the project level.

### Sample sass layout

```
project                               Project root
|
├ uid-project base package            Installed through npm
|   |
|   ├ common                          Included in all projects
|   |    |
|   |    ├ mixins.scss
|   |    ├ normalise.scss
|   |    ├ animation.scss
|   |
|   ├ layouts
|   |    |
|   |    ├ layout.scss                Include the base layout
|   |    ├ layoutEpiserver.scss       Only include the one platform
|   |
|   ├ components
|        |
|        ├ accordion.scss             Any additional component css needed
|
├ project level sass                  Project level styles
    |
    ├ brand.scss
    ├ styles.scss
```

See the examples in the uid-project base framework to see how to configure
layouts for Episerver and Umbraco.