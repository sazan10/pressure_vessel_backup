import React, {Component} from 'react';
import * as THREE from 'three'
import * as TrackballControls from 'three-trackballcontrols';
import { toCSG, fromCSG } from 'three-2-csg';
  const Shell=(thickness1,diameter,length1)=> {
   
    var material = new THREE.MeshPhongMaterial({ color: '#037d23', emissive: 0x072534, side: THREE.DoubleSide });
var radius=parseFloat(diameter/2);
var thickness = parseFloat(thickness1);
var length = parseFloat(length1);


// cyl
var cylinder = new THREE.CylinderGeometry(radius, radius,length, 100 );
var cylinderMesh = new THREE.Mesh( cylinder, material );
//cylinderMesh.rotateX(3.14/2);
var cylinderCSG = toCSG( cylinderMesh ); // converting ThreeJS object to CSG

var cylinder2 = new THREE.CylinderGeometry(radius+thickness, radius+thickness,length, 100 );
var cylinderMesh2 = new THREE.Mesh(cylinder2, new THREE.MeshPhongMaterial({ color: '#0000dd', emissive: 0x072534, side: THREE.DoubleSide }));
 
var cylinder2CSG=toCSG(cylinderMesh2);
console.log("thickness:",thickness, "radius:",radius,"length:",length);
//result
var subtractCSG = cylinder2CSG.subtract( cylinderCSG );
var result = fromCSG(subtractCSG); // converting CSG back into ThreeJS object
 var mesh_test= new THREE.Mesh(result,material);
 //material.wireframe=true;
 var group = new THREE.Group();
 
 group.add(mesh_test);


 
group.rotateX(0);
//this.scene.add(cylinderMesh2)
 //this.scene.add( group );
  return group;  
}

export default Shell;