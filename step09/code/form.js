// These are hints for JSHint
/*jshint browser: true*/
/*jshint undef: true, unused: true */
/*global window*/

"use strict";

const $=window.jQuery;
const bioimagesuiteweb=window.bioimagesuiteweb;


// Code to Create GUI elements
const webutil=bioimagesuiteweb.webutil;
const bisgenericio=bioimagesuiteweb.genericio;

// The BMI Module Code
const bmi=require('./bmimodule');


const formtext=`
      <form class="form">
	<div class="form-group">
	  <label for="weight">Weight</label>
	  <input type="number" step="any" class="form-control" name="weight" placeholder="70.0" style="width:200px">
	</div>
	<div class="form-group">
	  <label for="height">Height</label>
	  <input type="number" step="any" class="form-control" name="height" placeholder="1.80" style="width:200px">
	</div>
	<div class="checkbox">
	  <label>
	    <input type="checkbox" name="metric" checked="true"> Using Metric Units
	  </label>
	</div>
	<button class="btn btn-primary" type="submit" name="compute" style="width:200px">Compute BMI</button>
      </form>
    <HR>`;


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


class CustomFormElement extends  HTMLElement {

    constructor() {

	super();
	this.resultsdialog=null;
    }
    
    connectedCallback() {

	// Create GUI
	this.core_element=$(formtext);
	this.appendChild(this.core_element[0]); // mapping for Jquery to regular web element

	this.weight_input=this.core_element.find(`[name='weight']`);
	this.height_input=this.core_element.find(`[name='height']`);
	this.metric_input=this.core_element.find(`[name='metric']`);
	this.compute_button=this.core_element.find(`[name='compute']`);

	// Attach a callback to the compute button on the GUI
	this.compute_button.click( (e) => {
	    e.preventDefault(); // cancel default behavior
	    this.compute();
	});

    	this.setValues({
	    weight : 70.0,
	    height : 1.70,
	    ismetric  : true,
	});


}

    setValues(state) {

	// Set Values from dictionary
	this.weight_input.val(state.weight);
	this.height_input.val(state.height);
	this.metric_input.prop('checked', state.ismetric);
    }

    getValues() {

	// Return output as a dictionary
	let output= {
	    weight : this.weight_input.val() || 0,
	    height : this.height_input.val() || 0,
	    ismetric : this.metric_input.is(":checked") || false
	};

	return output;
    }

    /**
     * This function computes the results, 
     * creates the results dialog if this is the first time
     * and displays the results in the results dialog
     * It first calls {@link Main.storeGUIValuesInApplicationState} to update the 
     * current application state from the GUI and then {@link BmiModule.getdescription} to generate the results
     */
     compute() {
	 let values=this.getValues();
    
	 // Compute description text
	 let outtext=bmi.getdescription(values.weight,
					values.height,
					values.ismetric);
	 
	 // Replace all linebreaks "\n" with "<BR>"
	 outtext=outtext.replace(/\n/g,'<BR>');
	 
         // Set the text
	 
	 if (this.resultsdialog===null) {
	     this.resultsdialog=webutil.createmodal("BMI Results","modal-sm");
	 }
    
	 let content=$('<P>'+outtext+'</P>');
	 this.resultsdialog.body.empty();
	 this.resultsdialog.body.append(content);
	 this.resultsdialog.dialog.modal('show');
     }


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



// Register the element
window.customElements.define('custom-form', CustomFormElement);


