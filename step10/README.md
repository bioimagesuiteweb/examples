## Packaging Electron-Based Desktop Applications

There is no code for this step as the additions to step 9 for this lead us to
the [complete example](../complete). In this file we discuss the additional
info in
[complete/gulpfile.js)(../complete/gulpfile.js) that are needed to create packaged electron applications.

#### Code Changes

BioImage Suite Web handles the context differences between Web and Electron in terms of File I/O and File Dialogs (which are the most critical differences). The only other changes to the code is to put some checks in [code/pwautils.js](../complete/code/pwautils.js)
to stop things from running if we are in Electron.

The changes are minor. At the top of the file we require bioimagesuiteweb
(this is the same as before):

     const bioimagesuiteweb=require('bislib');

Next in both the functions `registerServiceWorker` and `addInstallButton` we
check if we are in electron using the `getenvironment` function in
bioimagesuiteweb. If yes, we do nothing and just return. Here are the first
few lines from the function `registerServiceWorker` in code/pwautils.js

     let registerServiceWorker= function() {

        // No Service Worker in Electron
        if (bioimagesuiteweb.getenvironment === 'electron') 
             return;
    
        ...
        


### Differences Between Packaging Electron Apps and Web Apps

A key difference is that Electron Apps (when packaged) are:

1. A package.json file describing the applications
2. Potentially a node_mdules directory with the node-style dependencies not packaged into webpack.
3. The Electron Applications do not need the extra information w.r.t PWAs (see [Step 8](../step08).


To package an electron app we follow the following five steps:

1. Run the same `build` task as for the web-page
2. Create the package.json file for the Electron application and put this in
   `build/web`
3. Execute `npm install` inside `build/web` to download the node.js style
   dependencies.
4. Remove any files not needed for electron (AppImages for one)
5. Run `electron-packager` to create the Electron application as a directory.
6. Zip this output to create a final zip file.







We discuss steps 2-5 below:

#### Step 2 -- create package.json file

We actually do this as part of the `commonfiles` task. First we note that the
global variable appinfo contains the `package.json` file.

    const appinfo=require('./package.json');
    
In the task `commonfiles` we first copy the files as in [Step 9](../step09)
but adding the two electron-specific js files.

    gulp.task('commonfiles', (done) => {
    
        es.concat(
            ...
            gulp.src('./web/electronpreload.js').pipe(gulp.dest(options.outdir)),
            gulp.src('./web/electronmain.js').pipe(gulp.dest(options.outdir)),
            ...
        ).on('end', () => {

           let outinfo = { };
           outinfo.name=appinfo.name;
           outinfo.version=appinfo.version;
           outinfo.main='electronmain.js';
           outinfo.license=appinfo.license;
           outinfo.description=appinfo.description;
           outinfo.repository='https://github.com/bioimagesuiteweb/examples/',
           outinfo["dependencies"]=  {
               "electron-debug": "^1.0.1",
               "glob": "^7.1.1",
               "rimraf": "2.6.2"
           };

           fs.writeFileSync(path.join(__dirname,'build/web/package.json'),JSON.stringify(outinfo,null,2));
           done();
        });
      });

When the copying is done, we create the new package.json file in `build/web`
based on what we know about the dependencies of the electron app (from
web/electronpreload.js).


#### Step 3-6 -- packaging

These are performed in the `electronpackage` task. This is mostly boilerplate
code -- see the comments inside this for a description of what is going on.
     
     gulp.task('electronpackage', (done) => {
     
Identify the directories and platform we are on

         const indir=path.resolve(__dirname,path.join('build','web'));
         const distdir=path.normalize(path.resolve(__dirname,path.join('build','dist')));
         const gulpzip = require('gulp-zip');
         const platform = os.platform();
         let inwin32=false;
         
         if (platform==='win32') {
             inwin32=true;
         }
     
Get the version of electron to use from the global options variable

         const version=options.electronversion;
         console.log(colors.cyan(getTime()+' Using electron '+version+' for '+platform));
     
Create the name of the zip files

         let name=platform;
         let suffix=".zip";
         if (name==="darwin") {
             name="macos";
             suffix=".app.zip";
         }

Cleanup time

The variable appdir stores the name of electron-packagers's output
directory. Remove this just in case to start clean.
         
         let zipindir=appinfo.name+'-'+name+'-x64';
         let appdir=path.join(distdir,zipindir);
         console.log(colors.red(getTime()+' removing '+appdir));
         rimraf.sync(appdir);
     
Remove any node_modules directory from build/web to start clean

         let modules_dir=path.join(indir,'node_modules');
         console.log(colors.red(getTime()+' removing '+modules_dir));
         rimraf.sync(modules_dir);
     
Remove the PWA images that are not needed

         let icons_dir=path.join(indir,'AppImages');
         console.log(colors.red(getTime()+' removing '+icons_dir));
         rimraf.sync(icons_dir);
     
Run `npm install` to get the node.js style dependencies
         
         executeCommand('npm install',indir).then( () => {
             // Modules in node_modules have been updated

Create the electron_packager command

             let eversion = options.electronversion;
             let cmdline='electron-packager '+indir+' '+appinfo.name+' --arch=x64 --electron-version '+eversion+' --out '+path.resolve(distdir)+' --overwrite --app-version '+appinfo.version;
             
             // Add Icons in windows and Mac
             if (inwin32)
                 cmdline+=` --platform=win32 --icon `+path.resolve(__dirname,'web/images/logo.ico');
             else if (platform==='linux')
                 cmdline+=' --platform=linux';
             else
                 cmdline+='--platform=darwin --icon '+path.resolve(__dirname,'web/images/logo.icns');
     
Execute Electron Packager
             
             executeCommand(cmdline,indir).then( () => {

Create ZIP file -- same code as in [Step 9](../step09).
                 
                 let zname=path.resolve(path.join(indir,path.join('..',`dist/${appinfo.name}_${appinfo.version}_${name}.zip`)));
                 let basez=path.basename(zname);
                 console.log(getTime()+' creating zip file: outfile = ',zname);
                 console.log(getTime()+' input app directory=',appdir);
                 gulp.src([appdir+'/**/*'], {base : appdir}).
                     pipe(gulpzip(basez)).
                     pipe(gulp.dest(distdir)).on('end', () => {
                         let mbytes=getFileSizeInMB(zname);
                         console.log(getTime()+' ____ zip file created in '+zname+' (size='+mbytes+' MB )');
                         done();
                     });
             }).catch( (e) => {
                 console.log(e);
                 process.exit(1);
             });
         }).catch( (e) => {
             console.log(e);
             process.exit(1);
         });
     });
     
     
     
