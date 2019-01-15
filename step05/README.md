# Converting our web-application to the Desktop using Electron

This is a rehash of [step04](./step04) but now also showing how to run our
application on the desktop using Electron.

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
    
Next run the application using

    electron web/electronmain.js


## The code

This page consists of essentially five groups of files plus external dependencies
from package.json. These are:

1. The main page `web/index.html`.
2. The main css file `web/index.css`.
3. A node.js style module to compute BMI in `web/bmimodule.js`,
4. The main JS file in `web/index.js`.
5. The webpack configuration file in `config/webpack.config.js`
6. The electron main file `web/electronmain.js`.




