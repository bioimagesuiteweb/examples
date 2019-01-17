## Packaging a Webpage for Upload to a Server

In the previous examples, we have run the web application from its source
directory (e.g. web/index.html) with only the JS bundle going to a separate
build directory. While this works for development use, it's less practical
to move this type of setup to a server.

The goal of this example is to demonstrate how to create a tidy copy of
everything necessary into a clean
directory and ultimately a zip file for upload to a server.

## Install Dependencies

Install our dependencies as usual:

	npm install -d
    
## To Run:

1. Build the application using

        gulp build
        
        
2. Then test using:

        gulp webserver
        
    and open your browser to 
    
        http://localhost:8080/build/web/index.html
        
3. To create a zip file type:
  
        gulp zip 
    

    This will create a zip file for upload to a web server, which can be found in `build/dist`.


Alternatively, type:

    gulp webpage
    
This first build and then zip the application.


## Packaging Problems

### 1. Copying Unchanging Files from Various Directories to a Single Place

The first task is to move all static assets (images, code, `.css` files, fonts
etc.) that do not change to a single location. We will use the directory
`build/web` for this purpose. This is accomplished by the task `commonfiles`
which has the form:

    // - - - - - - - - - - - - - - - - - - - -
    // Copy static assets and external js files to build/web
    // - - - - - - - - - - - - - - - - - - - -
    gulp.task('commonfiles', (done) => {
    
        es.concat(
            gulp.src([ 'node_modules/bootstrap/dist/css/*']).pipe(gulp.dest(options.outdir+'/css/')),
            gulp.src([ 'node_modules/bootstrap/dist/fonts/*']).pipe(gulp.dest(options.outdir+'/fonts/')),
            gulp.src([ 'web/serviceworker.js']).pipe(gulp.dest(options.outdir)),
            gulp.src([ 'web/images/**/*']).pipe(gulp.dest(options.outdir+'/images/')),
            gulp.src([ 'lib/fonts/*']).pipe(gulp.dest(options.outdir+'/fonts/')),
            gulp.src([ 'lib/js/*.js']).pipe(gulp.dest(options.outdir+'/fonts/')),
            gulp.src([ 'web/index.css']).pipe(gulp.dest(options.outdir)),
            gulp.src([ 'web/manifest.json']).pipe(gulp.dest(options.outdir)),
            gulp.src([ 'web/AppImages/**/*']).pipe(gulp.dest(options.outdir+'/AppImages')),
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
    
This uses a set of gulp.src ... gulp.dest operations to copy files and
directories from the various places to `build/web` (which is stored in
`options.outdir`).

gulp.src selects and streams a set of files. It uses wildcards such as '*' and
'**' to select many files or recursive sets of files, see
[the Gulp docs](https://gulpjs.org/API.html#gulp-src-globs-options) for more
info. This is then copied via sending via a pipe to a gulp.dist whose primary
argument is the directory in which the files are to be copied.

All these operations are asynchronous so we group them using es
('event-stream') to get a single 'end' event.

### 2. Webpack output

We simply store the webpack output bundle in `build/web`, which is specified in
[config/webpack_config.js](config/webpack.config.js), by changing the `output` entry.

### 3. The index.html file

Let's take a look at the header of this from [Step 8](../step08/README.md).

    <link rel="stylesheet" type="text/css" href="../lib/css/bootstrap_dark_edited.css">
    <link rel="stylesheet" type="text/css" href="./index.css">

    <script src="../lib/js/webcomponents-lite.js"></script>
    <script src="../node_modules/jquery/dist/jquery.min.js"></script>
    <script src="../node_modules//bootstrap/dist/js/bootstrap.min.js"></script>
    <script src="../node_modules/three/build/three.min.js"></script>
    <script src="../lib/js/libbiswasm_nongpl_wasm.js"></script>
    <script src="../lib/js/bislib.js"></script>
    <script src="../build/index_bundle.js"></script>

    <link rel="manifest" href="./manifest.json">

Note that while this works nicely in development mode, the files are all over
the place. We use templating and renaming plugins in `gulp` to rename this
file. First the header is changed to:

    <!-- external css files -->
    <!-- build:css -->
    <link rel="stylesheet" type="text/css" href="../lib/css/bootstrap_dark_edited.css">
    <link rel="stylesheet" type="text/css" href="./index.css">
    <!-- endbuild -->

    <!-- all javascript files -->
    <!-- build:js -->
    <script src="../build/web/webcomponents-lite.js"></script>
    <script src="../build/web/jquery.min.js"></script>
    <script src="../build/web/three.min.js"></script>
    <script src="../build/web/bootstrap.min.js"></script>
    <script src="../build/web/libbiswasm_nongpl_wasm.js"></script>
    <script src="../build/web/bislib.js"></script>
    <script src="../build/web/index_bundle.js"></script>
    <!-- endbuild -->
    <!-- end webpack/gulp modifications -->

    <!-- build:manifest-->
    <!-- endbuild-->

Note the `build`:`endbuild` pairs. These are markers for a tool `gulp-html-replace`
to find and replace with new content. This is accomplsihed in the task
'mainhtml' as follows:

    gulp.task('mainhtml', (done) => {

         const htmlreplace = require('gulp-html-replace');

         let inputhtml   = path.normalize(path.join(__dirname,'./web/'+options.name+'.html'));
             
         gulp.src([ inputhtml])
             .pipe(htmlreplace({
                 'js': options.alljs,
                 'css': options.allcss,
                 'manifest' : '<link rel="manifest" href="./manifest.json">',
             })).pipe(gulp.dest(options.outdir)).on('end', () => {
                 done();
             });
    });

The elements in `htmlreplace` (js,css,manifest) are used to replace the blocks
in the html file, build:css to endbuld, build:js to endbuild and
build:manifest to endbuild.

The `alljs` and `allcss` variables are simply lists of all `.js` and `.css`
files to be included in the `.html` file

    alljs : [ 'webcomponents-lite.js', 'jquery.min.js', 'three.min.js', 'bootstrap.min.js', 'libbiswasm_nongpl_wasm.js', 'bislib.js', 'index_bundle.js'  ],
    allcss : [ 'bootstrap_dark_edited.css', 'index.css' ],


The final output is a clean html file ready to ship:

    <!-- external css files -->
    <link rel="stylesheet" href="bootstrap_dark_edited.css">
    <link rel="stylesheet" href="index.css">


    <!-- all javascript files -->
    <script src="webcomponents-lite.js"></script>
    <script src="jquery.min.js"></script>
    <script src="three.min.js"></script>
    <script src="bootstrap.min.js"></script>
    <script src="libbiswasm_nongpl_wasm.js"></script>
    <script src="bislib.js"></script>
    <script src="index_bundle.js"></script>

    <!-- manifest file -->
    <link rel="manifest" href="./manifest.json">

### 4. Creating the final zip file

This is accomplished using the `gulp-zip` module of gulp. This is a
straightforward  gulp stream (gulp.src --> pipe gulp-zip --> pipe
gulp.dest) as shown below. The global variable `appinfo` is defined in the
upper part of gulpfile.js as:

    const appinfo=require('./package.json');
    
The task itself is:

    gulp.task('zip', (done) => {

         const gulpzip = require('gulp-zip');

         // appinfo IS package.json -- which specifies the name and version of the application
         // Zip file name
         let zname=path.resolve(path.join(__dirname,path.join('build/dist/',
                   `${appinfo.name}_${appinfo.version}_webpage.zip`)));

         // Last part of zname without paths
         let basez=path.basename(zname);
    
         // Location of build/web (input to zip)
         let appdir=path.resolve(path.join(__dirname,'build/web'));

         // Location of build/dist (output of zip)
         let distdir=path.resolve(path.join(__dirname,'build/dist'));

         // gulp.src  -> zip -> dest 
        gulp.src([appdir+'/**/*'], {base : appdir}).
           pipe(gulpzip(basez)).
             pipe(gulp.dest(distdir)).on('end', () => {
               let mbytes=getFileSizeInMB(zname);
               console.log(getTime()+' ____ zip file created in ',
                    zname+' (size='+mbytes+' MB )');
               done();
        });
    });



## Looking at all the tasks in gulpfile.js

This is an imposing list of tasks that can be run either single or as
combinations. This shows the power of `gulp` to help manage a complex process.


        Tasks for examples\step09\gulpfile.js
        ├── clean
        ├── commonfiles
        ├── mainhtml
        ├── webackwatch
        ├── webpack
        ├── webserver
        ├── eslint
        ├── watch
        ├── zip
        ├─┬ build
        │ └─┬ <series>
        │   ├── clean
        │   └─┬ <parallel>
        │     ├── commonfiles
        │     ├── mainhtml
        │     └── webpack
        ├─┬ webpage
        │ └─┬ <series>
        │   ├─┬ build
        │   │ └─┬ <series>
        │   │   ├── clean
        │   │   └─┬ <parallel>
        │   │     ├── commonfiles
        │   │     ├── mainhtml
        │   │     └── webpack
        │   └── zip
        ├─┬ devel
        │ └─┬ <series>
        │   ├── webackwatch
        │   └─┬ <parallel>
        │     ├─┬ build
        │     │ └─┬ <series>
        │     │   ├── clean
        │     │   └─┬ <parallel>
        │     │     ├── commonfiles
        │     │     ├── mainhtml
        │     │     └── webpack
        │     ├── watch
        │     └── webserver
        └─┬ default
          └─┬ <series>
            └─┬ devel
              └─┬ <series>
                ├── webackwatch
                └─┬ <parallel>
                  ├─┬ build
                  │ └─┬ <series>
                  │   ├── clean
                  │   └─┬ <parallel>
                  │     ├── commonfiles
                  │     ├── mainhtml
                  │     └── webpack
                  ├── watch
                  └── webserver
       
