## Leveraging BioImage Suite Web as a library

In this example, we will introduce the use of BioImage Suite web as a library.

BioImage Suite Web at its base is a library consisting of two files (versions
of which are placed in the `lib/js` directory). To use BioImage Suite Web
code, these must be included in your `.html` file together with the three core
underlying libraries (jquery,bootstrap and three.js).

Hence the top of `web/index.html` takes the form:

    <script src="../lib/js/webcomponents-lite.js"></script>
    <script src="../node_modules/jquery/dist/jquery.min.js"></script>
    <script src="../node_modules//bootstrap/dist/js/bootstrap.min.js"></script>
    <script src="../node_modules/three/build/three.min.js"></script>
    <script src="../lib/js/libbiswasm_nongpl_wasm.js"></script>
    <script src="../lib/js/bislib.js"></script>
    <script src="../build/index_bundle.js"></script>


## Install Dependencies

First install our runtime dependencies (jQuery and Boostrap), webpack and a local web server using:

	npm install -d
    
We also have a small shimming module `webcomponents-lite.js` in the externals
directory for those browsers that do not natively support custom web elements.
    
## To Run:

First build the JS bundle using:

    gulp webpack
    
The webpack configuration is in `config/webpack.config.js`. Note that we do
not bundle `jQuery` -- it is listed in `externals` in the webpack
configuration. Instead, we leave it as is and include this (and bootstrap)
directly in `index.html`.
    
Next run the application (either as a desktop application) using:

    electron web/electronmain.js

or as a web application, using:

    gulp webserver

or to actively develop use (see [Step 6](../step06).)

    gulp devel


### More custom elements

The body of `web/index.html` has the form:

    <custom-menubar   id="menubar"></custom-menubar>
    <custom-form      id="mainwidget"></custom-form>
    <custom-mainapplication menubar="#menubar" form="#mainwidget"></custom-mainapplication>
    <custom-statusbar></custom-statusbar> 

We now have four custom elements. The form is similar as in `Step 6` (with
some extensions to load and save its contents to a file). The two
`bars` create the top menu bar and the bottom status bar
respectively. Finally, we have the main application element which coordinates
the whole application. It serves the role of the `conductor` in an orchestra.

The code for the custom elements is now in a separate `code` subdirectory.

## Using BioImage Suite Web Code

### Inclusion

BioImage Suite Web is imported by including the following files in the
document header.

    <script src="../lib/js/libbiswasm_nongpl_wasm.js"></script>
    <script src="../lib/js/bislib.js"></script>

One must also include (prior to these), jQuery, Bootstrap (3.4) and THREE.js.

To access the code we can use the require statement e.g.

    const bioimagesuiteweb=require('bislib');
    
or simply access the same object in the global `window` variable e.g.

    const bioimagesuiteweb=window.bioimagesuiteweb;
    
__Note:__ In the webpack config file we configure jQuery, THREE.js and
bioimagesuiteweb as external libraries:

        "jquery": "jQuery", // require("jquery") is external and available on the global var jQuery
        "three": "THREE",  // available on the global variable THREE
        "bislib": "window.bioimagesuiteweb", // available in window.bioimagesuiteweb

This means that they are not included in the webpack bundle but referenced
externally.

### 1. File I/O

