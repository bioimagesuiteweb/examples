# Simple Web Application with Webpack

This introduces the webpack bundler which allows us to use node.js (and ES6
style) modules in the browser. In this _style_ of doing things, our raw JS
code, which now includes statements such as _require_ and _import_ that the
browser does not handle by default, needs to be `compiled` by webpack to yield
a clean bundle that is browser compatible.

Since we move to webpack we can also use `npm` to install runtime dependencies
such as jQuery and Bootstrap, hence unlike [step3](../step3) there is no
externals directory here. Dependencies are managed via npm by including them
in the `package.json` file.

## Install Dependencies

First install our runtime dependencies (jQuery and Boostrap), webpack and a local web server using:

	npm install -d
    
## To Run

First build the JS bundle using:

    gulp webpack
    
The webpack configuration is in `config/webpack.config.js`. Note that we do
not bundle `jQuery` -- it is listed in `externals` in the webpack
configuration. Instead, we leave it as is and include this (and bootstrap)
directly in `index.html`.
    
Next start the webserver using:

    gulp webserver
    
__If you are lazy; just typing `gulp` will execute these two steps in series.__
    
Then, if does not open automatically, navigate to
[http://localhost:8080/web/index.html](http://localhost:8080/web/index.html).


## The code

This page consists of essentially five groups of files plus external dependencies
from package.json. These are:

1. The main page `web/index.html`.
2. The main css file `web/index.css`.
3. A node.js style module to compute BMI in `web/bmimodule.js`,
4. The main JS file in `web/index.js`.
5. The webpack configuration file in `config/webpack.config.js`




