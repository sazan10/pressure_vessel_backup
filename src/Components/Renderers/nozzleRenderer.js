import * as THREE from 'three';
import Standard_nozzle from '../Parts/Standard_nozzle';
import keepHeightRecord from '../Scene/keepHeightRecord';
import returnKey from '../Scene/returnKey';
import math from 'mathjs';
import getClosest from 'get-closest';



const nozzleRenderer=(components,component,scale1,t,heights,weights,heights_only,vessel_type)=>{
    let scaler=scale1;
    let length = component.externalNozzleProjection / scaler;
    let orientation = component.orientation;
    t.color='#0b7dba';
    let nozzle_material = new THREE.MeshPhongMaterial(t);
    let orientation_in_rad = (orientation / 180) * math.pi;
    let nozzle_height = component.height * (12 / scaler);
    heights_only = [];
    let nozzle = new THREE.Mesh();
    let key_value = 0

    for (let key in heights) {
      key_value = key;
    }
    for (let i = 0; i < key_value; i++) {
      heights_only.push(-500);
    }
    for (let key in heights) {
      let i = 0;
      if (heights[key]) {
        i = heights[key];
      }
      heights_only[key] = i; //retrieve height only ie values for respective key, here we cannot input nozzle heights , splice adds element to specific position with 0 replacement
    }
    let closest_index = getClosest.number(nozzle_height, heights_only);

    let closest_value = heights[closest_index];
    let index_key = returnKey(heights, closest_value);

    let barrel_outer_diameter = component.value.barrel_outer_diameter / scaler;
    let bolt_circle_diameter = component.value.blot_circle_diameter / scaler;
    let bolt_hole_number = component.value.blot_hole_number;
    let bolt_hole_size = component.value.blot_hole_size / scaler;
    let bore = component.value.bore / scaler;
    let flange_outer_diameter = component.value.flange_outer_diameter / scaler;
    let flange_thickness = component.value.flange_thickness / scaler;
    let raised_face_diameter = component.value.raised_face_diameter / scaler;
    let raised_face_thickness = component.value.raised_face_thickness / scaler;
    if (components[index_key]) {
      let x_displace;
      if (components[index_key].component === "Cylinder") {
        let shell_rad = parseFloat(components[index_key].sd) / (2 * scaler);
        let phi = math.asin((barrel_outer_diameter / 2 / shell_rad));
        x_displace = (shell_rad) * math.cos(phi);
        nozzle = Standard_nozzle(length, 0, barrel_outer_diameter, bore, 0, flange_outer_diameter, raised_face_diameter, raised_face_thickness, flange_thickness, bolt_hole_number, bolt_circle_diameter, bolt_hole_size, nozzle_material);
        nozzle.name = component.componentID + "&" + component.component;
      } else if (components[index_key].component === "Conical") {
        let rad_bot = components[index_key].sd_s / (2 * scaler);
        let rad_top = components[index_key].sd_l / (2 * scaler);
        let height_of_cone = components[index_key].length * (12 / scaler);
        let diff = rad_top - rad_bot;
        let pos_of_noz = 0;
        let noz = 0;
        //checking if nozzle is required for the first cylinder or other, cause for first it will be equal to nozzle height, but for others the height is from the origin, but we need the height only from the corresponding cylinder 
        noz= (index_key >= 0) ? nozzle_height - (heights_only[index_key] - height_of_cone / 2):nozzle_height;
        //check if is positive to check position of nozzle below or above the height of corresponding cylinder
        pos_of_noz =(diff >= 0) ? rad_bot + ((noz / (height_of_cone)) * diff): rad_bot - (((noz / height_of_cone)) * math.abs(diff));
        let phi = math.asin((barrel_outer_diameter / 2 / pos_of_noz)); //calculating angle wrt to centre
        x_displace = (pos_of_noz) * math.cos(phi);
        nozzle = Standard_nozzle(length, 0, barrel_outer_diameter, bore, 0, flange_outer_diameter, raised_face_diameter, raised_face_thickness, flange_thickness, bolt_hole_number, bolt_circle_diameter, bolt_hole_size);
        nozzle.name = component.componentID + "&" + component.component;
      }
      if(vessel_type==="vertical")
      {
        nozzle.translateZ(-x_displace * math.cos(orientation_in_rad)).translateX(x_displace * math.sin(orientation_in_rad)).translateY(nozzle_height).rotateY(math.PI / 2 - orientation_in_rad);
      }
      else{
        nozzle.translateZ(-x_displace * math.cos(orientation_in_rad)).translateY(x_displace * math.sin(orientation_in_rad)).translateX(nozzle_height).rotateX(orientation_in_rad).rotateY(math.PI / 2);
      }
    }
    let arr=keepHeightRecord(heights,weights,component, -500, 0);
    let values=[nozzle,arr[0],arr[1],heights_only,component.component,component.componentID];

    return values;
}

export default nozzleRenderer;