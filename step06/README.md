# Using Web components

This is a rehash of [step05](./step05) to use custom web elements (or
webcomponents). We define a single component `custom-form` and include it in
`web/index.html` as:

    <custom-form  id="mainwidget"></custom-form>

In fact, the beauty of components is that you can add them multiple times, so
in fact we will instead add two components:

    <!-- the beauty of components is that you can add them multiple times -->
    <custom-form id="first"></custom-form>
    <custom-form id="second"></custom-form>


## Install Dependencies

First install our runtime dependencies (jQuery and Boostrap), webpack and a local web server using:

	npm install -d
    
We also have a small shimming module `webcomponents-lite.js` in the `lib/js`
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

## To Actively Develop:

We introduce also a new development mode setup in gulp. To try this type:

    gulp devel
    
This does three things:

1. Runs `webpack` in watch mode -- this means if you edit any .js files it will
   automatically rebuild the bundle.
2. Runs the `eslint` code to automatically check and changed files for syntax
   errors. (You can manually run this using `gulp eslint`).
3. Runs the webserver as before.


## The code -- creating and registering custom web elements

This is identical to [Step 5](./step05) other than for the fact the code in
`index.js` is now simply a require statement to load `form.js`.

In `form.js` we define our component. Three things are particularly worth
noting here:

1. This is a class that derives from HTMLElement as shown below:

        class CustomFormElement extends  HTMLElement {

2. The two key methods are the constructor and the `connectedCallback`. The
   first is called when the object is created and the second, when it is
   attached to the page.
   
        constructor() {
          super();
        }
    
        connectedCallback() {

         // use this to create the user interface, html elements etc.
        }

3. At the end of the file we register our element

        window.customElements.define('custom-form', CustomFormElement);
        
This tells the browser that the class `CustomFormElement` will be created when
an html element of the form `<custom-form>` is added to the page. The later
name (`custom-form`) __must include a hypen `-`__.


Finally index.js is simply the single line:

    require('./form.js');
    
This is a prompt to webpack to include this in the bundle. If we had more
custom elements we would have added them to this file in a similar fashion.

