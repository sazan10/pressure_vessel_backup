import * as THREE from 'three';
  const Head=(new_radius)=> {
   
    let material = new THREE.MeshPhongMaterial( { color: '#296789', side:THREE.DoubleSide});

//let thickness=0.03;
let radius=parseFloat(new_radius);
//let thickness= parseFloat(thickness1);

// cyl

//sphereMesh.rotateX(3.14/2);

let sphere2 = new THREE.SphereGeometry(radius, 64,64, 0, 6.3, 0, 1.1);
let sphereMesh2 = new THREE.Mesh(sphere2,material);
 
// let sphere = new THREE.SphereGeometry(radius, 64,64, 0, 3.14*2, 0, 1.1);
// let sphereMesh = new THREE.Mesh( sphere, material );
// let sphereCSG = toCSG( sphereMesh ); // converting ThreeJS object to CSG
// let sphere2CSG=toCSG(sphereMesh2);

// //result
// let subtractCSG = sphere2CSG.subtract( sphereCSG );
// let result = fromCSG(subtractCSG); // converting CSG back into ThreeJS object
//  let mesh_test= new THREE.Mesh(result,material);
//  let group = new THREE.Group();
//  group.add(mesh_test);
// group.rotateX(0);

  return sphereMesh2;  
}

export default Head;