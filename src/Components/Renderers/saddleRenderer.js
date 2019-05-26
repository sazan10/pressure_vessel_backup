import math from 'mathjs';
import Saddle from '../Parts/Saddle';
import * as THREE from 'three';
//import keepHeightRecord from '../Scene/keepHeightRecord';
const saddleRenderer=(component,components,scaler,t,last_cylinder)=>{
    t.color='#abcdef';
    let material=new THREE.MeshPhongMaterial(t);
    let saddle = Saddle(components[last_cylinder].sd / (2*scaler) + components[last_cylinder].value.thickness/scaler, component.width/scaler, component.base_height/scaler, component.base_length/scaler, (component.saddle_angle / 180) * math.pi,material);
  // let position = component.position/scaler;
    let distance = component.distance/scaler;
    saddle.translateZ(distance);
    saddle.name=component.componentID+ "&"+component.component;
    let values=[saddle,component.component,component.componentID];
    return values;
}
export default saddleRenderer;