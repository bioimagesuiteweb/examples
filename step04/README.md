# Simple Web Application with Webpack

This introduces the webpack bundler which allows us to use node.js (and ES6
style) modules in the browser. In this style of doing things, our raw JS
code, which now includes statements such as `require` and `import` that the
browser does not handle by default, needs to be compiled by webpack to yield
a clean, browser compatible bundle.

Since we move to webpack we can also use `npm` to install runtime dependencies
such as jQuery and Bootstrap, hence unlike [step3](../step03) there is no
externals directory here. Dependencies are managed via npm by including them
in the `package.json` file.

The key components of this file take the form:

    "dependencies": {
        "bootstrap": "3.4.0",
        "jquery": "3.3.1"
    },
    "devDependencies": {
        "gulp": "4.0.0",
        "gulp-webserver": "0.9.1",
        "webpack": "4.28.4",
        "webpack-cli": "3.2.1"
    }

We list `jquery` and `bootstrap` as __dependencies__. This signifies that they
are used during the actual execution of our application. The rest are listed as
__devDependencies__ which signifies that they are used to `create` our
application, but are not needed during execution.


## Install Dependencies

First install our runtime dependencies (jQuery and Boostrap), webpack and a local web server using:

	npm install -d
    
## To Run

First build the JS bundle using:

    gulp webpack
    
The webpack configuration is in `config/webpack.config.js`. Note that we do
not bundle `jQuery` -- it is listed in `externals` in the webpack
configuration. Instead, we leave it as is and include it
directly in `index.html`. We do the same for `bootstrap`.

 <!-- JS files -->
    <script src="../node_modules/jquery/dist/jquery.min.js"></script>
    <script src="../node_modules//bootstrap/dist/js/bootstrap.min.js"></script>
    
Next start the webserver using:

    gulp webserver
    
__If you are lazy; just typing `gulp` will execute these two steps in series.__
    
Then, if does not open automatically, navigate to
[http://localhost:9000/web/index.html](http://localhost:9000/web/index.html).


## The code

This page consists of essentially five groups of files plus external dependencies
from package.json. These are:

1. The main page `web/index.html`.
2. The main css file `web/index.css`.
3. A node.js style module to compute BMI in `web/bmimodule.js`,
4. The main JS file in `web/index.js`.
5. The webpack configuration file in `config/webpack.config.js`


## Regression Testing with Mocha

We also define a set of regression tests for the core computational module
`web/bmimodule.js` using [Mocha](https://mochajs.org/). See its webpage for
more details. The tests can be found in the file `test/testbmi.js`. To invoke
them simpy type

    mocha test/testbmi.js
    
or more simply (to invoke every .js file in the test directory):

    mocha test
    
This will run all tests (see the code) and generate a summary result at the
end. In this case it has the form:

    3 passing (10ms)

This specifies that 3 tests were run and all passed.

To follow good `npm` practice we also add our tests to the 'scripts' section
of our `package.json` file
as follows

    "scripts": {
        "test": "mocha test"
    },

In this way a user can simply type `npm test` (without knowing what type of
test setup we use) to run the tests.

## Revisiting `gulpfile.js`

Typing `gulp --tasks` yields a more complex arrangement:

    examples/step04>gulp --tasks
    [19:24:13] Tasks for ~\bisweb\examples\step04\gulpfile.js
    [19:24:13] ├── webserver
    [19:24:13] ├── webpack
    [19:24:13] └─┬ default
    [19:24:13]   └─┬ <series>
    [19:24:13]     ├── webpack
    [19:24:13]     └── webserver
    
    
Now the `default` task is a series-combination of `webpack` and `webserver`. 

The `webpack` task is worth looking at.

    gulp.task('webpack', (done) => {

       let cmd='webpack-cli --config '+path.join('config','webpack.config.js');

        executeCommand(cmd,__dirname).then( () => {
            done();
        }).catch( (e) => {
            process.exit(1);
        });
    });

Three things stand out. First we task definition:

    gulp.task('webpack', (done) => {
       ..
    });

This syntax implies that our text is a function -- the construct  `(done) => {
}` is a JavaScript function defined using the `fat arrow` syntax (see 
[this MDN article](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
for more details). The argument `done` is the function which we will call when
our task is completed. Tasks in gulp are [asynchronous](https://eloquentjavascript.net/11_async.html).

The second aspect is that we use a function defined in this gulpfile to
execute `webpack` as an external program by calling its command line version
`webpack-cli`. We simply pass as arguments the configuration file
'config/webpack.config.js' and webpack does the rest.

Finally, the function `executeCommand` involves asynchronous processing and
returns a JavaScript `Promise` — see the [MDN article __Using Promises__](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) for more details. We could have re-written this code as:

    let promise=executeCommand(cmd,__dirname);
    promise.then( () => { done(); });
    promise.catch( () => { process.exit(1); });
    
A `Promise` can return into two different functions, `then` or `catch`. If the Promise finishes its function without incident and `resolve`s, it will exit to `then`, and if
it `reject`s with an error it will exit to `catch`. See the code for `executeCommand` to see how
this is created. The first has the form:

    promise.then( somefunction )
    
and in our concrete case, we define `somefunction` in-place using the `fat
arrow` notation as:

    promise.then( () => { done(); });

This means when our asynchronous function is finished, if it is successful, we
will call the `done` handler to signify that our task is done.

If it fails we have:

    promise.catch( () => { process.exit(1); });
    
Here we call `process.exit(1)` to kill the program and return a failed state
(in UNIX, 0=success, 1=failure).
