

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

require('./config/bis_checknodeversion');

const gulp = require('gulp'),
      program=require('commander'),
      os = require('os'),
      fs = require('fs'),
      path=require('path'),
      colors=require('colors/safe'),
      bis_gutil=require('./config/bis_gulputils'),
      rimraf=require('rimraf'),
      es = require('event-stream');


const getTime=bis_gutil.getTime;
const getFileSize=bis_gutil.getFileSize;


const options = {
    outdir = "./build",
}


gulp.task('commonfiles', (done) => {
    
    es.concat(
        gulp.src([ 'node_modules/bootstrap/dist/css/*']).pipe(gulp.dest(options.outdir+'css/')),
        gulp.src([ 'node_modules/bootstrap/dist/fonts/*']).pipe(gulp.dest(options.outdir+'fonts/')),
        gulp.src([ 'web/images/**/*']).pipe(gulp.dest(options.outdir+'/images/')),
        gulp.src([ 'lib/fonts/*']).pipe(gulp.dest(options.outdir+'/fonts/')),
        gulp.src([ 'lib/js/*.js']).pipe(gulp.dest(options.outdir+'/fonts/')),
        gulp.src([ 'web/manifest.json']).pipe(gulp.dest(options.outdir)),
        gulp.src('./web/electronpreload.js').pipe(gulp.dest(options.outdir)),
        gulp.src('./web/electronmain.js').pipe(gulp.dest(options.outdir)),
        gulp.src('./lib/css/bootstrap_dark_edited.css').pipe(gulp.dest(options.outdir)),
        gulp.src('./lib/js/webcomponents-lite.js').pipe(gulp.dest(options.outdir)),
        gulp.src('./node_modules/jquery/dist/jquery.min.js').pipe(gulp.dest(options.outdir)),
        gulp.src('./node_modules/three/build/three.min.js').pipe(gulp.dest(options.outdir)),
    ).on('end', () => {
        done();
    });
});
