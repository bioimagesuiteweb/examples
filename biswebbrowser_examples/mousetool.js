"use strict";

/* global window,document,$ */

// Get access to the computational tools 
const bisweb=window.bioimagesuiteweb;
const util=bisweb.util;
const webutil=bisweb.webutil;
const bis_genericio=bisweb.genericio;
const BisWebPanel = bisweb.biswebpanel;


class MouseToolElement extends HTMLElement {


    constructor() {
        super();
        this.imageinfo=null;
        this.textnode=null;
        this.panel=null;
        this.orthoviewer=null;
        this.image=null;
    }
    
    /** Called by OrthoViewer when the image changes */
    /** initialize (or reinitialize landmark control). Called from viewer when image changes. This actually creates (or recreates the GUI) as well.(This implements a function from the {@link BisMouseObserver} interface.)
     * @param {BisWebSubViewer} subviewers[] - subviewers to place info in
     * @param {BisImage} volume - new image
     */
    initialize(subviewers,volume) {

        this.image=volume;
        this.updateimageinfo();
     
    }

    updateimageinfo() {

        if (this.imageinfo && this.image) {
            let dim=this.image.getDimensions();
            this.imageinfo.empty();
            this.imageinfo.append($('<P> Image Dimensions='+dim.join(' ')+'</P>'));
        }
    }

    /** receive mousecoordinates and act appropriately!
     * (This implements a function from the {@link BisMouseObserver} interface.)
     * @param {array} mm - [ x,y,z ] array with current point
     * @param {number} plane - 0,1,2 to signify whether click was on YZ,XZ or XY image plane (-1,3 mean 3D click)
     * @param {number} mousestate - 0=click 1=move 2=release
     */
    updatemousecoordinates(mm,plane,mousestate) {

        this.textnode.empty();
        this.textnode.append($('<PRE>'+mm.join(' ')+'</PRE>'));
    }


    connectedCallback() {

        let viewerid=this.getAttribute('bis-viewerid');
        let layoutid=this.getAttribute('bis-layoutwidgetid');
        
        let layoutcontroller=document.querySelector(layoutid);
        this.panel=new BisWebPanel(layoutcontroller,
                                   {  name  : 'Mouse Tool',
                                      permanent : false,
                                      width : '290',
                                      dual : true,
                                   });
        this.parentDomElement=this.panel.getWidget();
        this.imageinfo=$("<div>No Image</div>");
        this.textnode=$("<div>No Coordinates</div>");

        this.parentDomElement.append(this.imageinfo);
        this.parentDomElement.append(this.textnode);
        
        this.orthoviewer=document.querySelector(viewerid);
        this.orthoviewer.addMouseObserver(this);

    }
                                

    show() {
        this.panel.show();
    }

    isOpen() {
        return this.panel.isOpen();
    }
    

}

webutil.defineElement('bisweb-mousetool', MouseToolElement);





// -----------------------------------------------------------------------------------------------
// Main Program
// -----------------------------------------------------------------------------------------------

const showmousetool = function() {

    let mtool=document.querySelector("#mousetoolid");
    console.log('Mtool=',mtool);
    if (!mtool.isOpen())
        mtool.show();
    
};

window.onload = function() {
    
    // The viewer is optional, just remove the
    const viewer=document.querySelector("#viewer");
    
    // Create an image
    let img=new bisweb.BisWebImage();
    
    // Load an image --> returns a promise so .then()
    img.load("data/MNI_T1_2mm_stripped_ras.nii.gz").then( () => {
        console.log('Image Loaded = ',img.getDescription());
        
        // Set the image to the viewer
        if (viewer)
            viewer.setimage(img);
        
        
        $('#compute').click( () => {
            showmousetool();
        });
    });
};
