import * as THREE from 'three'
import { toCSG, fromCSG } from 'three-2-csg';
  const Saddle=()=> {
   
    var material = new THREE.MeshPhongMaterial({ color: '#037d23', emissive: 0x072534, side: THREE.DoubleSide });


var radius =1;
var extra_length=0.2;
var container=radius*2+extra_length;
var width1 = 0.3;
var extra_height=radius/3;
var base_height=0.1;
var base_width=width1+width1/2;
var base_length=container+0.4;
var height1=radius+extra_height;
var geometry_base = new THREE.BoxGeometry( base_length, base_height, base_width );
var base = new THREE.Mesh( geometry_base, material );
base.translateY(-height1-base_height/2);
var geometry_box = new THREE.BoxGeometry( container, height1, width1 );
var cube = new THREE.Mesh( geometry_box, material );
cube.translateY(-height1/2)
var boxCSG = toCSG( cube); // converting ThreeJS object to CSG

// cyl
var cylinder = new THREE.CylinderGeometry(radius, radius,width1+1, 100 );
var cylinderMesh = new THREE.Mesh( cylinder, material );
cylinderMesh.rotateX(3.14/2);
var cylinderCSG = toCSG( cylinderMesh ); // converting ThreeJS object to CSG
 
//result
var subtractCSG = boxCSG.subtract( cylinderCSG );
var result = fromCSG(subtractCSG); // converting CSG back into ThreeJS object
 var mesh_test= new THREE.Mesh(result,material);
 var group = new THREE.Group();
 group.add(mesh_test);
 group.add(base);

 var cylinder2 = new THREE.CylinderGeometry(radius, radius,width1+2, 100 );
var cylinderMesh2 = new THREE.Mesh(cylinder2, new THREE.MeshPhongMaterial({ color: '#0000dd', emissive: 0x072534, side: THREE.DoubleSide }));

cylinderMesh2.rotateX(3.14/2);
//this.scene.add(cylinderMesh2)
 //this.scene.add( group );
  return group;  
}
export default Saddle;