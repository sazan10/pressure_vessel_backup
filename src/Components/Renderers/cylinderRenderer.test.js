import cylinderRenderer from "./cylinderRenderer";
import * as THREE from 'three';
//import Shell from '../Parts/Shell';


const component ={
    component: "Cylinder",
    componentID: 0,
    componentName: "Shell",
    ep: "15",
    ic: "0.125",
    ip: 300,
    length: "8",
    material: "SA-516 60",
    number: "1",
    sd: 72,
    spec_num: "SA-516",
    temp1: 300,
    temp2: "300",
    thickness: 0.775,
    type: "blob",
    type_grade: "60",
    value: {
    thickness: 0.7655141843971631,
    weight: 1952.38476084217}
}

let mat={
    "color": "#037d23",
    "emissive": 468276,
    "side": 2,
    "transparent": true,
    "opacity": 1,
    "shininess": 100
  }
  

  //const shell = Shell(1.125/100, 72/100, 72/100,8/100 , mat);
let RingGeometry;
let value=[0, 0.00775 ,false, 0.48,{0:0.48},{0:["Cylinder", 0.48, 1952.38476084217]},"Cylinder",0]
test('hjj',( )=>{
    expect(nozzleRenderer([component,component2],component2,100,mat,{0:48},0,0,[],"vertical")).toEqual(value);
})