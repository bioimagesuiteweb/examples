"use strict"; // Forces strict mode JavaScript

// These are hints for JSHint
/*jshint browser: true*/
/*jshint undef: true, unused: true */
/*global window*/


// jQuery and Bisweb
const $=window.jQuery;
const bioimagesuiteweb=window.bioimagesuiteweb;


// Code to Create GUI elements
const webutil=bioimagesuiteweb.webutil;
const webfileutil=bioimagesuiteweb.webfileutil;
const pwautils=require('pwautils');
const formElement=require('form');

class CustomMainApplication extends  HTMLElement {


    constructor() {
	
	super();
	this.aboutdialog=null;

        pwautils.registerServiceWorker();
    }

    connectedCallback() {

	// Get the IDs of the managed elements
	const menubarid = this.getAttribute('menubar');
	const formid = this.getAttribute('form');

	// Get the Managed Elements themselves
	let menubar = document.querySelector(menubarid).getMenuBar();
        console.log('formid',formid);
        let form=new formElement();


	// Create File Menu
	let fmenu=webutil.createTopMenuBarMenu("File",menubar);

        console.log(form);
        
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
	
	// Create the Help Menu
	let hmenu=webutil.createTopMenuBarMenu("Help",menubar);
	webutil.createMenuItem(hmenu,'About this Application',
			       () => {
				   this.about();
			       });


        // Resize window if inside a PWA
        if (pwautils.inPWA()) {
            // Set the window size
            // Must be at least 800 pixels wide for bootstrap menu to appear
            // normally as opposed to minimized
            window.resizeTo(800, 500);
            window.addEventListener( 'resize', () => {
                window.resizeTo(800, 500);
            });
                
        } else {
            // Register the service worker and
            // if possible optionally add an 'install application' button to this
            pwautils.addInstallButton(hmenu);
        }

        console.log('Creating form');
        form.createGUI(formid);
    }
    
    /** Show about dialog*/
    about() {
    
	if (this.aboutdialog===null) {
	
	    // create about dialog
	    let dlg=webutil.createmodal("About this Application","modal-sm");
	    
	    let content=$(`<P>This application computs the body-mass index for a patient.
			  For more information please see <a href="https://www.nhlbi.nih.gov/health/educational/lose_wt/bmitools.htm" target="#_blank"> this NIH website</a>.</P>
                          <P>The source code for this can be found at <a href="https://github.com/bioimagesuiteweb/examples/tree/master/complete" target="#_blank"> on Github.</a></P>`);
	    dlg.body.append(content);
	    this.aboutdialog=dlg;
	}
    
	//	show about dialog
	this.aboutdialog.dialog.modal('show');
    }

}


// Register the element
window.customElements.define('custom-mainapplication', CustomMainApplication);

