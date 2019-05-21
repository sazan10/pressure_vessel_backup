import * as THREE from 'three';
import LiftingLug from '../Parts/LiftingLug';
import keepHeightRecord from '../Scene/keepHeightRecord';
import math from 'mathjs';
const liftingLugRenderer=(component,components,scaler,t,weights,heights)=>
{
    let position = 0;
    let last_cylinder = 0;
    let cyl_diameter = 0;
    let values=[];
    let lug2 , lug1;
    for (let i = 0; i < components.length; i++) {
        if (components[i]) {
            if (components[i].component === "Cylinder" || components[i].component === "Conical") {
                try {
                    position = position + (components[i].length * 12 / scaler);
                    last_cylinder = components[i].componentID;
                    cyl_diameter=(components[i].component === "Cylinder") ? components[last_cylinder].sd / (2 * scaler) : components[last_cylinder].sd_l / (2 * scaler);
                    }
                catch (Exception) {
                      console.log(Exception);
                    }
                  }
                }
              }
              
              let arr= keepHeightRecord(heights,weights,component, -500, 0);
              heights=arr[0];
              weights=arr[1]
              let thickness = component.value.lug_thickness.req_value / scaler;
              let height = component.height_lug / scaler;
              let rad = component.length / scaler;
              let hole_diameter = component.hole_diameter / scaler;
              let angle = component.layout_angle;
              t.color='#500dba';
              let material = new THREE.MeshPhongMaterial(t)
              lug1 = LiftingLug(height, thickness, rad, hole_diameter,material);

              lug1.name = component.componentID + "&" + component.component;
              
              if (component.number === '2') {
                lug2 = LiftingLug(height, thickness, rad, hole_diameter,material);
              }
              if (last_cylinder !== null && components[last_cylinder] !== null) {
                let shell_rad = cyl_diameter + components[last_cylinder].value.thickness / scaler; //finding the diameter of last shell
                let x_displace = (shell_rad) * math.sin(math.pi * (angle / 180));
                let z_displace = (shell_rad) * math.cos(math.pi * (angle / 180));
                lug1.translateX(x_displace).translateZ(-z_displace).translateY(position).rotateY(-(angle / 180) * math.pi); //.translateY(height).translateZ(z_displace);
                if (component.number === '2') {
                  lug2.translateX(-x_displace).translateZ(z_displace).translateY(position).rotateY(-(angle / 180) * math.pi + math.pi);
                }
            
              }
              values=[lug1,lug2,heights,weights,component.component,component.componentID];
return values;
    }
    export default liftingLugRenderer;