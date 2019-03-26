import * as THREE from 'three'
import { toCSG, fromCSG } from 'three-2-csg';
  const Saddle=()=> {
   
    let material = new THREE.MeshPhongMaterial({ color: '#037d23', emissive: 0x072534, side: THREE.DoubleSide });


let radius =1;
let extra_length=0.2;
let container=radius*2+extra_length;
let width1 = 0.3;
let extra_height=radius/3;
let base_height=0.1;
let base_width=width1+width1/2;
let base_length=container+0.4;
let height1=radius+extra_height;
let geometry_base = new THREE.BoxGeometry( base_length, base_height, base_width );
let base = new THREE.Mesh( geometry_base, material );
base.translateY(-height1-base_height/2);
let geometry_box = new THREE.BoxGeometry( container, height1, width1 );
let cube = new THREE.Mesh( geometry_box, material );
cube.translateY(-height1/2)
let boxCSG = toCSG( cube); // converting ThreeJS object to CSG

// cyl
let cylinder = new THREE.CylinderGeometry(radius, radius,width1+1, 100 );
let cylinderMesh = new THREE.Mesh( cylinder, material );
cylinderMesh.rotateX(3.14/2);
let cylinderCSG = toCSG( cylinderMesh ); // converting ThreeJS object to CSG
 
//result
let subtractCSG = boxCSG.subtract( cylinderCSG );
let result = fromCSG(subtractCSG); // converting CSG back into ThreeJS object
 let mesh_test= new THREE.Mesh(result,material);
 let group = new THREE.Group();
 group.add(mesh_test);
 group.add(base);

 let cylinder2 = new THREE.CylinderGeometry(radius, radius,width1+2, 100 );
let cylinderMesh2 = new THREE.Mesh(cylinder2, new THREE.MeshPhongMaterial({ color: '#0000dd', emissive: 0x072534, side: THREE.DoubleSide }));

cylinderMesh2.rotateX(3.14/2);
//this.scene.add(cylinderMesh2)
 //this.scene.add( group );
  return group;  
}
export default Saddle;