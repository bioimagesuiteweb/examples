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
	webutil.createMenuItem(fmenu,'Load State',
			       function(f) {
				   form.load(f);
			       },
			       '.json',
			       { title : 'BMI State File',
				 save : false,
				 filters : [ { name: 'JSON formatted State definition file', extensions: ['json']}],
			       });
    
	webutil.createMenuItem(fmenu,'Save State',
			       function() {
				   form.save();
			       });
	
	// This is not always this so store value in self and use this in callback!
	const self=this;
	// Create the Help Menu
	let hmenu=webutil.createTopMenuBarMenu("Help",menubar);
	webutil.createMenuItem(hmenu,'About this Application',
			       function() {
				   self.about();
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

