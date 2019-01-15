"use strict"; // Forces strict mode JavaScript

// These are hints for JSHint
/*jshint browser: true*/
/*jshint undef: true, unused: true */
/*global window*/

const $=require('jquery');
const bmi=require('./bmimodule');

/**
 * Note that instead of id's as in step 5 we use a random attribute called name to index into the elements.
 * This way we can include multiple copies of this form. If we used id's, this break the rule that 'ids' must be unique.
 */

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
      <HR>
      <div name="result" style="width:400px"> </div>
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
	 
    
         let content=$('<PRE>'+outtext+'</PRE>');
         let result=this.core_element.find(`[name='result']`);
         result.empty();
         result.append(content);
     }

}



// Register the element
window.customElements.define('custom-form', CustomFormElement);


