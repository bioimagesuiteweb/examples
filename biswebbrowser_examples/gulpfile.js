

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
      webserver = require('gulp-webserver');

// - - - - - - - - - - - - - - - - - - - -
// Start a light web server so we can test
// - - - - - - - - - - - - - - - - - - - -
gulp.task('webserver', (done) => {
    const options= {
        "root" : __dirname,
        "host" : 'localhost', // change this to '0.0.0.0' to allow remote access
        "port" : '8080',
        'directoryListing': true,
        'open': './index.html'
    };
    return gulp.src('.').pipe(webserver(options));
});

// -------------------------------------------
// Default is devel
// -------------------------------------------

gulp.task('default',gulp.series('webserver'));
          