The module `genericio` in BioImage Suite web provides a nice abstraction to
File I/O in the multiple contexts that JS code can operate in (Web,Electron,
Node.js). In particular, the two functions `read` and `write` take care of
most of the issues involved here. Their signatures (see
[the raw file](https://github.com/bioimagesuiteweb/bisweb/blob/master/js/core/bis_genericio.js)
for more details) are:


    let read = function (url, isbinary = false)  { ..
    let write = function (url, data,isbinary=false) { ..


* The first parameter `url` is either a filename,
a URL or a Web `File` object (see
    [this MDN article](https://developer.mozilla.org/en-US/docs/Web/API/File) for
more details) depending on the context.

* The parameter `isbinary` should be set to true if we are handling binary data and
false if we are dealing with text.

* The `data` parameter in `write` is the data (either a string or a
Uint8Array).`

Both function return a Promise with the following payload

* read - an object with elements [ filename and data ] representing the actual
  filename read and the actual data read.
* write - a string message.

There are two functions in `code/form.js` that use these namely `load` and
`save`. Let us examine them in turn. We first access the `genericio` module
from the bioimagesuiteweb object as:

    const bisgenericio=bioimagesuiteweb.genericio;

    /**
     * This function loads the state
     * from a text fileobjeect
     */
    load(fileobject) {
        
        // Read returns a structure f
        bisgenericio.read(fileobject).then( (f) => {
            
            let obj = { };
            try { 
                obj= JSON.parse(f.data);
            }  catch(e) {
                webutil.createAlert(`Failed to parse input file ${f.filename}`,true);
            }
            
            let newvalues = {};
            newvalues.weight=obj.weight || 70.0;
            newvalues.height=obj.height || 1.70;
            newvalues.ismetric=obj.ismetric || false;
            this.setValues(newvalues);

            webutil.createAlert('Loaded from '+f.filename,false);
            
        }).catch( (e) => {
            webutil.createAlert(e,true);
        });
        
    }


Here the key line is `bisgenericio.read(fileobject).then( (f) => {`. This is
where the file is read (which contains the new state of the form). Then the
actual data `f.data` is parsed as JSON using `JSON.parse` and the results
stored and displayed on the form.

The save function is similar:

    /**
     * This function saves the state
     * to a text file
     */
    save(fileobject) {

        // if in the browser (as opposed to electron)
        //   fileobject is null and must be set to a default value first
        fileobject=bisgenericio.getFixedSaveFileName(fileobject,"bmi.json");
        
        let values=this.getValues();
        let out=JSON.stringify(values);
        bisgenericio.write(fileobject,out);
    }
}

Here we just call `bisgenericio.write`. In the browser this function never
returns as it creates a download operation that the user may cancel (and our
application may never find out).

### Creation of User Interface Elements

We use here code from two bioimagesuite web modules `webutil` and
`webfileutil`. The source for both is in
[this directory on github](https://github.com/bioimagesuiteweb/bisweb/tree/master/js/coreweb).

    const webutil=bioimagesuiteweb.webutil;
    const webfileutil=bioimagesuiteweb.webfileutil;

The first has many functions for creating page elements (including alerts,
dialog boxes etc.), whereas the second is specialized to create elements that
have to do with File I/O.

#### A first example is `webutil.createAlert`

    webutil.createAlert(message, iserror=false)
    
This creates a
[Bootstrap Alert](https://getbootstrap.com/docs/3.3/javascript/#alerts) with a
message.

#### The next example is `webutil.createmodal`

    let dialog=webutil.createmodal("BMI Results","modal-sm");
    
This creates a modal dialog with title "BMI Results" -- see `code/form.js`. We
can add elements in the body of this using

    dialog.body.empty();
    dialog.body.append( some stuff)
    
and show the dialog using

    dialog.dialog.modal('show');
    
This essentially creates a
[Bootstrap Modal component](https://getbootstrap.com/docs/3.3/javascript/#modals).


##### Creating Menus and Menu Entries

Given a bootstrap menu bar (created by the menubar element `code/menubar.js)
we can then create menus and menu entries as follows. Again the functionality
here is essentially wrappers around the
[Boostrap navbar](https://getbootstrap.com/docs/3.3/components/#navbar)
components.

To create a menu called "File" on a menubar `menubar` use:

    let fmenu=webutil.createTopMenuBarMenu("File",menubar);

To create a menu entry we can use the function webutil.createMenuItem as shown below:

    webutil.createMenuItem(hmenu,'About this Application',
        () => { dosomething });

This takes three arguments: (i) the menu, (ii) the name of the entry and (iii)
the function to call when this is activated.

A call of the form `webutil.createMenuItem(hmenu,'')` creates a separator line
on the menu.

##### Creating File Load and File Save Menu Entries

These are slightly more complicated as the process typically involves (i)
obtaining a filename from the user and (ii) calling a callback (such as our
form functions) to do something with the filename. The module `webfileutil`
simplifies this messy process. Here are the two examples:

        webfileutil.createFileMenuItem(fmenu,'Load Application State',
                                       (f) => {
                                           form.load(f);
                                       },
                                       { title: 'Load Application State',
                                         save: false,
                                         suffix : ".json",
                                         filters : [ { name: 'Application State File', extensions: [ "json"]}],
                                       }
                                      );
        
The first three parameters are identical to webutil.createMenuItem. The final
argument is an object specifying how the File Dialog will look like. This has
potentially five elements as follows:

* title -- the dialog box title
* save -- either true or false
* suffix -- a comma separated list of suffixes as a string to filter on in a
  webpage environment
* filters -- a more complex structure for use with Electron Dialogs -- see
  [https://electronjs.org/docs/api/dialog](https://electronjs.org/docs/api/dialog)
  for more details.
* intitialCallback - a function which returns an initial filename in the case
  of save operations. See the next example call.


        webfileutil.createFileMenuItem(fmenu, 'Save Application State',
                                       (f) => {
                                           form.save(f);
                                       },
                                       {
                                           title: 'Save Application State',
                                           save: true,
                                           filters : [ { name: 'Application State File', extensions: [ "json"  ]}],
                                           suffix : ".json",
                                           initialCallback : () => { return "mybmi.json"; }
                                       });
        

__Note:__ These examples barely scratch the surface of the functionality in
bioimagesuiteweb but they still illustrate some of its most useful `generic` functionality.

### BioImage Suite Web code and Electron

BioImage Suite Web uses some node.js code in Electron applications via the
Electron `preload` mechanism. This allows us, for example, to use the Native
File Load and File Save dialogs instead of the Browser 'light' versions.

The BioImage Suite Web code needs the object window.BISELECTRON to be
both defined and take a specific form. This is shown in the file
`web/electronpreload.js`. ( This is a
[good article describing this mechanism](https://medium.com/cameron-nokes/how-to-create-a-hybrid-electron-app-53553ece0889). This
is used as part of the launch process by setting the flag `preload` (see
`web/electronmain.js`).


### More Examples of using BioImage Suite Web Functionality

There are also three examples in the BioImage Suite Web repository

*  [ Image Resampling Example](https://github.com/bioimagesuiteweb/bisweb/blob/master/web/exportexample.html)
  -- shows how to use BioImage Suite web image processing modules to resample
  a medical image. The JS code is [at this location](https://github.com/bioimagesuiteweb/bisweb/blob/master/web/exportexample.js).

*
[ TensorFlow.js Example](https://github.com/bioimagesuiteweb/bisweb/blob/master/web/tfjsexample.html)
-- shows how to apply a pretrained tensorflow.js model to a medical image using
functionality in BioImage Suite Web. The JS code is [at this location](https://github.com/bioimagesuiteweb/bisweb/blob/master/web/tfjsexample.js).
  
* [Viewer Example](https://github.com/bioimagesuiteweb/bisweb/blob/master/web/viewerexample.html)
  -- shows how to create a simple image viewer using more advanced BioImage
  Suite Web components. There is no custom JS code here, this example simply
  connects predefined custom web elements.
