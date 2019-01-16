console.log('---------------------------------------------------------');
const bisweb=require('biswebnode');
    
let img=new bisweb.BisWebImage();
img.load("data/MNI_T1_2mm_stripped_ras.nii.gz").then( () => {

    console.log('Image Loaded = ',img.getDescription());
    console.log('---------------------------------------------------------');
    let mod=bisweb.createModule("smoothImage");
    console.log('++++');
    mod.execute( { "input" : img   }, { "sigma"  : 2.0, "inmm" : false, "debug" : true }).then( () => {
        let out=mod.getOutputObject("output");
        console.log('++++');
        console.log('OutImage = ',out.getDescription());
        console.log('---------------------------------------------------------');
        out.save("tmp/smoothimage.nii.gz").then( (m) => {
            console.log('++++ ',m);
            console.log('---------------------------------------------------------');
        });
    });
});
