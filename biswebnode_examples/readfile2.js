console.log('---------------------------------------------------------');
const bisweb=require('biswebnode');


let genericio=bisweb.genericio;

genericio.read('https://bioimagesuiteweb.github.io/test/README.md').then( (result) => {

    console.log("Read Filename=",result.filename);
    console.log("Read Data=",result.data);

    // now save in tmp

    genericio.write('tmp/readme.md',result.data).then( (m) => {
        console.log('--- file saved in',m);

        
        process.exit(0);
    });
    
});
