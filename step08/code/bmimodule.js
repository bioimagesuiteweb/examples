/* global  BIS */

"use strict";


/**
 * @file A Broswer and Node.js module. Contains {@link BmiModule}.
 * @author Xenios Papademetris
 * @version 1.0
 */


/**
 * @namespace BmiModule
 */

const categories = [ 'Error', 'Underweight','Normal Weight','Overweight', 'Obese' ];
    
    
/**
 * This function computes Body Mass Index (weight/height). The units are determined by the last parameter (ismetric). If ismetric is true then we assume kg and meters else inches and pounds
 * @alias BmiModule.computebmi
 * @param {number} weight - the weight either in kilograms or in pounds
 * @param {number} height - the height either in meters or in inches
 * @param {boolean} ismetric - if true then use metric units (kilograms/meters) else use imperial units (inches/pounds). Default if not specified is false (i.e. use imperial units)
 * @returns {number} -- the body mass index in Kg/m^2
 */
var computebmi=function(weight,height,ismetric) {
    
    // Set default parameters
    ismetric=ismetric || false;
    weight = weight || 0;
    height = height || 0;
    
    // Set some bounds for obvious errors
    if (weight < 0.001 || height <0.001 || weight > 1000 || height > 100 ) {
	console.log('Bad inputs to compute bmi');
	return -1.0;
    }
    
    if (ismetric) {
	// Return BMI in kg/m
	return weight/(height*height);
    }
    
    // Use scale factor (703)
    // http://www.whathealth.com/bmi/formula.html
    return (703*weight)/(height*height);
};

/**
 * This function takes as input the Body Mass Index (weight/height) and returns a string classification (e.g. "Overweight")
 * @alias BmiModule.classifybmi
 * @param {number} bmi - the bmi (perhaps as computed from {@link  BmiModule.computebmi}
 * @returns {string} -- a descriptive text for the BMI.
 */
var classifybmi=function(bmi) {
    bmi = bmi || 0;
    
    if (bmi< 10 || bmi > 50)
	return categories[0];
    
    if (bmi<18.5)
	return categories[1];
    
    if (bmi<25)
	return categories[2];
    
    if (bmi<30)
	return categories[3];
	
    return categories[4];
};

/**
 * This function returns the descriptions of the various states as an array. 
 * This is needed for testing.
 * @alias BmiModule.getcategories
     * @returns {array} -- an array of the various BMI categories.
     */
var getcategories = function() {
    return categories.slice(0);
};


/**
 * This function returns a text description given the bmi
 * This is needed for testing.
 * @alias BmiModule.getdescription
 * @param {number} bmi - the bmi (perhaps as computed from {@link  BmiModule.computebmi}
 * @param {boolean} ismetric - if true units were metric else imperial.
 * @returns {text} -- a text description of the bmi
 */
var getdescription=function(weight,height,ismetric) {
    
    ismetric=ismetric || false;
    weight =weight || 0;
    height =height || 0;
    
    // Compute BMI
    var bmi=computebmi(weight,height,ismetric);
    
    // Round BMI to one decimal place
    bmi=Math.round(bmi*100)*0.01;
    
    // Generate Description
    var desc=classifybmi(bmi);
    
    // Generate output string
    var units=[ 'Kg','m' ];
    if (!ismetric)
	units=['Lb','In'];
    
    var outtext='Inputs: weight='+weight+' '+units[0]+', height='+height+' '+units[1]+"\n";
	if (desc!=="Error") {
	    outtext+='      BMI = '+bmi+"\n";
	    outtext+='      Categorization = '+desc+"\n";
	} else {
	    outtext+='----- Something is wrong, probably height or weight are not correctly entered.\n';
	}
    
    return outtext;
};


module.exports = {
    computebmi : computebmi,
    classifybmi : classifybmi,
    getcategories: getcategories,
    getdescription: getdescription,
};



    
