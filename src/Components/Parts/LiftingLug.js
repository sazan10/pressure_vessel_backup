import * as THREE from 'three'
import { toCSG, fromCSG } from 'three-2-csg';


const LiftingLug=()=> {
    
var material=new THREE.MeshPhongMaterial({ color: '#0b7dba', emissive: 0x072534, side: THREE.DoubleSide });;
var center_of_torus=1;
var length_of_pipe2=0.1;
var sqLength=4;

var x =0;
var y=0;
var radius=2;
var height=15;
var width=5;
var squareShape = new THREE.Shape();
// squareShape.moveTo( x, y + radius );
// squareShape.lineTo( x, y + height - radius );
// squareShape.quadraticCurveTo( x, y + height, x + radius, y + height );



// squareShape.lineTo( x + width - radius, y + height );
//squareShape.quadraticCurveTo( x + radius, y + height, x + 2*radius, y + height - radius );
//squareShape.lineTo(-1,-1);
squareShape.moveTo(0,0);
squareShape.absarc( 0, 0, 2,3.14,3.14*2, false );
squareShape.lineTo(2,5);
squareShape.lineTo(-2,5);
squareShape.lineTo(-2,0)
squareShape.lineTo(0,0);


// squareShape.lineTo( x + width, y + radius );
// squareShape.quadraticCurveTo( x + width, y, x + width - radius, y );
// squareShape.lineTo( x + radius, y );
// squareShape.quadraticCurveTo( x, y, x, y + radius );
        
        
        var extrudeSettings4 = { curveSegments: 50,depth: 0.5, bevelEnabled: true, bevelSegments: 12, steps: 1, bevelSize: 0.25, bevelThickness: 0.5 };

        var geometry_extrude3 = new THREE.ExtrudeGeometry( squareShape, extrudeSettings4 );
        //geometry_extrude3.computeFaceNormals();
        console.log("ddd");
        
         var mesh3 = new THREE.Mesh( geometry_extrude3, material);



         var coneCSG = toCSG( mesh3 ); // converting ThreeJS object to CSG
 
         // cyl
         var cylinder = new THREE.CylinderGeometry(0.4, 0.4, 10, 100 );
         var cylinderMesh = new THREE.Mesh( cylinder, material );
         cylinderMesh.rotateX(3.14/2);
         var cylinderCSG = toCSG( cylinderMesh ); // converting ThreeJS object to CSG
          
         //result
         var subtractCSG = coneCSG.subtract( cylinderCSG );
         var result = fromCSG(subtractCSG); // converting CSG back into ThreeJS object
          var mesh_test= new THREE.Mesh(result,material);
          
mesh_test.rotateX(3.14).translateY(-(5+0.25));
        // material.wireframe=true;
return mesh_test;
//this.create_component(radius_outer_pipe_top,radius_outer_pipe_bottom,radius_inner_pipe_top,radius_inner_pipe_bottom,length_of_pipe2,0,0,0,0,0,3.14/2);

  // this.scene.add(pointclod);
 
 
}




  
 export default LiftingLug;
 //module.exports= ThreeScene;