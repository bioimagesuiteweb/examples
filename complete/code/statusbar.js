/* global  HTMLElement,window */
"use strict";

const $=require('jquery');


const statusbartext=`
  <nav class="navbar navbar-default navbar-fixed-bottom"  style="min-height:25px; max-height:25px">
    <div style="display: inline-block;margin-top:1px; padding-left:2px; padding-right:5px;margin-bottom:1px;height:10px;font-size:14px;float:left">
      <img src="images/bottomlogo.png" height="20px"/>
    </div>
    <div style="display: inline-block;margin-top:1px; padding-left:2px; padding-right:5px;margin-bottom:1px;height:10px;font-size:14px;float:right">
      <p>This application is an example for Yale BENG 406b, Spring 2019.</p>
    </div>
  </nav>`;

// -----------------------------------------------------------------
/**
 * A web element that creates a bottom status bar (using BootStrap <nav class="navbar navbar-default navbar-fixed-bottom">
 *
 * to access simply include this file into your code and then add this as an element to your html page
 *
 * @example
 *  <custom-statusbar></custom-statusbar> 
 *
 */
class StatusBarElement extends HTMLElement {
    
    // Fires when an instance of the element is created.
    connectedCallback() {
	
	let elem=$(statusbartext);
	this.appendChild(elem[0]);
    }
    
}


// Register the element
window.customElements.define('custom-statusbar', StatusBarElement);


