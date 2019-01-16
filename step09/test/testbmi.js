/* jshint node:true */
/*global describe, it */
"use strict";

let assert = require("assert");
let bmi=require('../code/bmimodule');


describe('Testing BMI (bmimodule.js) \n', function() {

    it ('test imperial',function() {
	let temp=bmi.computebmi(150,66,false);
	console.log('+++++ Compute BMI 66 inches, 150 pounds='+temp);
	let diff=Math.abs(temp-24.2);
	let ok=false;
	if (diff<0.1)
	    ok=true;
	assert.equal(ok,true);
    });


    it ('test metric',function() {
	let temp=bmi.computebmi(60,1.6,true);
	console.log('+++++ Compute BMI 60 Kg, 1.6 meters='+temp);
	let diff=Math.abs(temp-23.4);
	let ok=false;
	if (diff<0.1)
	    ok=true;
	assert.equal(ok,true);
    });

    it('test categories',function() {

	let values=bmi.getcategories();
	console.log('Potential values='+values.join(','));
	let bmivalues =  [ 5,9,18,22,25.1,29,33,40,55 ];
	let truevalues = [ 0,0, 1, 2,   3,3, 4,4,0 ];
	let numgood=0;
	for (let i=0;i<bmivalues.length;i++) {
	    let truedesc=values[truevalues[i]];
	    console.log('\n Testing bmi='+bmivalues[i] + ' true='+truedesc);
	    let desc=bmi.classifybmi(bmivalues[i]);
	    if (desc===truedesc) {
		console.log('+++++ bmi of '+bmivalues[i] +' is correctly labeled as '+desc +' ('+truedesc+')');
		numgood+=1;
	    } else {
		console.log('----- error bmi of '+bmivalues[i] +' is misclassified as '+desc +' as opposed to '+truedesc);
	    }
	}
	assert.equal(numgood,bmivalues.length);
    });
});
