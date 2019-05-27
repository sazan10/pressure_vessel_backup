import cylinderRenderer from "./cylinderRenderer";
// import * as THREE from 'three';
import Shell from '../Parts/Shell';

const component ={
                component: "Ellipsoidal Head",
                componentID: 1,
                componentName: "Head",
                ep: "15",
                hr: "2:1",
                ic: "0.125",
                ip: 300,
                material: "SA-516 60",
                mht: "1",
                nsrt: "1",
                position: "0",
                sd: 72,
                spec_num: "SA-516",
                srl: "2",
                temp1: 300,
                temp2: "150",
                thickness: 1.125,
                type: "blob",
                type_grade: "60",
                value: {
                    MAWP: 472.04968944099375,
                    MAWPResponse: "the rules of 1- 4(f) are not required",
                    thickness: 1.125,
                    weight: 1187.735651357386,
                }
            }
let mat={
    "color": "#037d23",
    "emissive": 468276,
    "side": 2,
    "transparent": true,
    "opacity": 1,
    "shininess": 100
  }
  

  // const shell = Shell(1.125/100, 72/100, 72/100,8/100 , mat);
// let RingGeometry;
//let value=[0, 0.00775 ,false, 0.48,RingGeometry,shell,{0:0.48},{0:["Cylinder34", 0.48, 1952.38476084217]},"Cylinder",0]
test('hjj',( )=>{
    expect(cylinderRenderer(component,{},{},100,mat,true,0,0,[],"vertical")).toBe(1);
})