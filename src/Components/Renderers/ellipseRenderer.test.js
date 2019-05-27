import ellipseRenderer from "./ellipseRenderer";
// import * as THREE from 'three';
// import Shell from '../Parts/SpheroidHead_v2';

const component ={
    component: "Ellipsoidal Head",
    componentID: 30,
    componentName: "4",
    ep: "15",
    hr: "2:1",
    ic: "0.125",
    ip: 300,
    length: "8",
    material: "SA-516 60",
    mht: "1",
    nsrt: "1",
    position: "0",
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
  // let mat1={
  //   color: "#0b7dba",
  //   emissive: 468276,
  //   opacity: 1,
  //   shininess: 100,
  //   side: 2,
  //   transparent: true
  // }
  const component_i={1:[["Ellipsoidal Head",-0.07639437268410976,1187.735651357386]]};
  // const shell = Shell(1.125/100, 72/100, 72/100,8/100 , mat);
// let RingGeometry;
//let value=[0, 0.00775 ,false, 0.48,RingGeometry,shell,{0:0.48},{0:["Cylinder34", 0.48, 1952.38476084217]},"Cylinder",0]
test('hjj',( )=>{
    expect(ellipseRenderer([{},component],component,{},{component_i},100,mat,"vertical")).toBe({1:0.5});
})