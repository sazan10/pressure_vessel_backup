import math from 'mathjs';
import getClosest from 'get-closest';
import returnKey from '../Scene/returnKey';
// import * as THREE from 'three';

const liftingLugHoriRenderer=(alug1, alug2, components,heights,weights,heights_only_lug,distance1,distance2,angle,scaler,lug_index)=>
{
    let lug1=alug1;
    let lug2=alug2;
    // console.log("lugger renderer",lug1,lug2,index_key1,index_key2,shell_rad1,shell_rad2,overall_CG)

      let key=0;
      let weightsum=0;
      let weightXCG=0;
      let key_value = 0
      heights_only_lug=[];
        for (key in weights) {
              if(weights[key])
              {
              weightsum += weights[key][2];
              weightXCG += weights[key][1] * weights[key][2];
              }
            }
            for (let key in heights) {
              key_value = key;
            }
            for (let i = 0; i < key_value; i++) {
              heights_only_lug.push(-500);
            }
            for (let key in heights) {
              let i = 0;
              if (heights[key]) {
                i = heights[key];
              }
              heights_only_lug[key] = i; //retrieve height only ie values for respective key, here we cannot input nozzle heights , splice adds element to specific position with 0 replacement
            }
            let overall_CG = weightXCG / weightsum;
            let lug1_position=overall_CG-distance1;
            let lug2_position=overall_CG+distance2;
            let closest_index1 = getClosest.number(lug1_position, heights_only_lug);
            let closest_index2=getClosest.number(lug2_position,heights_only_lug);
            let closest_value1 = heights[closest_index1];
            let closest_value2 = heights[closest_index2];
            let index_key1 = returnKey(heights, closest_value1);
            let index_key2 = returnKey(heights, closest_value2);
            let shell_rad1 = components[index_key1].sd /(2*scaler) + components[index_key1].value.thickness/scaler; //finding the diameter of last shell
            let shell_rad2 = components[index_key2].sd /(2*scaler) + components[index_key2].value.thickness/scaler; //finding the diameter of last shell
            let x_displace1 = (shell_rad1) * math.cos(math.pi * (angle / 180));

            let x_displace2 = (shell_rad2) * math.cos(math.pi * (angle / 180));
            let z_displace1 = (shell_rad1) * math.sin(math.pi * (angle / 180));

            let z_displace2 = (shell_rad2) * math.sin(math.pi * (angle / 180));
            //let phi = math.asin((barrel_outer_diameter / 2 / shell_rad));
            //lug1.translateZ(10);
            lug1.translateX(lug1_position).translateZ(-x_displace1).translateY(z_displace1).rotateX((angle / 180) * math.pi - math.pi / 2) //.rotateX(-(angle/180)*math.pi);//.translateY(height).translateZ(z_displace);
            lug1.name=components[lug_index].componentID+ "&"+components[lug_index].component;
            if (lug2) {
              lug2.translateX(lug2_position).translateZ(-x_displace2).translateY(z_displace2).rotateX((angle / 180) * math.pi - math.pi / 2) //.rotateX((-angle/180)*math.pi);
            }
        
        let values=[lug1,lug2,heights,weights,heights_only_lug]
        return values;
    
}
export default liftingLugHoriRenderer;