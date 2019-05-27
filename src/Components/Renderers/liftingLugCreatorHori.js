import * as THREE from 'three';
import LiftingLug from '../Parts/LiftingLug';
import isEmpty from '../Scene/object_empty';
const liftingLugCreatorHori=(component,weights,scaler,t)=>
{
  let distance1,distance2,lug1,lug2,angle;
try {
    let lug_index=parseInt(component.componentID);
    //keepHeightRecord(component,-500,0);
    // let weightXCG = 0;
    // let weightsum = 0;
    if (!isEmpty(weights)) {
      // let newState = Object.assign([], weights);
      // for (let i = 0; i < newState.length; i++) {
      //   if(newState[i])
      //   {
      //   weightsum += newState[i][2];
      //   weightXCG += newState[i][1] * newState[i][2];
      //   }
      // }
      // let key =0;
      let thickness = component.value.lug_thickness.req_value/scaler;
      let height = component.height_lug/scaler;
      let rad = component.length/scaler;
      let hole_diameter = component.hole_diameter/scaler;
      distance1 = component.lug1_cg_distance/scaler;
      distance2 = component.lug2_cg_distance/scaler;
      angle = component.layout_angle;
      t.color='#500dba';
      let material = new THREE.MeshPhongMaterial(t);
      lug1 = LiftingLug(height, thickness, rad, hole_diameter,material);
     
      if (component.number === '2') {
        lug2 = LiftingLug(height, thickness, rad, hole_diameter,material);
      }
  
    }
    let values=[lug1,lug2,lug_index,distance1,distance2,component.component,component.componentID,angle];
    return values;
  } catch (err) {
    console.log(err);
  }
}

export default liftingLugCreatorHori;