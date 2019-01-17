/**
 * Utilities for Progressive web applications
 */
const bioimagesuiteweb=window.bioimagesuiteweb;
const webutil=bioimagesuiteweb.webutil;


/** Keep track of the install button and related elements */
const internal = {
    installElements : null,
    deferredInstallPrompt : null,
};

/** Register the service worker 
 * This code derives from auto-generated code from 
 * PWABuilder -- www.pwabuilder.com
 */

let registerServiceWorker= function() {

    // No Service Worker in Electron
    if (bioimagesuiteweb.getenvironment === 'electron') {
        return;
    }
    
    // Register the service worker
    if (navigator.serviceWorker) {
        if (!navigator.serviceWorker.controller)  {
            //Register the ServiceWorker
            navigator.serviceWorker.register('serviceworker.js', {
                scope: './'
            }).then(function(reg) {
                console.log('++++ Service worker has been registered for scope:'+ reg.scope);
            });
        }
    }
};

/** Add install button if possible
 * @param{Menu} helpmenu - the menu to add the button to
 */
// See https://developers.google.com/web/fundamentals/app-install-banners/
let addInstallButton= function(helpmenu) {

    // No PWA in Electron
    if (bioimagesuiteweb.getenvironment === 'electron') {
        return;
    }
    
    // Add a button to install the application
    window.addEventListener('beforeinstallprompt', (evt) => {
            
        evt.preventDefault();
        
        if (internal.installElements===null) {
            
            evt.preventDefault();
            // Stash the event so it can be triggered later.
            internal.deferredInstallPrompt=evt;
            internal.deferredInstallPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    internal.deferredInstallPrompt = null;
                    for (let i=0;i<internal.installElements.length;i++)
                        internal.installElements[i].remove();
                    internal.installElements=null;
                }
            });
            
            internal.installElements= [
                webutil.createMenuItem(helpmenu,''), //separator
                webutil.createMenuItem(helpmenu,'Install internal Application as PWA',
			               () => {
                                           internal.deferredInstallPrompt.prompt(); 
                                       })
            ];
        } else {
            internal.deferredInstallPrompt=evt;
        }
    });
};


// https://stackoverflow.com/questions/52000972/pwa-fixed-screensize
let inPWA=function() {

    return (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true);
};

// Export functions
module.exports = {
    addInstallButton,
    registerServiceWorker,
    inPWA,
};

