const isfilenamecsv = function(fname) {
    let ext=fname.split('.').pop();   
    if (ext!="csv") 
	return false;
    return true;
};

const isfilenametxt = function(fname) {
    let ext=fname.split('.').pop();   
    if (ext!="txt") 
	return false;
    return true;
};

const obj = {
    istxt : isfilenametxt,
    iscsv : isfilenamecsv
};

// module.exports stores the item that is being exported/exposed
module.exports=obj;
