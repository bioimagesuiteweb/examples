"use strict"; // Forces strict mode JavaScript

// These are hints for JSHint
/*jshint browser: true*/
/*jshint undef: true, unused: true */
/*global window*/



// JQuery
const $=require('jquery');
const bioimagesuiteweb=require('bislib');


// Code to Create GUI elements
const webutil=bioimagesuiteweb.webutil;
const webfileutil=bioimagesuiteweb.webfileutil;

// -----------------------------------------------------------------
/**
 * The custom form element
 *
 * to access simply include this file into your code and then add this as an element to your html page
 *
 * @example
 *  <custom-form   id="viewer_menubar"></custom-form> 
 *
 */


class CustomMainApplication extends  HTMLElement {


    constructor() {
	
	super();
	this.aboutdialog=null;
    }

    connectedCallback() {

	// Get the IDs of the managed elements
	const menubarid = this.getAttribute('menubar');
	const formid = this.getAttribute('form');

	// Get the Managed Elements themselves
	let menubar = document.querySelector(menubarid).getMenuBar();
	let form = document.querySelector(formid);

	// Create File Menu
	let fmenu=webutil.createTopMenuBarMenu("File",menubar);

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
	
    }
    
    
    about() {
    
	if (this.aboutdialog===null) {
	
	    // create about dialog
	    let dlg=webutil.createmodal("About this Application","modal-sm");
	    
	    let content=$('<P>This application computs the body-mass index for a patient.'+
			  'For more information please see <a href="https://www.nhlbi.nih.gov/health/educational/lose_wt/bmitools.htm" target="#_blank"> this NIH website </a></P>');
	    dlg.body.append(content);
	    this.aboutdialog=dlg;
	}
    
	//	show about dialog
	this.aboutdialog.dialog.modal('show');
    }
}


// Register the element
window.customElements.define('custom-mainapplication', CustomMainApplication);

