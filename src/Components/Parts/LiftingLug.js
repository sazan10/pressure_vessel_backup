import * as THREE from 'three'
import { toCSG, fromCSG } from 'three-2-csg';
import * as math from 'mathjs';
const LiftingLug=(height1=10,width1=5,radius1=5,hole_radius1=2)=> {
    
let material=new THREE.MeshPhongMaterial({ color: '#0b7dba', emissive: 0x072534, side: THREE.DoubleSide });;

let hole_radius=parseFloat(hole_radius1)
;
let x =0;
let y=0;
let radius=parseFloat(radius1);
let height=parseFloat(height1);
let width=parseFloat(width1);
let squareShape = new THREE.Shape();
let bevelthick=0;//0.5*radius*0.2;
let bevsize=0;//0.25*radius*0.2
// squareShape.moveTo( x, y + radius );
// squareShape.lineTo( x, y + height - radius );
// squareShape.quadraticCurveTo( x, y + height, x + radius, y + height );



// squareShape.lineTo( x + width - radius, y + height );
//squareShape.quadraticCurveTo( x + radius, y + height, x + 2*radius, y + height - radius );
//squareShape.lineTo(-1,-1);
squareShape.moveTo(0,0);
squareShape.absarc( 0, 0, radius,math.pi,math.pi*2, false );
squareShape.lineTo(radius,height);
squareShape.lineTo(-radius,height);
squareShape.lineTo(-radius,0)
squareShape.lineTo(0,0);


// squareShape.lineTo( x + width, y + radius );
// squareShape.quadraticCurveTo( x + width, y, x + width - radius, y );
// squareShape.lineTo( x + radius, y );
// squareShape.quadraticCurveTo( x, y, x, y + radius );
        
        
        let extrudeSettings4 = { depth: width, bevelEnabled: false, bevelSegments: 12, steps: 1, bevelSize: bevsize, bevelThickness: bevelthick };

        let geometry_extrude3 = new THREE.ExtrudeGeometry( squareShape, extrudeSettings4 );
        //geometry_extrude3.computeFaceNormals();
        console.log("ddd");
        
         let mesh3 = new THREE.Mesh( geometry_extrude3, material);



         let coneCSG = toCSG( mesh3 ); // converting ThreeJS object to CSG
 
         // cyl
	let hole_length=width+bevelthick*2+bevsize/2; 
         let cylinder = new THREE.CylinderGeometry(hole_radius, hole_radius,hole_length , 32 );
         let cylinderMesh = new THREE.Mesh( cylinder, material );
         cylinderMesh.translateZ(width/2).rotateX(math.pi/2);
         let cylinderCSG = toCSG( cylinderMesh ); // converting ThreeJS object to CSG
          
         //result
         let subtractCSG = coneCSG.subtract( cylinderCSG );
         let result = fromCSG(subtractCSG); // converting CSG back into ThreeJS object
          let mesh_test= new THREE.Mesh(result,material);
          
mesh_test.rotateX(math.pi).translateY(-(height+bevsize)).translateZ(bevelthick);
        // material.wireframe=true;
let group =new THREE.Group();
group.add(mesh_test);
return group;
//this.create_component(radius_outer_pipe_top,radius_outer_pipe_bottom,radius_inner_pipe_top,radius_inner_pipe_bottom,length_of_pipe2,0,0,0,0,0,3.14/2);

  // this.scene.add(pointclod);
 
 
}


 
 export default LiftingLug;
 //module.exports= ThreeScene;