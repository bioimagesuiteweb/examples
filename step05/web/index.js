"use strict"; // Forces strict mode JavaScript

// These are hints for JSHint
/*jshint browser: true*/
/*jshint undef: true, unused: true */
/*global window*/

const $=require('jquery');
const bmi=require('./bmimodule');


// ------------------------------------------------------
/**  This object contains the application state
 * @property {object}  applicationState -- the application state object
 * @property {number}  applicationState.weight - The current weight
 * @property {number}  applicationState.height - The current height
 * @property {boolean}  applicationState.ismetric - If true height/weight are in metric units (Kg, m) else (Lb, inches)
 * @alias Main.applicationState
 */
let applicationState = {
    weight : 70.0,
    height : 1.69,
    ismetric  : true,
};


/**
 * This function gets values from the GUI and stores in the application
 * state {@link Main.applicationState}
 * @alias Main.storeGUIValuesInApplicationState
     */
let storeGUIValuesInApplicationState = function() {
    
    applicationState.weight=$('#weight').val() || 0;
    applicationState.height=$('#height').val() || 0;
    applicationState.ismetric=$('#metric').is(":checked") || false;
};

/**
 * This function sets the GUI values from the application
 * state {@link Main.applicationState}
 * @alias Main.setGUIValuesFromApplicationState
 */
let setGUIValuesFromApplicationState = function() {
    
    $('#weight').val(applicationState.weight);
    $('#height').val(applicationState.height);
    $('#metric').prop('checked', applicationState.ismetric);
    
};

/** This function computes the results, 
 * creates the results dialog if this is the first time
 * and displays the results in the results dialog
 * It first calls {@link Main.storeGUIValuesInApplicationState} to update the 
 * current application state from the GUI and then {@link BmiModule.getdescription} to generate the results
 * {@link WebUtil.createmodal} is used to create the dialog.
 * @alias Main.compute
 */
let compute=function() {
    
    storeGUIValuesInApplicationState();
    
    // Compute description text
    let outtext=bmi.getdescription(applicationState.weight,
				   applicationState.height,
				   applicationState.ismetric);
    
    // Replace all linebreaks "\n" with "<BR>"
    console.log(outtext);
    outtext=outtext.replace(/\n/g,'<BR>');
    
    
    // Set the text
    
    let content=$('<PRE>'+outtext+'</PRE>');
    $('#result').empty();
    $('#result').append(content);
};

// ------------------------------------------------------------------
// Create GUI
// ------------------------------------------------------------------

/**
 * This function creates the main GUI of the application
 * by instantiating template elements and creating the menu
 * @alias Main.createGUI
 */
let createGUI=function() {
    
    // Initialize the Values
    setGUIValuesFromApplicationState();
    
    // Attach a callback to the compute button on the GUI
    $('#compute').click( (e) => {
	e.preventDefault(); // cancel default behavior
	compute();
    });
};


window.onload=function() {
    createGUI();
};
    
