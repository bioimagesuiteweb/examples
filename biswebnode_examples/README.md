### Examples of using biswebnode as a library

This directory contains examples of how to use `biswebnode` as a library.

* `readnifti.js` -- read and manipulate a nifti-1 formatted image.
* `smoothimage.js` -- smooth an image using the smoothImage module 

__Note:__ For a complete list of modules type

    node node_modules/biswebnode/lib/bisweb.js

To get more info about a specific module type

    node node_modules/biswebnode/lib/bisweb.js modulename -h

To run the regression tests for biswebnode first install mocha as follows:

    sudo npm install -g mocha
    
(On Windows omit sudo)

Then type:

    cd node_modules/biswebnode/test
    mocha test_module.js --last 10
    
This will run the first 10 tests. Ommit `--last 10` to run all the tests. The
testdata is downloaded `on-the-fly` from github.


