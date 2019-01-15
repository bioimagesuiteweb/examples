

/*  LICENSE
    
    _This file is Copyright 2018 by the Image Processing and Analysis Group (BioImage Suite Team). Dept. of Radiology & Biomedical Imaging, Yale School of Medicine._
    
    BioImage Suite Web is licensed under the Apache License, Version 2.0 (the "License");
    
    - you may not use this software except in compliance with the License.
    - You may obtain a copy of the License at [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)
    
    __Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.__
    
    ENDLICENSE */

/* jshint node:true */

"use strict";


const gulp = require('gulp'),
      webserver = require('gulp-webserver'),
      path = require('path');


// ------------------------------------ A couple of utility functions -------------------------------

const getTime=function() {
    //    http://stackoverflow.com/questions/7357734/how-do-i-get-the-time-of-day-in-javascript-node-js

    let date = new Date();

    let hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    let min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    let sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    return  "[" + hour + ":" + min + ":" + sec +"]";
};


const executeCommand=function(command,dir) {

    const child_process = require('child_process');
    dir = dir || __dirname;
    console.log(getTime()+" "+dir+">"+command+'\n');

    return new Promise( (resolve,reject) => {

        try {
            let proc=child_process.exec(command, { cwd : dir });
            
            proc.stdout.on('data', (data) => {
                process.stdout.write(data);
            });
            
            proc.stderr.on('data',  (data) => {
                process.stdout.write(data);
            });
            
            proc.on('exit', () => {
                console.log('');
            resolve();
            });
            
        } catch(e) {
            console.log(' error '+e);
            reject(e);
        }
    });
};
// -----------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - -
// Start a light web server so we can test
// - - - - - - - - - - - - - - - - - - - -
gulp.task('webserver', (done) => {
    const options= {
        "root" : __dirname,
        "host" : 'localhost', // change this to '0.0.0.0' to allow remote access
        "port" : '8080',
        'directoryListing': true,
        'open': 'web/index.html'
    };
    return gulp.src('.').pipe(webserver(options));
});

// - - - - - - - - - - - - - - - - - - - -
// Run webpack as external process to compile web/index.js to build/web/index_bundle.js
// - - - - - - - - - - - - - - - - - - - -
gulp.task('webpack', (done) => {

    let cmd='webpack-cli --config '+path.join('config','webpack.config.js');


    executeCommand(cmd,__dirname).then( () => {
        done();
    }).catch( (e) => {
        process.exit(1);
    });
    
});

// -------------------------------------------
// Default is devel
// -------------------------------------------

gulp.task('default',gulp.series('webpack','webserver'));
          
