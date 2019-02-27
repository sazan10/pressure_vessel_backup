import * as THREE from 'three';
import math from 'mathjs';
  const Head=(new_radius)=> {
   
    var material = new THREE.MeshPhongMaterial( { color: '#296789', side:THREE.DoubleSide});

//var thickness=0.03;
var radius=parseFloat(new_radius);
//var thickness= parseFloat(thickness1);

// cyl

//sphereMesh.rotateX(3.14/2);

var sphere2 = new THREE.SphereGeometry(radius, 64,64, 0, 6.3, 0, 1.1);
var sphereMesh2 = new THREE.Mesh(sphere2,material);
 
// var sphere = new THREE.SphereGeometry(radius, 64,64, 0, 3.14*2, 0, 1.1);
// var sphereMesh = new THREE.Mesh( sphere, material );
// var sphereCSG = toCSG( sphereMesh ); // converting ThreeJS object to CSG
// var sphere2CSG=toCSG(sphereMesh2);

// //result
// var subtractCSG = sphere2CSG.subtract( sphereCSG );
// var result = fromCSG(subtractCSG); // converting CSG back into ThreeJS object
//  var mesh_test= new THREE.Mesh(result,material);
//  var group = new THREE.Group();
//  group.add(mesh_test);
// group.rotateX(0);

  return sphereMesh2;  
}

export default Head;