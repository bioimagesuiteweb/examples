# Simple Web Application

## To run

First install webpack and a local web server using

	npm install -d
    
## Then run this, first build the JS bundle using

    gulp webpack
    
    
Then start the webserver using

    gulp webserver
    
_If you are lazy; just typing `gulp` will execute these two steps in series._
    
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




