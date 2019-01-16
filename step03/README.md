# Simple Web Application

## Using NPM for pre-requisites.

[NPM](https://www.npmjs.com/) defines itself as the `package manager for
JavaScript`. Given a project, we can use `npm` to define its dependencies in a
file called `package.json`. See
[this page](https://docs.npmjs.com/files/package.json) for more information on
this file and its format.

In this simple project, we will use `npm` to install a local webserver, so as
to be able to test our application:

Our `package.json` file has the form:

    {
        "name": "beng406example3",
        "version": "1.0.0",
        "description": "Example 3 for BENG 406b",
        "author": "Xenios Papademetris",
        "license": "Apache-2.0",
        "devDependencies": {
            "gulp": "4.0.0",
            "gulp-webserver": "0.9.1"
        }
    }
    
The key lines above are the `devDependencies`. Here we list two packages
(`gulp` and `gulp-webserver`) as our dependencies.


## Install Prerequisites

First install a local web server using

	npm install -d
    
## To run    

To run this

    gulp webserver
    
Then, if does not open automatically, navigate to
[http://localhost:8080/web/index.html](http://localhost:8080/web/index.html).


## The code

This page consists of essentially 5 groups of files

1. Some external dependencies (jQuery and Bootstrap) in the external directory
2. The main page `web/index.html`.
3. The main css file `web/index.css`.
4. A module to compute BMI in `web/bmimodule.js`,
5. The main JS file in `web/index.js`.


## A look at Gulp.js

[Gulp.js](https://gulpjs.com/Gulp) is defined (on its webpage) as ``gulp is a
toolkit for automating painful or time-consuming tasks in your development
workflow, so you can stop messing around and build something.``

It takes as its input a configuration file `gulpfile.js` in which we define
tasks using the function `gulp.task`. We can then create complex workflows
(build processes, packaging, code manipulation etc.) by combining such tasks
using constructs such as `gulp.series` and `gulp.parallel`.

Our gulpfile.js, in this example, is very simple and takes the form:
    
    const gulp = require('gulp'),
        webserver = require('gulp-webserver');

    // - - - - - - - - - - - - - - - - - - - -
    // Start a light web server so we can test
    // - - - - - - - - - - - - - - - - - - - -
    gulp.task('webserver', (done) => {
        const options= {
            "root" : __dirname,
            "host" : 'localhost', // change this to '0.0.0.0' to allow remote access
            "port" : '8080',
            "directoryListing": true,
            "open": 'web/index.html'
        };
        return gulp.src('.').pipe(webserver(options));
    });

    // -------------------------------------------
    // Default is devel
    // -------------------------------------------

    gulp.task('default',gulp.series('webserver'));
    
    
Here we define a task `webserver` that uses an external tool `webserver` to
run a simple web server. 

To invoke this we can simply type (in this directory):

    gulp webserver
    
We also define the 'default' task as simply an alias, in this case, to
`webserver`. To execute the default task, simply type:

    gulp
    
A useful command is `gulp --task` which lists all the tasks defined. The
output here is simply:

    examples/step03>gulp --tasks
    [19:10:56] Tasks for ~\bisweb\examples\step03\gulpfile.js
    [19:10:56] ├── webserver
    [19:10:56] └─┬ default
    [19:10:56]   └─┬ <series>
    [19:10:56]     └── webserver




