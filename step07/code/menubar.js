/* global  HTMLElement,window */
"use strict";

const $=require('jquery');


const menubartext=`
<nav class="navbar navbar-default navbar-fixed-top">
    <div class="container-fluid" id="bismenucontainer">
      <!-- Brand and toggle get grouped for better mobile display -->
      <div class="navbar-header" id="bismenuheader" >
	<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bismenu">
	  <span class="sr-only">Toggle navigation</span>
	  <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
	</button>
	<img src="images/logo.png" height="50px" style="margin-top:5px">
      </div>  <!-- Collect the nav links, forms, and other content for toggling -->
      <div class="collapse navbar-collapse" id="bismenu">
	<ul class="nav navbar-nav" id="bismenuparent" name="menubar">
	</ul>
      </div><!-- /.navbar-collapse -->
    </div><!-- /.container-fluid -->
	</nav>`;


// -----------------------------------------------------------------
/**
 * A web element that creates a top menu bar (using BootStrap <nav class="navbar navbar-default navbar-fixed-top">
 *
 * to access simply include this file into your code and then add this as an element to your html page
 *
 * @example
 *  <custom-menubar   id="viewer_menubar"></custom-menubar> 
 *
 */
class MenuBarElement extends HTMLElement {
    
    // Fires when an instance of the element is created.
    connectedCallback() {
	
	let elem=$(menubartext);
	this.appendChild(elem[0]);
	this.menubar=elem.find("[name='menubar']");
    }
    
    /**
     * returns the menubar div to which one can add a boostrap style menu -- see
     * {@link WebUtil.createTopMenuBarMenu}
     */
    getMenuBar() {
	return this.menubar || null;
    }
}


// Register the element
window.customElements.define('custom-menubar', MenuBarElement);


