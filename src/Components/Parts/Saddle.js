import * as THREE from 'three'
import { toCSG, fromCSG } from 'three-2-csg';
  const Saddle=(radius1=1,width=0.3, base_height1=0.1,base_length_extended1=0.4,angle1=3.14)=> {
   
    let material = new THREE.MeshPhongMaterial({ color: '#abcdef', emissive: 0x072534, side: THREE.DoubleSide });


let radius =parseFloat(radius1);
let extra_length=0.2;
let container=radius*2+extra_length;
let width1 = parseFloat(width);
let extra_height=radius/3;
let base_height=parseFloat(base_height1);
let base_width=width1+width1/2;
let angle=parseFloat(angle1);
let base_length=container+parseFloat(base_length_extended1);
let height1=radius+extra_height;
let geometry_base = new THREE.BoxGeometry( base_length, base_height, base_width );
let base = new THREE.Mesh( geometry_base, material );
base.translateY(-height1-base_height/2);
let geometry_box = new THREE.BoxGeometry( container, height1, width1 );
let cube = new THREE.Mesh( geometry_box, material );
cube.translateY(-height1/2)
let boxCSG = toCSG( cube); // converting ThreeJS object to CSG

let cylinder = new THREE.CylinderGeometry(radius, radius,width1+11, 100,32,false,0,angle);
let cylinderMesh = new THREE.Mesh( cylinder, material );

cylinderMesh.rotateX(3.14/2).rotateY(-angle/2);
let cylinderCSG = toCSG( cylinderMesh ); // converting ThreeJS object to CSG
 
//result
let subtractCSG = boxCSG.subtract( cylinderCSG );
let result = fromCSG(subtractCSG); // converting CSG back into ThreeJS object
 let mesh_test= new THREE.Mesh(result,material);
 let group = new THREE.Group();
 group.add(mesh_test);
 group.add(base);
 //group.add(cylinderMesh);

 let cylinder2 = new THREE.CylinderGeometry(radius, radius,width1+2, 100 );
let cylinderMesh2 = new THREE.Mesh(cylinder2, new THREE.MeshPhongMaterial({ color: '#0000dd', emissive: 0x072534, side: THREE.DoubleSide }));

group.rotateY(3.14/2);
//this.scene.add(cylinderMesh2)
 //this.scene.add( group );
  return group;  
}
export default Saddle;