# Examples

This is example code for BioImage Suite Web. It introduces certain JavaScript
and Software Engineering Concepts. It was developed in part also for the needs
of the Yale Course ``Medical Software Design`` (BENG 406b, Spring 2019). 

## Before you begin

 * Install Node.js 10.x (LTS) -- you may download this from:

    [https://nodejs.org/en/download/](https://nodejs.org/en/download/). 
    
 
 * Install the following global prerequisites using `npm` (on a MS-Windows
   machine __omit `sudo`__)

        sudo npm install -g gulp mocha jsdoc eslint modclean webpack webpack-cli uglify-es rimraf 
        sudo npm install -g electron --unsafe-perm=true --allow-root
        sudo npm install -g electron-packager

### Examples

This repository will eventually contain examples of increasing
complexity. Here is the list

* [Complete](./complete) -- the full example with desktop and electron and pwa
  versions.
  
* [Step 1](./step01) -- a simple commandline (node.js)  `helloworld` application.
* [Step 2](./step02) -- a slightly more complex node.js application showing how
  to use a module.
* [Step 3](./step03) -- a simple web-based application showing how to use an
  old-fashioned module.
* [Step 4](./step04) -- a redo of step 3 using proper modules and the webpack ''bundler''.
* [Step 5](./step05) -- a redo of step 4 but now as a desktop application using
  Electron.
* [Step 6](./step06) -- moving step 5 to web-components (custom web elements)

... to come ...

* [Step 7](./step07) -- a redo of step 6 using
  [BioImage Suite Web code](https://github.com/bioimagesuiteweb/bisweb) to
  create menus, file dialogs and file I/O
