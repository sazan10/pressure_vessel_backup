import * as THREE from 'three'
import { toCSG, fromCSG } from 'three-2-csg';
  const Curve_nozzle =(length_)=> {
    
   
     var material = new THREE.MeshPhongMaterial({ color: '#0b7dba', emissive: 0x072534, side: THREE.DoubleSide });

var length_of_pipe=1;
var length_of_cone=0.4;

var radius_outer_pipe_top=0.2;
var radius_inner_pipe_top=0.15;

var radius_outer_pipe_bottom=0.2;
var radius_inner_pipe_bottom=0.15;

var radius_outer_cone_top=radius_outer_pipe_bottom;
var radius_inner_cone_top=radius_inner_pipe_bottom;

var radius_outer_cone_bottom=0.4;
var radius_inner_cone_bottom=radius_inner_pipe_bottom;
var mesh_ind1=new THREE.Mesh();
var mesh_ind2=new THREE.Mesh();
var mesh_ind3=new THREE.Mesh();
var mesh_ind4=new THREE.Mesh();

var center_of_torus=1;
var length_of_pipe2=0.1;
    //  mesh_ind1=this.create_component(radius_outer_pipe_top,radius_outer_pipe_bottom,radius_inner_pipe_top,radius_inner_pipe_bottom,length_of_pipe,0,0,0,0,0,3.14/2);
      var position_of_cone=length_of_cone/2+center_of_torus;//+0.08;
        mesh_ind2=create_component(radius_outer_cone_top,radius_outer_cone_bottom,radius_inner_cone_top,radius_inner_cone_bottom,length_of_cone,position_of_cone,0,0,0,0,3.14/2);
        var position_of_second_cylinder=position_of_cone+length_of_cone/2;
var extrude_length=0.1;
mesh_ind3=create_flange(radius_outer_cone_bottom+0.15,radius_inner_cone_bottom,extrude_length,position_of_second_cylinder,0,0,0,3.14/2,0);
var position_of_outer_cylinder=position_of_second_cylinder+extrude_length;
var length_of_outer_cylinder=0.1;
mesh_ind4=create_component(0.28,0.28,radius_inner_cone_bottom,radius_inner_cone_bottom,length_of_outer_cylinder,position_of_outer_cylinder,0,0,0,0,3.14/2);


var geometry_torus1 = new THREE.TorusGeometry( center_of_torus, radius_outer_pipe_top, 32, 16,3.14/2 );

var torus = new THREE.Mesh( geometry_torus1, material );
var torusCSG = toCSG( torus ); // converting ThreeJS object to CSG
 
// cyl
var inside_torus = new THREE.TorusGeometry(center_of_torus, radius_inner_pipe_top, 32, 16,3.14/2);
var cylinderMesh = new THREE.Mesh( inside_torus, material );
var torusCSG2 = toCSG( cylinderMesh ); // converting ThreeJS object to CSG
 
//result
var subtract_torusCSG = torusCSG.subtract( torusCSG2 );
var result1 = fromCSG(subtract_torusCSG); // converting CSG back into ThreeJS object

var mesh_test1= new THREE.Mesh(result1,material);

mesh_test1.translateX(center_of_torus).translateY(-center_of_torus).rotateZ(3.14/2);

var group = new THREE.Group();
//group.add( mesh_ind1 );
group.add(mesh_test1);
group.add( mesh_ind2 );
group.add( mesh_ind3 );
group.add( mesh_ind4 );
group.translateX(1).rotateZ(-3.14/2).rotateY(3.14);
return group;

  
}



    const create_component=(outer_upper_rad, outer_lower_rad, inner_upper_rad,inner_lower_rad,length,translateX,translateY,translateZ,rotateX,rotateY,rotateZ)=>
    {
     var material = new THREE.MeshPhongMaterial({ color: '#0b7dba', emissive: 0x072534, side: THREE.DoubleSide });

      //sphere

var cylinder_cone = new THREE.CylinderGeometry(outer_upper_rad,outer_lower_rad,length,100);
var cylinderconeMesh = new THREE.Mesh( cylinder_cone, material );
var coneCSG = toCSG( cylinderconeMesh ); // converting ThreeJS object to CSG
 
// cyl
var cylinder = new THREE.CylinderGeometry(inner_upper_rad, inner_lower_rad, length, 100 );
var cylinderMesh = new THREE.Mesh( cylinder, material );
var cylinderCSG = toCSG( cylinderMesh ); // converting ThreeJS object to CSG
 
//result
var subtractCSG = coneCSG.subtract( cylinderCSG );
var result = fromCSG(subtractCSG); // converting CSG back into ThreeJS object
 var mesh_test= new THREE.Mesh(result,material);
 mesh_test.translateX(translateX).translateY(translateY).translateZ(translateZ).rotateX(rotateX).rotateY(rotateY).rotateZ(rotateZ);
//result.geometry.computeVertexNormals();
 console.log("result",result);
//this.scene.add( mesh_test);
return mesh_test;
    }


