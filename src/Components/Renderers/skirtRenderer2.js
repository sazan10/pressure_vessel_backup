import * as THREE from 'three';
import Shell from './Shell';
import keepHeightRecord from '../Scene/keepHeightRecord';

let material = new THREE.MeshPhongMaterial({ color: '#037d23', emissive: 0x072534, side: THREE.DoubleSide });
const skirtRenderer2=(
             component,
             scale,
             t,
             heights,
             weights,
             skirt_top_plate_thickness=(component.sd/20),
             skirt_bottom_length=(component.sd/20),
             skirt_inner_diameter_bottom_plate=(component.sd/2),
             skirt_flange_length_bottom=(component.sd/40),
             gusset_thickness1=(component.sd/20),
             gusset_length1=(component.sd/14),
             gusset_width1=(component.sd/80),
             gap_bet_gusset1=(component.sd/20),
             gusset_number1=8
             )=>{
    let scaler=scale;
    t.color='#CD5C5C';
    let skirt_material = new THREE.MeshPhongMaterial(t);
    let length =component.length/scaler;
    let sd = component.sd/scaler;
    let thickness = component.thickness/scaler;
    let thickness_top_plate=skirt_top_plate_thickness/scaler;
    let skirt_flange_length = skirt_bottom_length/scaler;
    let inner_diameter_bottom_plate=skirt_inner_diameter_bottom_plate/scaler;
    let outer_diameter_bottom_plate=sd+thickness*2+thickness_top_plate*2;
    let skirt_flange_length2=skirt_flange_length_bottom/scaler;
    let gusset_thickness=gusset_thickness1/scaler;
    let gusset_length=gusset_length1/scaler;
    let gusset_width=gusset_width1/scaler;
    let gap_bet__gusset=gap_bet_gusset1/scaler;
    let gusset_number=gusset_number1;

    // t.color='#CD5C5C';
    // let skirt_material = new THREE.MeshPhongMaterial();
    let skirt = Shell(thickness, sd, sd, length, skirt_material);
   
    let skirt_flange = Shell(thickness_top_plate, sd+thickness*2, sd+thickness*2 , skirt_flange_length, skirt_material);
    let skirt_bottom =Shell((outer_diameter_bottom_plate-inner_diameter_bottom_plate)/2, inner_diameter_bottom_plate,inner_diameter_bottom_plate,skirt_flange_length2,skirt_material);
    skirt_bottom.translateY(-length-skirt_flange_length-gusset_length-(skirt_flange_length2/2));
    skirt.translateY(-length/2);



    let pos=(2*Math.PI)/gusset_number;
    // console.log("angle difference",pos, (pos/math.pi)*180)

let gusset_geometry=[];
for(let i=0; i< gusset_number*2;i++)
{
     let gusset = new THREE.BoxGeometry( gusset_width, gusset_length,gusset_thickness,t );
     gusset_geometry.push(new THREE.Mesh( gusset, skirt_material));

}
let group = new THREE.Group();

     let angle =Math.PI/gusset_number;
     let small_angle=Math.atan((gap_bet__gusset/2)/((sd+thickness*2)/2+gusset_width/1.8))
     for (let i =0;i<gusset_number;i++){
       let angle_pos = angle + i*pos;

       let x1 = ((sd+thickness*2)/2+gusset_width/1.5)*Math.sin(angle_pos+small_angle);
       let z1= ((sd+thickness*2)/2+gusset_thickness/1.5)*Math.cos(angle_pos+small_angle);
       let x2= ((sd+thickness*2)/2+gusset_width/1.5)*Math.sin(angle_pos-small_angle);
       let z2= ((sd+thickness*2)/2+gusset_thickness/1.5)*Math.cos(angle_pos-small_angle);
      //  console.log(pos,angle,angle_pos,x1,z1)
       gusset_geometry[i].translateY(-length-skirt_flange_length-gusset_length/2).translateX(x1).translateZ(z1).rotateY(angle_pos);
       gusset_geometry[i+gusset_number].translateY(-length-skirt_flange_length-gusset_length/2).translateX(x2).translateZ(z2).rotateY(angle_pos);
      //  console.log(gusset_geometry[i]);
       group.add(gusset_geometry[i]);
       group.add(gusset_geometry[i+gusset_number]);
     }


    skirt_flange.translateY(-length-skirt_flange_length / 2);//skirt_flange.translateY(-length - skirt_flange_length / 2);
    group.add(skirt);
    group.add(skirt_flange);
  group.add(skirt_bottom);

  group.name = component.componentID + "&" + component.component;
    let cg_skirt = -(length / 2 + 2);
    let arr=keepHeightRecord(heights,weights,component, -500, cg_skirt);
    heights=arr[0];
    weights=arr[1];
    let values=[group,heights,weights,component.component,component.componentID];
    return values;
    // group.name = component.componentID + "&" + component.component;
    // let cg_skirt = -(length / 2 + 2);
    // let arr=keepHeightRecord(heights,weights,component, -500, cg_skirt);
    // let arr=keepHeightRecord(heights,weights,component, -500, cg_skirt);
    // heights=arr[0];
    // weights=arr[1];
    // let values=[group,heights,weights,component.component,component.componentID];

}
export default skirtRenderer2;