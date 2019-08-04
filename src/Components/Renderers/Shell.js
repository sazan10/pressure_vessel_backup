import * as THREE from 'three';
import { toCSG, fromCSG } from 'three-2-csg';
let material = new THREE.MeshPhongMaterial({ color: '#037d23', emissive: 0x072534, side: THREE.DoubleSide });
  const Shell=(thickness1,diameter_bot,diameter_top,length1, mat=material)=> {
   
    
let radius_top=parseFloat(diameter_top)/2;
let radius_bot=parseFloat(diameter_bot/2);
let thickness = parseFloat(thickness1);
let length = parseFloat(length1);


// cyl
let cylinder = new THREE.CylinderGeometry(radius_bot, radius_top,length, 80);
let cylinderMesh = new THREE.Mesh( cylinder, mat );


let cylinderCSG = toCSG( cylinderMesh ); // converting ThreeJS object to CSG

let cylinder2 = new THREE.CylinderGeometry(radius_bot+thickness, radius_top+thickness,length, 80 );
let cylinderMesh2 = new THREE.Mesh(cylinder2, mat);
 
let cylinder2CSG=toCSG(cylinderMesh2);
//result
let subtractCSG = cylinder2CSG.subtract( cylinderCSG );
let result = fromCSG(subtractCSG); // converting CSG back into ThreeJS object
 let mesh_test= new THREE.Mesh(result,mat);
 //material.wireframe=true;
 let group = new THREE.Group();
 
 group.add(mesh_test);

//this.scene.add(cylinderMesh2)
 //this.scene.add( group );
  return mesh_test;  
}

export default Shell;