const create_flange=(radius_outer,radius_inner,extrude_length,translateX,translateY,translateZ,rotateX,rotateY,rotateZ)=>{
  var material = new THREE.MeshPhongMaterial({ color: '#0b7dba', emissive: 0x072534, side: THREE.DoubleSide });

      var material_extrude = new THREE.MeshPhongMaterial({
        color: '#0b7dba',
        shading: THREE.SmoothShading,
        specular: 0xffffff,
        shininess: 1.0,
      });
      var depth_flange3=0.1;
      var radius_hole3=0.05;
      var radius_central3=0.15;
      var thickness_nozzle_cylinder3=0.05;
      var radius_flange3=0.4
      var extrudeSettings3 = { curveSegments: 50,depth: extrude_length, bevelEnabled: false, bevelSegments: 1, steps: 1, bevelSize: 0, bevelThickness: 0 };
      var extrudeSettings4 = { curveSegments: 50,depth: 1, bevelEnabled: false, bevelSegments: 1, steps: 1, bevelSize: 0, bevelThickness: 0 };
 
     
      var arcShape3 = new THREE.Shape();
      arcShape3.moveTo(0, 0 );
      arcShape3.absarc( 0, 0, radius_outer, 0, Math.PI * 2, false );
      var holePath3 = new THREE.Path();
      holePath3.moveTo( 0, 0 );
 
      holePath3.absarc( (radius_outer-0.2), radius_outer-0.25,radius_hole3, 0, Math.PI * 2, true );
 
      var holePath32 = new THREE.Path();
      holePath32.moveTo( 0, 0 );
      
      holePath32.absarc( radius_outer-0.2, 0.25-radius_outer,radius_hole3, 0, Math.PI * 2, true );
      arcShape3.holes.push(holePath32);
 
 
      var holePath33 = new THREE.Path();
      holePath33.moveTo( 0, 0 );
      
      holePath33.absarc( -(radius_outer-0.2), 0.25-radius_outer,radius_hole3, 0, Math.PI * 2, true );
      arcShape3.holes.push(holePath33);
 
      var holePath34 = new THREE.Path();
      holePath34.moveTo( 0, 0 );
      
      holePath34.absarc( 0, 0,radius_inner, 0, Math.PI * 2, true );
      arcShape3.holes.push(holePath34);
 
      arcShape3.holes.push( holePath3 );
      var holePath35 = new THREE.Path();
      holePath35.moveTo( 0, 0 );
      holePath35.absarc( -(radius_outer-0.2), radius_outer-0.25,radius_hole3, 0, Math.PI * 2, true );
      arcShape3.holes.push(holePath35);

      var geometry_extrude3 = new THREE.ExtrudeGeometry( arcShape3, extrudeSettings3 );
var mesh3 = new THREE.Mesh( geometry_extrude3, material) ;
mesh3.translateX(translateX).translateY(translateY).translateZ(translateZ).rotateX(rotateX).rotateY(rotateY).rotateZ(rotateZ);

//this.scene.add(mesh3);
return mesh3; 

}

export default Curve_nozzle;