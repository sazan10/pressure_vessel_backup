import ellipseRenderer from "./ellipseRenderer";
import * as THREE from 'three';
import Shell from '../Parts/SpheroidHead_v2';

const component ={
    component: "Ellipsoidal Head",
    componentID: 20,
    componentName: "4",
    ep: "15",
    hr: "2:1",
    ic: "0.125",
    ip: 300,
    length: "8",
    material: "SA-516 60",
    mht: "1",
    nsrt: "1",
    position: "1",
    sd: "72",
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
    weight: 1187.735651357386}
}
let mat={
    "color": "#037d23",
    "emissive": 468276,
    "side": 2,
    "transparent": true,
    "opacity": 1,
    "shininess": 100
  }
  let mat1={
    color: "#0b7dba",
    emissive: 468276,
    opacity: 1,
    shininess: 100,
    side: 2,
    transparent: true
  }
  const component_i={20:[["Ellipsoidal Head",-0.07639437268410976,1187.735651357386]]};
 // const shell = Shell(1.125/100, 72/100, 72/100,8/100 , mat);
let RingGeometry;
let value= [{"20": -500}, {"20": ["Ellipsoidal Head", 0.07639437268410976, 1187.735651357386]}, "Ellipsoidal Head", 20];
test('hjj',( )=>{
    expect(ellipseRenderer([{},component],component,{},{},100,mat,"vertical")).toEqual(value);
})