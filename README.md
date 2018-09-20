# Introduction 
Front end React application for Umbraco website. Works with headless CMS.

# Getting Started
Here's a list of dependncies
- Nodejs (with npm) [https://nodejs.org/en/]

After installing dependencies run ```npm start``` to install node module dependencies

# Build and Test
Run development build : ```gulp dev```
Run test server : ```gulp browserSync```
Run test server whilst listening for changes : ```gulp test-server```
Run build version of files ```gulp build```

More information about gulp tasks and writing UID code in the generated js and sass documentaion. These will open when test server is run.

# Contribute
No changes directly to master branch. Before commit, Sass, javascript and html are linted to check they are valid. If they fail the linting tests any changes can't be commited.