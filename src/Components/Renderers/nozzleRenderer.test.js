import nozzleRenderer from "./nozzleRenderer";
import * as THREE from 'three';
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



const component2={
    class_value: "150",
    component: "Nozzle",
    componentID: 1,
    componentName: "Nozzle",
    corrosionAllowance: "0.125",
    cylinderDiameter: "10",
    cylinderThickness: "0.125",
    designPressure: "45",
    externalNozzleProjection: "20",
    height: "10",
    internalNozzleProjection: "0",
    material: "SA-516 60",
    nominal_pipe_size: 16,
    nozzleDiameter: "10",
    orientation: "90",
    schedules: "10",
    spec_num: "SA-516",
    temp1: "300",
    type: "blob",
    type_grade: "60",
    type_name: "LWN",
    value: {
    areaAvailable: 0.16426429889298894,
    areaRequired: 0.2938027148128624,
    areaResponse: "Area needs to be increased",
    barrel_outer_diameter: 18,
    base_weight: 246,
    base_weight_length: 12,
    blot_circle_diameter: 21.25,
    blot_hole_number: 16,
    blot_hole_size: 1.12,
    bore: 16,
    flange_outer_diameter: 23.5,
    flange_thickness: 1.44,
    neck_thickness: 1,
    nut_stop_diameter: 19.62,
    raised_face_diameter: 18.5,
    raised_face_thickness: 0.06,
    weight: 0,
    weightTimesCG: 0,
    weight_per_one_inch: 15
}
}
let mat={
    "color": "#0b7dba",
    "emissive": 468276,
    "side": 2,
    "transparent": true,
    "opacity": 1,
    "shininess": 100
  }
  

  let weight={0: [ "Cylinder", 0.48, 1952.38476084217 ]}

  let value=[{0:48},weight,[48],"Nozzle",1]
test('hjj',( )=>{
    expect(nozzleRenderer([component,component2],component2,100,mat,{0:48},weight,[],"vertical")).toEqual(value);
})