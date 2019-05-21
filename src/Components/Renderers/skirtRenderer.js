import * as THREE from 'three';
import Shell from '../Parts/Shell';
import keepHeightRecord from '../Scene/keepHeightRecord';

const skirtRenderer=(component,scale1,t,heights,weights)=>{
    let scaler=scale1;

    let length = parseFloat(component.length / scaler);
    let sd = parseFloat(component.sd / scaler);
    let thickness = parseFloat(component.thickness / scaler);
    t.color='#CD5C5C';
    let skirt_material = new THREE.MeshPhongMaterial(t);
    let skirt = Shell(thickness, sd+thickness*2, sd+thickness*2, length, skirt_material);
    let skirt_flange_length = length / 4;
    let skirt_flange = Shell(thickness+sd/30, sd+thickness*2 , sd+thickness*2 , skirt_flange_length, skirt_material);
    skirt.translateY(-length/2);
    skirt_flange.translateY(-length-skirt_flange_length / 2);//skirt_flange.translateY(-length - skirt_flange_length / 2);
    let group = new THREE.Group();
    group.add(skirt);
    group.add(skirt_flange);
    group.name = component.componentID + "&" + component.component;
    let cg_skirt = -(length / 2 + 2);
    let arr=keepHeightRecord(heights,weights,component, -500, cg_skirt);
    heights=arr[0];
    weights=arr[1];
    let values=[group,heights,weights,component.component,component.componentID];
    return values;
}
export default skirtRenderer;