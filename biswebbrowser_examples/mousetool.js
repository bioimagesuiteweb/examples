"use strict";

/* global window,document,$ */

// Get access to bisweb export object 
const bisweb=window.bioimagesuiteweb;
const BisWebPanel = bisweb.biswebpanel;
const bisCrossHair=bisweb.CrossHair;

class MouseToolElement extends HTMLElement {


    constructor() {
        super();
        this.imageinfo=null;
        this.textnode=null;
        this.panel=null;
        this.orthoviewer=null;
        this.image=null;
        this.subviewers=[];
        this.cursormeshes=null;
    }
    
    /** Called by OrthoViewer when the image changes */
    /** initialize (or reinitialize landmark control). Called from viewer when image changes. This actually creates (or recreates the GUI) as well.(This implements a function from the {@link BisMouseObserver} interface.)
     * @param {BisWebSubViewer} subviewers[] - subviewers to place info in
     * @param {BisImage} volume - new image
     */
    initialize(subviewers,volume) {

        this.image=volume;
        this.subviewers=subviewers;
        this.updateimageinfo();
        this.createcursormeshes();
     
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
        if (!this.image)
            return;

        let spa=this.image.getSpacing();
        let voxcoord=[0,0,0,0]; // 4D
        for (let i=0;i<=2;i++) {
            voxcoord[i]=mm[i]/spa[i];
        }

        let val=this.image.getVoxel(voxcoord)
        
        this.textnode.append($('<PRE> mm='+mm.join(' ')+', intensity='+val+'</PRE>'));
        if (mousestate===2)
            this.drawcursor(mm);
    }

    /** draw cursor at position = mm */
    drawcursor(mm) {
        
        if (this.cursormeshes===null)
            return;
        
        this.cursormeshes.forEach( (e) => {
            e.position.set(mm[0],mm[1],mm[2]);
            e.visible=true;
        });


    }


    /** create meshes for the cursor. */
    createcursormeshes() {

        let sz=this.image.getImageSize();
        let spa=this.image.getSpacing();
        let wd= sz[0] * 0.1;
        let thk=spa[0]*0.8;
        let core=bisCrossHair.createcore(wd,thk,true,wd*0.2);
        let cursorgeom=new THREE.BufferGeometry();
        cursorgeom.setIndex(new THREE.BufferAttribute( core.indices, 1 ) );
        if (THREE['REVISION']<101) {
            cursorgeom.addAttribute( 'position', new THREE.BufferAttribute( core.vertices, 3 ) );
        } else {
            cursorgeom.setAttribute( 'position', new THREE.BufferAttribute( core.vertices, 3 ) );
        }

        this.cursormeshes=new Array(this.subviewers.length);
        
        let gmat=new THREE.MeshBasicMaterial( {
            wireframe : true,
            color: 0xff8800, 
        } );

        for (let i=0;i<this.subviewers.length;i++) {
            this.cursormeshes[i]=new THREE.Mesh(cursorgeom, gmat);
            this.cursormeshes[i].visible=false;
            this.subviewers[i].getScene().add(this.cursormeshes[i]);
        }
    }

    /** function to call when element is added to DOM  */
    connectedCallback() {

        let viewerid=this.getAttribute('bis-viewerid');
        let layoutid=this.getAttribute('bis-layoutwidgetid');
        
        let layoutcontroller=document.querySelector(layoutid);
        this.panel=new BisWebPanel(layoutcontroller,
                                   {  name  : 'Mouse Tool',
                                      permanent : false,
                                      width : '350',
                                   });
        this.parentDomElement=this.panel.getWidget();
        this.imageinfo=$("<div>No Image</div>");
        this.textnode=$("<div>No Coordinates</div>");

        this.parentDomElement.append(this.imageinfo);
        this.parentDomElement.append(this.textnode);
        
        this.orthoviewer=document.querySelector(viewerid);
        this.orthoviewer.addMouseObserver(this);
        this.show();
    }
                                
    /** show the panel in the dock */
    show() {
        if (this.panel)
            this.panel.show();
    }

    /** is the  panel open */
    isOpen() {
        if (this.panel)
            return this.panel.isOpen();
        return false;
    }
    

}

// Register element
window.customElements.define('bisweb-mousetool', MouseToolElement);





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
