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

class textElement {


    constructor(parent,name,key,value,width='200px') {
        
        this.div=$(`<div class="form-group"></div>`);
        let lab=$(`<label for="${key}">${name}</label>`);
        let inp=$(`<input type="number" step="any" class="form-control" name="${key}" placeholder="${value}" style="${width}">`);
        this.div.append(lab);
        this.div.append(inp);
        parent.append(this.div);
	this.input=inp;
    }

    getElement() {
        return this.div;
    }
    
    getValue() {

        return this.input.val() || 0;
    }

    setValue(v) {
	this.input.val(v);
    }
};



class CustomForm {

    constructor() {

	super();
	this.resultsdialog=null;
    }
    
    
    createCheckElement(name,key,value) {
	let str=`<div class="checkbox">
	  <label>
	    <input type="checkbox" name="${key}" checked="${value}"> ${name}
	  </label>
	</div>`;
	let elem=$(str);
	return elem;
	

    }


    createForm() {
        let str=`<form class="form"></form>`;
        return $(str);
    }

    createSubmitButton(name,key,width="200px") {
	let str=`<button class="btn btn-primary" type="submit" name="${key}" style="width:${width}">${name}</button>`;
        return $(str);
    }


    createGUI(id) {

        
        
	// Create GUI
        let form=this.createForm();
        this.weight_input=new textElement(form,'Weight','weight',70.0);
        this.height_input=new textElement(form,'Height','height',1.70);
        let check=this.createCheckElement('Metric','metric',true);
        let button=this.createSubmitButton('Compute BMI','compute');

        let button2=this.createSubmitButton('Add More','addmore');

        form.append(check);
        form.append(button);
        form.append(button2);
        

        $('id').append(form);
        
	//this.appendChild(form[0]); // mapping for Jquery to regular web element
	this.metric_input=form.find(`[name='metric']`);
	this.compute_button=form.find(`[name='compute']`);

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

        let counter=1;
        let b=form.find(`[name='addmore']`);
        
        b.click( (e) => {
            e.preventDefault(); // cancel default behavior
            counter=counter+1;
            let name=`Random-${counter}`;
            let key=`r-${counter}`;
            let txt=new textElement(form,name,key,counter+1);
        });


    }

    setValues(state) {

	// Set Values from dictionary
	this.weight_input.setValue(state.weight);
	this.height_input.setValue(state.height);
	this.metric_input.prop('checked', state.ismetric);
    }

    getValues() {

	// Return output as a dictionary
	let output= {
	    weight : this.weight_input.getValue(),
	    height : this.height_input.getValue(),
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
module.exports=CustomForm;


