import * as THREE from 'three';
import Shell from '../Parts/Shell';
import keepHeightRecord from '../Scene/keepHeightRecord';
import math from 'mathjs';
import {
    SpheroidHeadBufferGeometry
  } from '../Parts/SpheroidHead_v2';
const ellipseRenderer =(components,component,height,weight,scale1,t,vessel_type)=>
{
    let scaler=scale1;
    let diameter = parseFloat(component.sd) / (2 * scaler);         
     let head_thickness = parseFloat(component.thickness / scaler);
    let head_diameter = parseFloat(component.sd / scaler);
    let ratio = parseFloat(component.hr);
    let minor = diameter / ratio;
    let major = diameter + head_thickness;
    let srl = parseFloat(component.srl / scaler);
    let arr=[];
    if (component.position === '0') {
       let inner_maj = major - head_thickness;
       let head1 = new SpheroidHeadBufferGeometry(major, minor, inner_maj, minor - minor / 3, 400);
       t.color= '#0b7dba';
       let material = new THREE.MeshPhongMaterial(t);
       let flange = Shell(head_thickness, head_diameter, head_diameter, srl, material);
       let head = new THREE.Mesh(head1, material);
       let grouper = new THREE.Group();
       flange.translateY(-srl / 2);
       grouper.add(flange)
       head.translateY(-srl).rotateZ(math.pi);
       grouper.add(head);
       if(vessel_type==="horizontal")
       {
        grouper.rotateZ(-math.pi / 2);

       }
                grouper.name = component.componentID + "&" + "Ellipsoidal Head";
                let cg_head = -(4 * minor) / (3 * math.pi)
                 arr =keepHeightRecord(height,weight,component, -500, cg_head);
                let values=[grouper,arr[0],arr[1],component.component,component.componentID];
                 return values;
              } else {
                let head1 = new SpheroidHeadBufferGeometry(major, minor, major - head_thickness, minor - head_thickness, 400);
                t.color='#0b7dba';
                let material = new THREE.MeshPhongMaterial(t);
                let head = new THREE.Mesh(head1, material);
                let grouper2 = new THREE.Group();
                let flange2 = Shell(head_thickness, head_diameter, head_diameter, srl, material);
                head.translateY(srl / 2);
                grouper2.add(flange2);
                grouper2.add(head);
                let height_for_top = 0;
                for (let i = 0; i < components.length; i++) {
                  if (components[i]) {
                    if (components[i].length && (components[i].component === "Cylinder" || components[i].component === "Conical")) {
                      height_for_top = height_for_top + parseFloat(components[i].length) * (12 / scaler);
                    }
                  }
                }
                let cg_head = height_for_top + (4 * minor) / (3 * math.pi);
                let arr =keepHeightRecord(height,weight,component, -500, cg_head);
                let values=[grouper2,arr[0],arr[1],component.component,component.componentID];
                if(vessel_type==="vertical")
                {
                  grouper2.translateY(height_for_top+srl/2);
                }
                else 
                {
                  grouper2.translateX(height_for_top+srl/2).rotateZ(-math.pi / 2);
                }
                grouper2.name = component.componentID + "&" + component.component;
                return values;

              }
            }

export default ellipseRenderer;