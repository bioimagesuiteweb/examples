# Examples

This is example code for BioImage Suite Web. It introduces certain JavaScript
and Software Engineering Concepts. It was developed in part also for the needs
of the Yale Course ``Medical Software Design`` (BENG 406b, Spring 2019). 

## Learning JavaScript

These examples intoduce certains aspects of JavaScript but they are not a
complete introduction to the language.  For this the reader is referred to the
two books by Axel Rauschmayer. The first, which covers JavaScript up to
version 5 (standard usage until maybe 2016) , is
[Speaking JS](http://speakingjs.com/es5/) by Axel Rauschmayer. Part I -- "A
JavaScript QuickStart" may be all that you need to read to get
started. JavaScript v6 (ES2015) is now fast becoming the new standard. A
second book called [Exploring ES6](http://exploringjs.com/es6/index.html) by
the same author covers some of the changes. I strongly recommend reading
Chapters 1-4 for a clear understanding of all that is new here.

Finally, we recommend this
[document from the BioImageSuite Web repository](https://github.com/bioimagesuiteweb/bisweb/blob/master/docs/AspectsOfJS.md)
which highlights some aspects of the language that are particularly relevant
to these examples.


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
  versions. This is the boiler-plate template  for BENG 406b projects.
  
* [Step 1](./step01) -- a simple commandline (node.js)  `helloworld` application.
* [Step 2](./step02) -- a slightly more complex node.js application showing how
  to use a module.
* [Step 3](./step03) -- a simple web-based application showing how to use an
  old-fashioned module. We also introduce here `npm` and the associated
  package file `package.json` and the task runner `gulp`.
* [Step 4](./step04) -- a redo of step 3 using proper modules and the webpack
  ''bundler''. We also introduce regression testing using `mocha`.
* [Step 5](./step05) -- a redo of step 4 but now as a desktop application using
  Electron.
* [Step 6](./step06) -- moving step 5 to web-components (custom web elements)
* [Step 7](./step07) -- Using
  [BioImage Suite Web code](https://github.com/bioimagesuiteweb/bisweb) to create menus, file dialogs and file I/O

---

__To come__

* [ Step 8 ](./step08) -- Progressive web applications
* [ Step 9 ](./step09) -- packaging web applications for deployment
* [ Step 10](./step10) -- packaging electron desktop applications for distribution.

