console.log('---------------------------------------------------------');
const bisweb=require('biswebnode');
    
let img=new bisweb.BisWebImage();
img.load("data/MNI_T1_2mm_stripped_ras.nii.gz").then( () => {

    console.log('---------------------------------------------------------');

    let dim=img.getDimensions();
    console.log('... Dimensions = ',dim);

    let spa=img.getSpacing();
    console.log('... Voxel Spacing=',spa);

    let orient=img.getOrientationName();
    console.log('... Orientation=',orient);

    let tp=img.getImageType();
    console.log('... Type=',tp);

    let range=img.getIntensityRange();
    console.log('... Intensity Range=',range);
    
    // This is an 1-d array
    let voxeldata=img.getImageData();
    console.log('... Raw data: type=',voxeldata.constructor.name, ' length=',voxeldata.length);

    console.log('---------------------------------------------------------');
    // Get the NIFTI Header
    let header=img.getHeader().struct;
    console.log('.... header=',JSON.stringify(header));
    console.log('.... s_row=\n\t', [ header['srow_x'],header['srow_y'],header['srow_z'] ].join('\n\t'));
    console.log('---------------------------------------------------------');
    
    // Let's threshold the image at 100 and output a binary image
    let output=new bisweb.BisWebImage();
    output.cloneImage(img);

    let outdata=output.getImageData();
    let inpdata=img.getImageData();
    for (let i=0;i<inpdata.length;i++) {
        if (inpdata[i]>100)
            outdata[i]=1;
        else
            outdata[i]=0;
    }

    // Save the image now
    output.save("tmp/thresholdedimage.nii.gz").then( (m) => {
        console.log('.... '+m);
        console.log('---------------------------------------------------------');
    });

});
