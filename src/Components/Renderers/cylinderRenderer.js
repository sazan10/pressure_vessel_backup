import * as THREE from 'three';
import Shell from '../Parts/Shell';
import keepHeightRecord from '../Scene/keepHeightRecord';
import math from 'mathjs';
const cylinderRenderer =(component,height,weight,scale1,t,first_shell1,height_position1,cylinder_iterator,cylinder_lengths,vessel_type)=>
{  
	let first_shell=first_shell1;
	let scaler=scale1;
	let height_position=height_position1;
    let thickness=0;
    let ringgeometry;
    let shell = new THREE.Mesh();
    let arr=[];
    let cylinder_length=0;
    let diameter_bot = 0;
    console.log("d");
                let diameter_top = 0;
                let diameter = 0;
              if (component.component === "Cylinder") {
                diameter_bot = parseFloat(component.sd / scaler);
                diameter_top = diameter_bot;
              } else {
                diameter_bot = parseFloat(component.sd_l / scaler);
                diameter_top = parseFloat(component.sd_s) / scaler;
              }
              cylinder_length = parseFloat(component.length) * (12 / scaler);
              cylinder_lengths.push(cylinder_length);
             // let number = parseFloat(this.props.component[i].number);
              thickness = parseFloat(component.thickness / scaler);
              
              t.color='#037d23';
              let shell_material = new THREE.MeshPhongMaterial(t);
              shell = Shell(thickness, diameter_bot, diameter_top, cylinder_length, shell_material);
              shell.name = component.componentID + "&" + component.component;
              if (first_shell) {
                height_position = height_position + cylinder_length / 2;
                 arr =keepHeightRecord(height,weight,component, height_position,height_position);
                first_shell = false;
              } else {
                t.color='#ffff00'
                let ringmaterial = new THREE.MeshPhongMaterial(t);
                diameter = (parseFloat(component.sd / scaler) + parseFloat(component.thickness / scaler)) || (parseFloat(component.sd_s / scaler) + parseFloat(component.thickness / scaler));
                ringgeometry = Shell(diameter / 110, diameter, diameter, diameter / 110, ringmaterial);
                let lengths = component.length * (12 / scaler); //length of current cylinder
                height_position = height_position + cylinder_lengths[cylinder_iterator - 1] / 2 + lengths / 2; //update height position 
                 arr = keepHeightRecord(height,weight,component, height_position, height_position);
              }
             //this.height_position);  
              switch(vessel_type)
              {
                case "vertical":
                {
                  if(ringgeometry)
                  {
                    ringgeometry.translateY(height_position - cylinder_length / 2);
                  }
                  shell.translateY(height_position);
                  break;
                }
                case "horizontal":
                 {
                   if(ringgeometry)
                   {
                    ringgeometry.translateX(height_position - cylinder_length / 2).rotateZ(-math.pi / 2);
                   }
                    shell.translateX(height_position).rotateZ(-math.pi / 2);
                  break;
                 }
                 default:
                  break;

              }


              
// console.log("values must be ",diameter,thickness,first_shell,height_position,arr[0],arr[1],component.component,component.componentID);
              let values=[ diameter, thickness,first_shell,height_position,ringgeometry,shell,arr[0],arr[1],component.component,component.componentID];
return values;
        }
        
export default cylinderRenderer;