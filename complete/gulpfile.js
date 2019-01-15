

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
      os = require('os'),
      fs = require('fs'),
      path=require('path'),
      colors=require('colors/safe'),
      rimraf=require('rimraf'),
      es = require('event-stream');


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
    console.log(getTime()+" "+colors.green(dir+">")+colors.cyan(command+'\n'));

    return new Promise( (resolve,reject) => {

        try {
            let proc=child_process.exec(command, { cwd : dir });
            
            proc.stdout.on('data', (data) => {
                process.stdout.write(colors.yellow(data));
            });
            
            proc.stderr.on('data',  (data) => {
                process.stdout.write(colors.red(data));
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

// --------------------------------------------------------------------------------------------------

// Options 
const options = {
    outdir : "./build/web",
    lintscripts : ['code/*.js','config/*.js','web/*.js','*.js','test/*.js' ],
    name : 'index',
    alljs : [ 'webcomponents-lite.js', 'jquery.min.js', 'three.min.js', 'bootstrap.min.js', 'libbiswasm_nongpl_wasm.js', 'bislib.js', 'index_bundle.js'  ],
    allcss : [ 'bootstrap_dark_edited.css', 'index.css' ],
    webpackwatch : false,
    debug : true,
    webserver : {
        "root" : path.normalize(__dirname),
        "host" : 'localhost', // change this to '0.0.0.0' to allow remote access
        "port" : '8080',
        'directoryListing': true,
    },
};

gulp.task('clean', (done) => {
    rimraf.sync(options.outdir+'/web/*');
    done();
});

gulp.task('commonfiles', (done) => {
    
    es.concat(
        gulp.src([ 'node_modules/bootstrap/dist/css/*']).pipe(gulp.dest(options.outdir+'/css/')),
        gulp.src([ 'node_modules/bootstrap/dist/fonts/*']).pipe(gulp.dest(options.outdir+'/fonts/')),
        gulp.src([ 'web/images/**/*']).pipe(gulp.dest(options.outdir+'/images/')),
        gulp.src([ 'lib/fonts/*']).pipe(gulp.dest(options.outdir+'/fonts/')),
        gulp.src([ 'lib/js/*.js']).pipe(gulp.dest(options.outdir+'/fonts/')),
        gulp.src([ 'web/index.css']).pipe(gulp.dest(options.outdir)),
        gulp.src([ 'web/manifest.json']).pipe(gulp.dest(options.outdir)),
        gulp.src('./web/electronpreload.js').pipe(gulp.dest(options.outdir)),
        gulp.src('./web/electronmain.js').pipe(gulp.dest(options.outdir)),
        gulp.src('./lib/css/bootstrap_dark_edited.css').pipe(gulp.dest(options.outdir)),
        gulp.src('./lib/js/webcomponents-lite.js').pipe(gulp.dest(options.outdir)),
        gulp.src('./lib/js/bislib.js').pipe(gulp.dest(options.outdir)),
        gulp.src('./lib/js/libbiswasm_nongpl_wasm.js').pipe(gulp.dest(options.outdir)),
        gulp.src('./node_modules/jquery/dist/jquery.min.js').pipe(gulp.dest(options.outdir)),
        gulp.src('./node_modules/bootstrap/dist/js/bootstrap.min.js').pipe(gulp.dest(options.outdir)),
        gulp.src('./node_modules/three/build/three.min.js').pipe(gulp.dest(options.outdir)),
    ).on('end', () => {
        done();
    });
});


gulp.task('mainhtml', (done) => {

    const htmlreplace = require('gulp-html-replace');
    const replace = require('gulp-replace');

    let inputhtml   = path.normalize(path.join(__dirname,'./web/'+options.name+'.html'));
    console.log('\t fixing',inputhtml, '-->', options.outdir);
    
    gulp.src([ inputhtml])
        .pipe(htmlreplace({
            'js': options.alljs,
            'css': options.allcss,
            'manifest' : '<link rel="manifest" href="./manifest.json">',
        })).pipe(gulp.dest(options.outdir)).on('end', () => {
            done();
        });
});

gulp.task('webackwatch', (done) => {
    options.webpackwatch=true;
    done();
});

gulp.task('webpack', (done) => {


    let cmd='webpack-cli --config '+path.join('config','webpack.config.js');
    if (options.webpackwatch)
        cmd+=" --watch";

    executeCommand(cmd,__dirname).then( () => {
        done();
    }).catch( (e) => {
        process.exit(1);
    });
    
});

gulp.task('webserver', (done) => {
    const webserver = require('gulp-webserver');
    console.log(colors.red(getTime()+' server options=',JSON.stringify(options.webserver)));
    return gulp.src('.').pipe(webserver(options.webserver));
});


gulp.task('eslint',  () => { 
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.

    
    const eslint = require('gulp-eslint');
    return gulp.src(options.lintscripts)
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
        .pipe(eslint({
            "env": {
                "browser": true,
                "node": true,
                "commonjs": true,
                "es6": true
            },
            "extends": "eslint:recommended",
            "parserOptions": {
                "sourceType": "module",
                "ecmaVersion": 2017
            },
            "rules": {
                'no-console': 'off',
                'indent' : 'off',
                "semi": [
                    "error",
                    "always"
                ]
            }
        })).pipe(eslint.format());
});


gulp.task('watch', () => {
    console.log(colors.yellow(getTime()+' Beginning to watch js files',options.lintscripts.join(','),' with eslint'));
    return gulp.watch(options.lintscripts, gulp.series('eslint'));
});




gulp.task('build', gulp.series('clean',gulp.parallel('commonfiles','mainhtml','webpack')));

gulp.task('devel', gulp.series('clean','webackwatch',gulp.parallel('commonfiles','mainhtml','watch','webpack','webserver')));
