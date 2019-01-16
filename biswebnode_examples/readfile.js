console.log('---------------------------------------------------------');
const bisweb=require('biswebnode');


let genericio=bisweb.genericio;

genericio.read('./node_modules/biswebnode/ModuleList.txt').then( (result) => {

    console.log("Read Filename=",result.filename);
    console.log("Read Data=",result.data);

    // now save in tmp

    genericio.write('tmp/test.js',result.data).then( (m) => {
        console.log('--- file saved in',m);
        process.exit(0);
    });
    
});
