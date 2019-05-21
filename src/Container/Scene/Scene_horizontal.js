import React, {
  Component
} from 'react';
import * as THREE from 'three'
import * as TrackballControls from 'three-trackballcontrols';
import * as actions from '../../store/actions/index';
import Shell from '../../Components/Parts/Shell';
import Curve_nozzle from '../../Components/Parts/Curve_nozzle';
import Saddle from '../../Components/Parts/Saddle';
import LiftingLug from '../../Components/Parts/LiftingLug';
import Standard_nozzle from '../../Components/Parts/Standard_nozzle';
import comparator from '../../Components/Scene/comparator';
import math from 'mathjs';
import height_checker from '../../Components/Scene/height_checker';
import getClosest from 'get-closest';
import cylinderRenderer from '../../Components/Renderers/cylinderRenderer';

import returnKey from '../../Components/Scene/returnKey';
import isEmpty from '../../Components/Scene/object_empty';
import objecSize from '../../Components/Scene/object_size';
import {
  connect
} from 'react-redux';
import {
  SpheroidHeadBufferGeometry
} from '../../Components/Parts/SpheroidHead_v2';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

class Scene_horizontal extends Component {
  state = {
    current: {},
  };
  componentDidMount() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    //ADD CAMERA
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0x696969 );
    this.camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );
    this.camera.position.z = 4;
    //ADD SCENE
    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.mount.appendChild(this.renderer.domElement);
    document.getElementById("scener").addEventListener('mouseup', this.onDocumentMouseDown, false);
    this.group = new THREE.Group();
    //ADD CUBE
    this.controls = new TrackballControls(this.camera, this.renderer.domElement);
    this.controlSetup();
    this.shapes = [];
    let ambient = new THREE.AmbientLight(0xbbbbbb);
    this.scene.add(ambient);
    window.addEventListener('resize', this.onWindowResize, false);
    let directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 0, 1000);
    this.scene.add(directionalLight);
    let directionalLight2 = new THREE.DirectionalLight(0xffffff);
    directionalLight2.position.set(0, 0, -1000);
    this.scene.add(directionalLight2);

    this.material = new THREE.MeshPhongMaterial({
      color: '#0b7dba',
      emissive: 0x072534,
    });
    this.head_no = 0;
    this.radial_position = 0;
    this.axesHelper = new THREE.AxesHelper(1000);
    this.scene.add(this.axesHelper);
    this.shell_diameter = 0;
    this.length = 0;
    this.heights = {};
    this.weights = {};
    this.weight_permanent={};
    this.name=null;
    this.compID=null;
    this.heights_only = [];
    this.heights_only_lug = [];
    this.controls.update();
    this.start();
  }
  onDocumentMouseDown = (event) => {  
    var raycaster = new THREE.Raycaster(); // create once
    var mouse = new THREE.Vector2(); // create once
    let rect = document.getElementById("scener").getBoundingClientRect();
    mouse.x = (event.clientX - rect.left) / window.innerWidth * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / window.innerHeight)* 2 + 1;
    raycaster.setFromCamera( mouse, this.camera );
    if (this.shapes.length >= 1) {
     // let intersects = raycaster.intersectObjects(this.shapes, true);
    var intersects = raycaster.intersectObjects( this.shapes, true);
      if (intersects.length > 0) {
       // console.log("intersect",intersects);
        intersects[0].object.material.transparent = true;
        try {
          const sh = [...this.shapes];
          sh.map((shape) => {
            let sh_name = shape.name.split("&");
            if (sh_name[1] === "Cylinder" || sh_name[1] === "Conical") {
              shape.material.opacity = 1;
            } else {
              shape.children.map((child) => {
                child.material.opacity = 1;
                return 0;
              })
            }
            return 0;
          });
        } catch (e) {
          console.log(e)
        }
        if (intersects[0].object.material.opacity === 0.5) {
          
          intersects[0].object.material.opacity = 1;
        } else {
          intersects[0].object.material.opacity = 0.5;
        }
 
        let name=null;
        if(intersects[0].object.parent.name)
        {
          name=intersects[0].object.parent.name;
        }
        else{            
          name=intersects[0].object.name;
        }
        let res=null;
        if(name){
        res=name.split("&");
        this.name = res[1];
        this.compoID=res[0];
        this.props.updateSelectedComponentID(parseInt(res[0]));
        this.props.treeUpdate(false);
        this.props.modelImport(res[1],1);
        this.props.returnComponentID(parseInt(res[0]));
        this.props.componentClicked(true);
        }
        else{
          res=[-1,"noComponent"]
        }
      }
      else {
        this.props.displayComponentTree(true);
      }
    }
    this.controls.update();
  }
  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  componentWillReceiveProps(nextProps) {

  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.view !== this.props.view) {
      this.controls.reset();
    switch (this.props.view){
      case "SIDE":
        this.camera.position.set(10, 0, 0);
        break;
      case "FRONT":
        this.camera.position.set(0, 0, 10);
        break;
      case "TOP":
        this.camera.position.set(0.0001, 10, 0);
        break;
      
    }
    this.camera.updateProjectionMatrix();
    this.controlSetup();
    this.controls.update();
  }
  }

  clearScene = () => {
    for (let i = this.scene.children.length - 1; i >= 0; i--) {
      const object = this.scene.children[i];
      if (object.type === "Mesh" || object.type === "Group") {
        this.scene.remove(object);
      }
    }
  }

  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    }
  }

  stop = () => {
    cancelAnimationFrame(this.frameId);
  }

  animate = () => {
    this.controls.update();
    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  }

  return_children = (object) => {
    return object.children;
  }


  renderScene = () => {
    this.renderer.render(this.scene, this.camera);
  }
  render() {
    try {
      let scaler=100;
      this.shapes = [];
      let first_shell = true;
      let height_position = 0;
      this.heights = {};
      this.weights = {};
      let cylinder_iterator = 0;
      let cylinder_lengths = [];
      let last_cylinder = null;
      let lug_index=null;
      let t={  color: '#037d23',
      emissive: 0x072534,
      side: THREE.DoubleSide,
      transparent:true,
      opacity:1,
      shininess:100
    };
    let lug1=null;
    let lug2 = null;
    let height=0,angle=0,distance1=0,distance2=0;
      if (this.scene) {
        if (this.scene.children) {
          this.clearScene();
        }
      }
      if (this.props.component.length >= 0 && this.scene) {
        for (let i = 0; i < this.props.component.length; i++) {

          if(!isEmpty(this.props.component[i]))
          {
            if(this.name===this.props.component[i].component.toString() && this.compoID==this.props.component[i].componentID.toString()){
              t.opacity=0.5;
            }
            else{
              t.opacity=1;
            }
            switch (this.props.component[i].component)
            {
              case "Cylinder":
              case "Conical":
            {
              let values = cylinderRenderer(this.props.component[i], 
                                            this.heights,
                                            this.weights,
                                            scaler,
                                            t,
                                            first_shell,
                                            height_position,
                                            cylinder_iterator,
                                            cylinder_lengths,
                                            "horizontal");
              first_shell=values[2];
              height_position=values[3];
              let shell= values[5]
              let ringgeometry=values[4]
              this.heights=values[6]
              this.weights=values[7]
              if(ringgeometry)
              {
              this.scene.add(ringgeometry)
              }
              cylinder_iterator = cylinder_iterator + 1;
              this.radial_position = values[0] / 2 + values[1]; 
              if(shell)
              {
              this.scene.add(shell)
              shell.name = values[9]+ "&" + values[8];
              this.shapes.push(shell);  
              }       
              last_cylinder = i;
            break;}        
              case "Ellipsoidal Head":
          {
            let diameter = parseFloat(this.props.component[i].sd) / (2*scaler);
            let head_thickness = parseFloat(this.props.component[i].thickness/scaler);
            this.shell_diameter = parseFloat(this.props.component[i].sd/scaler);
            let ratio = parseFloat(this.props.component[i].hr);
            let minor = diameter / ratio;
            let major = diameter + head_thickness;
            let srl = parseFloat(this.props.component[i].srl/scaler);
            if (this.props.component[i].position === '0') {
              let inner_maj = major - head_thickness;
              let head1 = new SpheroidHeadBufferGeometry(major, minor, inner_maj, minor - minor / 3, 400);
              t.color= '#0b7dba';
              let material = new THREE.MeshPhongMaterial(t);
              let flange = Shell(head_thickness, this.shell_diameter, this.shell_diameter, srl, material);
              let head = new THREE.Mesh(head1, material);
              let grouper = new THREE.Group();
              flange.translateY(-srl / 2);
              grouper.add(flange)
              head.translateY(-srl).rotateZ(3.14);
              grouper.add(head);
              grouper.rotateZ(-math.pi / 2);
              this.scene.add(grouper);
              this.shapes.push(grouper);
              grouper.name=this.props.component[i].componentID +  "&"+"Ellipsoidal Head";             
               this.head_no = 1;
              let cg_head= -(4*minor)/(3*math.pi)
              this.keepHeightRecord(this.props.component[i],-500,cg_head);
            }
            else {
              let head1 = new SpheroidHeadBufferGeometry(major, minor, major - head_thickness, minor - head_thickness, 400);
              t.color= '#0b7dba';
              let material = new THREE.MeshPhongMaterial(t);
              let head = new THREE.Mesh(head1, material);
              let grouper2 = new THREE.Group();
              let flange2 = Shell(head_thickness, this.shell_diameter, this.shell_diameter, srl, material);
              head.translateY(srl / 2);
              grouper2.add(flange2);
              grouper2.add(head);
              let height_for_top = 0;
              for (let i = 0; i < this.props.component.length; i++) {
                if(this.props.component[i]){
                if (this.props.component[i].length && (this.props.component[i].component === "Cylinder" || this.props.component[i].component === "Conical")) {
                  height_for_top = height_for_top + this.props.component[i].length * (12/scaler) ;
                }
              }
            }
              let cg_head=height_for_top+(4*minor)/(3*math.pi);
              this.keepHeightRecord(this.props.component[i],-500,cg_head);
              grouper2.translateX(height_for_top+srl/2).rotateZ(-math.pi / 2);
              this.scene.add(grouper2);
              grouper2.name=this.props.component[i].componentID + "&"+ this.props.component[i].component;
              this.shapes.push(grouper2);
            }
          } 
          case "Nozzle":
           if( this.props.component[i].type_name === "LWN") 
          {
            let length = this.props.component[i].externalNozzleProjection/scaler;
            t.color='#0b7dba';
            let nozzle_material = new THREE.MeshPhongMaterial(t);
            let orientation = this.props.component[i].orientation;
            let orientation_in_rad = (orientation / 180) * math.pi;
            let nozzle_height = this.props.component[i].height*(12/scaler);
            this.heights_only = [];
            let key_value=0;
            for (let key in this.heights) 
            {
              key_value = key;
            }
            for (let i = 0; i < key_value; i++) {
              this.heights_only.push(-500);
            }
            for (let key in this.heights) {
              let i = 0;
              if (this.heights[key]) {
                i = this.heights[key];
              }
              this.heights_only[key]=i; //retrieve height only ie values for respective key, here we cannot input nozzle heights , splice adds element to specific position with 0 replacement
            }


//          for (let key in this.heights) {
//           let i = this.heights[key];
//           this.heights_only.splice(key, 0, i); //retrieve height only ie values for respective key, here we cannot input nozzle heights , splice adds element to specific position with 0 replacement
// }

            let closest_index = getClosest.number(nozzle_height, this.heights_only);
            let closest_value = this.heights[closest_index];
            let index_key = returnKey(this.heights, closest_value);
            let nozzle = new THREE.Mesh();
            let barrel_outer_diameter = this.props.component[i].value.barrel_outer_diameter/scaler;
            let bolt_circle_diameter = this.props.component[i].value.blot_circle_diameter/scaler;
            let bolt_hole_number = this.props.component[i].value.blot_hole_number;
            let bolt_hole_size = this.props.component[i].value.blot_hole_size/scaler;
            let bore = this.props.component[i].value.bore/scaler;
            let flange_outer_diameter = this.props.component[i].value.flange_outer_diameter/scaler;
            let flange_thickness = this.props.component[i].value.flange_thickness/scaler;
            let raised_face_diameter = this.props.component[i].value.raised_face_diameter/scaler;
            let raised_face_thickness = this.props.component[i].value.raised_face_thickness/scaler;
           if(this.props.component[index_key])
           {
            if (this.props.component[index_key].component === "Cylinder") {
              let shell_rad = this.props.component[index_key].sd / (2*scaler);
              let phi = math.asin((barrel_outer_diameter / 2 / shell_rad));
              let x_displace = (shell_rad) * math.cos(phi);
              nozzle = Standard_nozzle(length, 0, barrel_outer_diameter, bore, 0, flange_outer_diameter, raised_face_diameter, raised_face_thickness, flange_thickness, bolt_hole_number, bolt_circle_diameter, bolt_hole_size, nozzle_material);
              nozzle.translateZ(-x_displace * math.cos(orientation_in_rad)).translateY(x_displace * math.sin(orientation_in_rad)).translateX(nozzle_height).rotateX(orientation_in_rad).rotateY(math.PI / 2);
              nozzle.name=this.props.component[i].componentID+ "&"+this.props.component[i].component;
              this.scene.add(nozzle);
              this.shapes.push(nozzle);

            } else if (this.props.component[index_key].component === "Conical") {
              let rad_bot = this.props.component[index_key].sd_s /( 2*scaler);
              let rad_top = this.props.component[index_key].sd_l / (2*scaler);
              let height_of_cone = this.props.component[index_key].length * (12/scaler);
              let diff = rad_top - rad_bot;
              let pos_of_noz = 0;
              let noz = 0;
              if (index_key >= 0) //checking if nozzle is required for the first cylinder or other, cause for first it will be equal to nozzle height, but for others the height is from the origin, but we need the height only from the corresponding cylinder 
              {
                noz = nozzle_height - (this.heights_only[index_key] - height_of_cone / 2);
              } else {
                noz = nozzle_height;
              }
              if (diff >= 0) //check if is positive to check position of nozzle below or above the height of corresponding cylinder
              {
                pos_of_noz = rad_bot + ((noz / (height_of_cone)) * diff);
              } else {
                pos_of_noz = rad_bot - (((noz / height_of_cone)) * math.abs(diff));
              }
              let phi = math.asin((barrel_outer_diameter / 2 / pos_of_noz)); //calculating angle wrt to centre
              let x_displace = (pos_of_noz) * math.cos(phi);
              nozzle = Standard_nozzle(length, 0, barrel_outer_diameter, bore, 0, flange_outer_diameter, raised_face_diameter, raised_face_thickness, flange_thickness, bolt_hole_number, bolt_circle_diameter, bolt_hole_size);
              nozzle.translateZ(-x_displace * math.cos(orientation_in_rad)).translateY(x_displace * math.sin(orientation_in_rad)).translateX(nozzle_height).rotateX(orientation_in_rad).rotateY(math.PI/2);
              nozzle.name=this.props.component[i].componentID+ "&"+this.props.component[i].component;
              this.scene.add(nozzle);
              this.shapes.push(nozzle);
            }
          }
          this.keepHeightRecord(this.props.component[i],-500,0);

          } else if (this.props.component[i].type_name === "HB") 
          {

            let length = this.props.component[i].length * (12/scaler);
            let orientation = this.props.component[i].orientation;
            let orientation_in_rad = (orientation / 180) * math.pi;
            let nozzle_height = this.props.component[i].height/scaler;
            let nozzle = new THREE.Mesh();
            nozzle = Curve_nozzle(length, 1);
            nozzle.translateZ(-this.radial_position * math.cos(orientation_in_rad)).translateX(this.radial_position * math.sin(orientation_in_rad)).translateY(nozzle_height).rotateY(-orientation_in_rad);
            nozzle.name=this.props.component[i].componentID+ "&"+this.props.component[i].component;
            this.scene.add(nozzle);
            this.shapes.push(nozzle);
            this.keepHeightRecord(this.props.component[i],-500,0);

          }
          case  "Skirt":
          break;
          
          case "Lifting Lug": {
            try {
              lug_index=parseInt(this.props.component[i].componentID);
              this.keepHeightRecord(this.props.component[i],-500,0);
              let weightXCG = 0;
              let weightsum = 0;
              if (!isEmpty(this.weights)) {
                let newState = Object.assign([], this.weights);
                // for (let i = 0; i < newState.length; i++) {
                //   if(newState[i])
                //   {
                //   weightsum += newState[i][2];
                //   weightXCG += newState[i][1] * newState[i][2];
                //   }
                // }
                let key =0;
                let thickness = this.props.component[i].value.lug_thickness.req_value/scaler;
                height = this.props.component[i].height_lug/scaler;
                let rad = this.props.component[i].length/scaler;
                let hole_diameter = this.props.component[i].hole_diameter/scaler;
                distance1 = this.props.component[i].lug1_cg_distance/scaler;
                distance2 = this.props.component[i].lug2_cg_distance/scaler;
                angle = this.props.component[i].layout_angle;
                t.color='#500dba';
                let material = new THREE.MeshPhongMaterial(t);
                lug1 = LiftingLug(height, thickness, rad, hole_diameter,material);
                this.shapes.push(lug1);
               
                if (this.props.component[i].number === '2') {
                  lug2 = LiftingLug(height, thickness, rad, hole_diameter,material);
                }
                if (last_cylinder >=0) {
         
                }
              }
            } catch (err) {
              console.log(err);
            }
            break;
          } case "Saddle": 
          {
            t.color='#abcdef';
            let material=new THREE.MeshPhongMaterial(t);
            let saddle = Saddle(this.props.component[last_cylinder].sd / (2*scaler) + this.props.component[last_cylinder].value.thickness/scaler, this.props.component[i].width/scaler, this.props.component[i].base_height/scaler, this.props.component[i].base_length/scaler, (this.props.component[i].saddle_angle / 180) * math.pi,material);
            let position = this.props.component[i].position/scaler;
            let distance = this.props.component[i].distance/scaler;
            saddle.translateZ(distance);
            saddle.name=this.props.component[i].componentID+ "&"+this.props.component[i].component;
            this.scene.add(saddle);
            this.shapes.push(saddle);
            this.keepHeightRecord(this.props.component[i],-500,0);
            this.start();
            break;
          }
        }
        if(lug1 && i===(this.props.component.length-1))
        {
          let key=0;
          let weightsum=0;
          let weightXCG=0;
          let key_value = 0
          this.heights_only_lug=[];
            for (key in this.weights) {
                  if(this.weights[key])
                  {
                  weightsum += this.weights[key][2];
                  weightXCG += this.weights[key][1] * this.weights[key][2];
                  }
                }
                for (let key in this.heights) {
                  key_value = key;
                }
                for (let i = 0; i < key_value; i++) {
                  this.heights_only_lug.push(-500);
                }
                for (let key in this.heights) {
                  let i = 0;
                  if (this.heights[key]) {
                    i = this.heights[key];
                  }
                  this.heights_only_lug[key] = i; //retrieve height only ie values for respective key, here we cannot input nozzle heights , splice adds element to specific position with 0 replacement
                }
                let overall_CG = weightXCG / weightsum;
                let lug1_position=overall_CG-distance1;
                let lug2_position=overall_CG+distance2;
                let closest_index1 = getClosest.number(lug1_position, this.heights_only_lug);
                let closest_index2=getClosest.number(lug2_position,this.heights_only_lug);
                let closest_value1 = this.heights[closest_index1];
                let closest_value2 = this.heights[closest_index2];
                let index_key1 = returnKey(this.heights, closest_value1);
                let index_key2 = returnKey(this.heights, closest_value2);
                let shell_rad1 = this.props.component[index_key1].sd /(2*scaler) + this.props.component[index_key1].value.thickness/scaler; //finding the diameter of last shell
                let shell_rad2 = this.props.component[index_key2].sd /(2*scaler) + this.props.component[index_key2].value.thickness/scaler; //finding the diameter of last shell
                let x_displace1 = (shell_rad1) * math.cos(math.pi * (angle / 180));

                let x_displace2 = (shell_rad2) * math.cos(math.pi * (angle / 180));
                let z_displace1 = (shell_rad1) * math.sin(math.pi * (angle / 180));

                let z_displace2 = (shell_rad2) * math.sin(math.pi * (angle / 180));
                //let phi = math.asin((barrel_outer_diameter / 2 / shell_rad));
                //lug1.translateZ(10);
                this.scene.add(lug1);
                lug1.translateX(lug1_position).translateZ(-x_displace1).translateY(z_displace1).rotateX((angle / 180) * math.pi - math.pi / 2) //.rotateX(-(angle/180)*math.pi);//.translateY(height).translateZ(z_displace);
                lug1.name=this.props.component[lug_index].componentID+ "&"+this.props.component[lug_index].component;
                if (lug2) {
                  this.scene.add(lug2);
                  lug2.translateX(lug2_position).translateZ(-x_displace2).translateY(z_displace2).rotateX((angle / 180) * math.pi - math.pi / 2) //.rotateX((-angle/180)*math.pi);
                }
        }
      }
    }}
      return ( <div>< div width = '100%'
        height = '100%'

        ref = {
          (mount) => {
            this.mount = mount
          }
        }
        id = "scener" />
        <div>Horizontal</div>
        </div>
      );
    } catch (err) {
      console.log(err);
    }
  }
  keepHeightRecord=(component,position,cg)=>
  {
    if (!height_checker(component)) //since nozzle has height as parameter
    {
      if (!(component.componentID in this.heights)) {
  
        this.heights[component.componentID] = position;
        if(component.value.weight)
        {
        this.weights[component.componentID] =[component.component,cg,component.value.weight];
        }
        else 
        {
          this.weights[component.componentID] =[component.component,cg,0];

        }
      };
    }
  }
  controlSetup=()=>
  {
    this.controls.rotateSpeed = 2.0;
    this.controls.zoomSpeed = 1.2;
    this.controls.panSpeed = 1;
    this.controls.noZoom = false;
    this.controls.noPan = false;
    this.controls.staticMoving = true;
    this.controls.dynamicDampingFactor = 0.3;
  }
}


const mapStateToProps = state => {
  return {
    component: state.components.component,
    title: state.navigation.title,
    view:state.componentData.view
  };
};

// const mapDispatchToProps = dispatch => {
//     return {
//         onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
//         onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
//     };
// };



const mapDispatchToProps = dispatch => {
  return {
    updateSelectedComponentID: (id) => {
      dispatch(actions.updateSelectedComponentID(id));
    },
    onDataUpdate: (data, componentID, height) => {
      dispatch(actions.updateHeight(data, componentID, height))
    },
    treeUpdate: (value) => {
      dispatch(actions.displayComponentTree(value))
    },
    modelImport: (titleName, value) => {
      dispatch(actions.importComponentModel(titleName, value))
    },
    returnComponentID: (id) => {
      dispatch(actions.returnComponentByID(id))
    },
    componentClicked: (value) => {
      dispatch(actions.componentClicked(value))
    },
    onupdateSelectedComponentID: (id) => {
      dispatch(id)
    },
    displayComponentTree: value =>
    dispatch(actions.displayComponentTree(value))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Scene_horizontal);