## Creating a Progressive Web Application.

In this example, we will introduce Progressive Web Applications (PWAs).

A great introduction to this topic can be found on the
[Google Developers Webpage](https://developers.google.com/web/progressive-web-apps/).

We also recommend the [PWA Builder Tool](https://www.pwabuilder.com/) from Microsoft.

## PWAs

To create an installable PWA, we need four things:

1. A service worker, see [web/serviceworker.js](web/serviceworker.js).
2. A manifest file, see [web/manifest.json](web/manifest.json) that is linked to from the main
   web page (`web/index.html`)
3. Code to register the service worker from the main application called from
   [code/main_applications.js](code/main_application.js), see
   [code/pwautils.js](code/pwautils.js).
4. Code to trap and expose the `install` event, again see [code/main_applications.js](code/main_application.js) and 
   [code/pwautils.js](code/pwautils.js).

In addition, the manifest file requires icons of our application at different
sizes. We used the tool that is part of PWA Builder to create these from a
single example; these icons can be found in [web/AppImages](web/AppImages).

## Install Dependencies

Install the runtime dependencies as usual:

	npm install -d
    
## To Run:

Pack the bundle and run it in the same way as before:

    gulp webpack
    
The webpack configuration is in `config/webpack.config.js`. 
    
Run in electron as 

    electron web/electronmain.js

a web application as

    gulp webserver

or to actively develop as

    gulp devel
    
### Installing as a PWA

This application is a progressive web application. it will install as a desktop
application from the web page under Chrome on Windows/Android. To
install on Mac OSX or Linux you will need to use Chrome. First enable the flag:
   
        chrome://flags#enable-desktop-pwas
        
Then open http://localhost:8080/web/index.html as usual.

See if you have an option under the Help menu to install this as a PWA (as
shown below)

![Install as PWA](../complete/docs/pwa.jpg)

