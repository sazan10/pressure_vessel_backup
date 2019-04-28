import React, {
  Component
} from 'react';
import * as THREE from 'three';
import * as TrackballControls from 'three-trackballcontrols';
import * as actions from '../../store/actions/index';
import Shell from '../../Components/Parts/Shell';
import Head from '../../Components/Parts/Head';
import Curve_nozzle from '../../Components/Parts/Curve_nozzle';
import Saddle from '../../Components/Parts/Saddle';
import Standard_nozzle from '../../Components/Parts/Standard_nozzle';
import LiftingLug from '../../Components/Parts/LiftingLug';
import comparator from '../../Components/Scene/comparator';
import math from 'mathjs';
import height_checker from '../../Components/Scene/height_checker';
import getClosest from 'get-closest'
import returnKey from '../../Components/Scene/returnKey';
import {
  connect
} from 'react-redux';
import {
  SpheroidHeadBufferGeometry
} from '../../Components/Parts/SpheroidHead_v2';

class Scene extends Component {

  state = {
    current: {},
  };
  componentDidMount() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x696969);
    this.camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000000
    );
    this.camera.position.z = 5;
    this.camera.position.y = 0;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.mount.appendChild(this.renderer.domElement);
    this.group = new THREE.Group();
    document.getElementById("scener").addEventListener('click', this.onDocumentMouseDown, false);
    window.addEventListener('resize', this.onWindowResize, false);
    this.controls = new TrackballControls(this.camera, this.renderer.domElement);
    this.controls.rotateSpeed = 1.0;
    this.controls.zoomSpeed = 1.2;
    this.controls.panSpeed = 0.8;
    this.controls.noZoom = false;
    this.controls.noPan = false;
    this.controls.staticMoving = true;
    this.controls.dynamicDampingFactor = 0.3;
    this.controls.keys = [65, 83, 68];
    this.shapes = [];
    let ambient = new THREE.AmbientLight(0xbbbbbb);
    this.scene.add(ambient);
    let directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 0, 1);
    this.scene.add(directionalLight);
    this.material = new THREE.MeshPhongMaterial({
      color: '#0b7dba',
      emissive: 0x072534,
    });
    this.radial_position = 0;
    this.axesHelper = new THREE.AxesHelper(1000);
    this.scene.add(this.axesHelper);
    this.shell_diameter = 0;
    this.length = 0;
    this.name=null;
    this.compID=null;
    this.lengths = [];
    this.heights = {};
    this.weights = {};
    this.heights_permanent = {};
    this.cylinder_lengths = [];
    this.first_shell = true;
    this.heights_only = [];
    this.start();
    this.selected_component = 0;
  }

  onDocumentMouseDown = (event) => {
    let rect = document.getElementById("scener").getBoundingClientRect();
    let projector = new THREE.Projector();
    let vector = new THREE.Vector3((event.clientX - rect.left) / window.innerWidth * 2 - 1, -((event.clientY - rect.top) / window.innerHeight) * 2 + 1, 0.5),
      INTERSECTED;
    projector.unprojectVector(vector, this.camera);
    let raycaster = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());
    if (this.shapes.length >= 1) {
      let intersects = raycaster.intersectObjects(this.shapes, true);
      if (intersects.length > 0) {

        intersects[0].object.material.transparent = true;
        try {
          const sh = [...this.shapes];
          sh.map((shape) => {
            let sh_name = shape.name.split("&");
            if (sh_name[1] === "Cylinder" || sh_name[1] === "Ellipsoidal Head") {
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
        if (intersects[0].object.material.opacity === 1) {
          intersects[0].object.material.opacity = 0.5;
        } else {
          intersects[0].object.material.opacity = 1;
        }
        let name = null;
        if (intersects[0].object.parent.name) {
          name = intersects[0].object.parent.name;
        } else {
          name = intersects[0].object.name;
        }

        let res = name.split("&");
        this.name = res[1];
        this.compoID=res[0];
        //   intersects[0].object.material.opacity = 0.5;
        this.props.updateSelectedComponentID(res[0]);
        this.props.treeUpdate(false);
        this.props.modelImport(res[1], 1);
        this.props.returnComponentID(res[0]);
        this.props.componentClicked(true);
      }
    }
    this.controls.update();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.component !== this.props.component) {
    }
  }

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  componentWillReceiveProps(nextProps) {}

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

  render(){
    try {
      this.first_shell = true;
      this.height_position = 0;
      this.weights = {};
      this.heights = {};
      let cylinder_iterator = 0;
      this.cylinder_lengths = [];
      this.lengths = [];
      this.shapes = [];
      let last_cylinder = null;
      this.scaler = 100;
      let t={  color: '#037d23',
      emissive: 0x072534,
      side: THREE.DoubleSide,
      transparent:true,
      opacity:1};
      if (this.scene) {
        if (this.scene.children) {
          this.clearScene();
        }
      }
      if (this.props.component.length >= 0 && this.scene) {
        for (let i = 0; i < this.props.component.length; i++) {
          if (this.props.component[i] !== null) {
            if(this.name===this.props.component[i].component.toString() && this.compoID==this.props.component[i].componentID.toString()){
              t.opacity=0.5;
            }
            else{
              t.opacity=1;
            }
            if (this.props.component[i].component === "Cylinder" || this.props.component[i].component === "Conical") {
              let diameter_bot = 0;
              let diameter_top = 0;
              let diameter = 0;
              if (this.props.component[i].component === "Cylinder") {
                diameter_bot = parseFloat(this.props.component[i].sd / this.scaler);
                diameter_top = diameter_bot;
              } else {
                diameter_bot = parseFloat(this.props.component[i].sd_l / this.scaler);
                diameter_top = parseFloat(this.props.component[i].sd_s) / this.scaler;
              }
              this.shell_diameter = diameter_bot;
              this.length = parseFloat(this.props.component[i].length) * (12 / this.scaler);
              this.cylinder_lengths.push(this.length);
              this.lengths.push(this.length);
              let number = parseFloat(this.props.component[i].number);
              let thickness = parseFloat(this.props.component[i].thickness / this.scaler);
              let shell = new THREE.Mesh();
              t.color='#037d23';
              let shell_material = new THREE.MeshPhongMaterial(t);
              shell = Shell(thickness, diameter_bot, diameter_top, this.length, shell_material);
              shell.name = this.props.component[i].componentID + "&" + this.props.component[i].component;
              if (this.first_shell) {
                this.height_position = this.height_position + this.length / 2;
                this.keepHeightRecord(this.props.component[i], this.height_position, this.height_position);
                this.first_shell = false;
              } else {
                t.color='0xffff00'
                let ringmaterial = new THREE.MeshBasicMaterial(t);
                diameter = (parseFloat(this.props.component[i].sd / this.scaler) + parseFloat(this.props.component[i].thickness / this.scaler)) || (parseFloat(this.props.component[i].sd_s / this.scaler) + parseFloat(this.props.component[i].thickness / this.scaler));
                let ringgeometry = Shell(diameter / 130, diameter, diameter, diameter / 130, ringmaterial);
                let lengths = this.props.component[i].length * (12 / this.scaler); //length of current cylinder
                this.height_position = this.height_position + this.cylinder_lengths[cylinder_iterator - 1] / 2 + lengths / 2; //update height position 
                this.keepHeightRecord(this.props.component[i], this.height_position, this.height_position);
                ringgeometry.translateY(this.height_position - this.length / 2);
                this.scene.add(ringgeometry);
              }
              shell.translateY(this.height_position); //this.height_position);  
              let cylinder_group = new THREE.Group();
              cylinder_group.add(shell);
              this.scene.add(cylinder_group);
              cylinder_iterator = cylinder_iterator + 1;
              this.radial_position = diameter / 2 + thickness;
              this.shapes.push(shell);
              last_cylinder = i;
            } else if (this.props.component[i].component === "Ellipsoidal Head") {
              let diameter = parseFloat(this.props.component[i].sd) / (2 * this.scaler);
              let head_thickness = parseFloat(this.props.component[i].thickness / this.scaler);
              this.shell_diameter = parseFloat(this.props.component[i].sd / this.scaler);
              let ratio = parseFloat(this.props.component[i].hr);
              let minor = diameter / ratio;
              let major = diameter + head_thickness;
              let srl = parseFloat(this.props.component[i].srl / this.scaler);
              if (this.props.component[i].position === '0') {
                this.lengths.push(-500);
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
                this.scene.add(grouper);
                head.name = this.props.component[i].componentID + "&" + "Ellipsoidal Head";
                this.shapes.push(grouper);
                let cg_head = -(4 * minor) / (3 * math.pi)
                this.keepHeightRecord(this.props.component[i], -500, cg_head);
              } else {
                this.lengths.push(minor);
                let head1 = new SpheroidHeadBufferGeometry(major, minor, major - head_thickness, minor - head_thickness, 400);
                t.color='#0b7dba';
                let material = new THREE.MeshPhongMaterial(t);
                let head = new THREE.Mesh(head1, material);
                let grouper2 = new THREE.Group();
                let flange2 = Shell(head_thickness, this.shell_diameter, this.shell_diameter, srl, material);
                head.translateY(srl / 2);
                grouper2.add(flange2);
                grouper2.add(head);
                let height_for_top = 0;
                for (let i = 0; i < this.props.component.length; i++) {
                  if (this.props.component[i]) {
                    if (this.props.component[i].length && (this.props.component[i].component === "Cylinder" || this.props.component[i].component === "Conical")) {
                      height_for_top = height_for_top + parseFloat(this.props.component[i].length) * (12 / this.scaler);
                    }
                  }
                }
                let cg_head = height_for_top + (4 * minor) / (3 * math.pi);
                this.keepHeightRecord(this.props.component[i], -500, cg_head);
                grouper2.translateY(height_for_top);
                this.scene.add(grouper2);
                head.name = this.props.component[i].componentID + "&" + this.props.component[i].component;
                this.shapes.push(grouper2);
              }
            } else if (this.props.component[i].component === "Nozzle" && this.props.component[i].type_name === "LWN") {
              let length = this.props.component[i].externalNozzleProjection / this.scaler;
              let orientation = this.props.component[i].orientation;
              t.color='#0b7dba';
              let nozzle_material = new THREE.MeshPhongMaterial(t);
              let orientation_in_rad = (orientation / 180) * math.pi;
              this.lengths.push(-1000);
              let nozzle_height = this.props.component[i].height * (12 / this.scaler);
              this.heights_only = []
              let key_value = 0
              // for (let key in this.heights) 
              // {      
              //   key_value=key;
              //  }
              //               for (let key in this.heights) {
              //                 let i = this.heights[key];
              //                 this.heights_only.splice(key, 0, i); //retrieve height only ie values for respective key, here we cannot input nozzle heights , splice adds element to specific position with 0 replacement
              // }
              for (let key in this.heights) {
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
                this.heights_only[key] = i; //retrieve height only ie values for respective key, here we cannot input nozzle heights , splice adds element to specific position with 0 replacement
              }
              let closest_index = getClosest.number(nozzle_height, this.heights_only);

              let closest_value = this.heights[closest_index];
              let index_key = returnKey(this.heights, closest_value);

              let nozzle = new THREE.Mesh();
              let barrel_outer_diameter = this.props.component[i].value.barrel_outer_diameter / this.scaler;
              let bolt_circle_diameter = this.props.component[i].value.blot_circle_diameter / this.scaler;
              let bolt_hole_number = this.props.component[i].value.blot_hole_number;
              let bolt_hole_size = this.props.component[i].value.blot_hole_size / this.scaler;
              let bore = this.props.component[i].value.bore / this.scaler;
              let flange_outer_diameter = this.props.component[i].value.flange_outer_diameter / this.scaler;
              let flange_thickness = this.props.component[i].value.flange_thickness / this.scaler;
              let raised_face_diameter = this.props.component[i].value.raised_face_diameter / this.scaler;
              let raised_face_thickness = this.props.component[i].value.raised_face_thickness / this.scaler;
              if (this.props.component[index_key]) {
                if (this.props.component[index_key].component === "Cylinder") {
                  let shell_rad = parseFloat(this.props.component[index_key].sd) / (2 * this.scaler);
                  let phi = math.asin((barrel_outer_diameter / 2 / shell_rad));
                  let x_displace = (shell_rad) * math.cos(phi);
                  nozzle = Standard_nozzle(length, 0, barrel_outer_diameter, bore, 0, flange_outer_diameter, raised_face_diameter, raised_face_thickness, flange_thickness, bolt_hole_number, bolt_circle_diameter, bolt_hole_size, nozzle_material);
                  nozzle.translateZ(-x_displace * math.cos(orientation_in_rad)).translateX(x_displace * math.sin(orientation_in_rad)).translateY(nozzle_height).rotateY(math.PI / 2 - orientation_in_rad);
                  nozzle.name = this.props.component[i].componentID + "&" + this.props.component[i].component;
                  this.scene.add(nozzle);
                  this.shapes.push(nozzle);

                } else if (this.props.component[index_key].component === "Conical") {
                  let rad_bot = this.props.component[index_key].sd_s / (2 * this.scaler);
                  let rad_top = this.props.component[index_key].sd_l / (2 * this.scaler);
                  let temp = this.props.component;
                  let height_of_cone = this.props.component[index_key].length * (12 / this.scaler);
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
                  nozzle.translateZ(-x_displace * math.cos(orientation_in_rad)).translateX(x_displace * math.sin(orientation_in_rad)).translateY(nozzle_height).rotateY(math.PI / 2 - orientation_in_rad);
                  this.scene.add(nozzle);
                  nozzle.name = this.props.component[i].componentID + "&" + this.props.component[i].component;
                  this.shapes.push(nozzle);
                }
              }
              this.keepHeightRecord(this.props.component[i], -500, 0);
            } else if (this.props.component[i].component === "Nozzle" && this.props.component[i].type_name === "HB") {
              let length = this.props.component[i].length / this.scaler;
              let orientation = this.props.component[i].orientation;
              let orientation_in_rad = (orientation / 180) * math.pi;
              let nozzle_height = this.props.component[i].height / this.scaler;
              let nozzle = new THREE.Mesh();
              nozzle = Curve_nozzle(length, 1);
              nozzle.translateZ(-this.radial_position * math.cos(orientation_in_rad)).translateX(this.radial_position * math.sin(orientation_in_rad)).translateY(nozzle_height).rotateY(-orientation_in_rad);
              this.scene.add(nozzle);
              nozzle.name = this.props.component[i].componentID + "&" + this.props.component[i].component;
              this.shapes.push(nozzle);
              this.keepHeightRecord(this.props.component[i], -500, 0);

            } else if (this.props.component[i].component === "Skirt") {
              let length = parseFloat(this.props.component[i].length / this.scaler);
              let sd = parseFloat(this.props.component[i].sd / this.scaler);
              let thickness = parseFloat(this.props.component[i].thickness / this.scaler);
              t.color='#CD5C5C';
              let skirt_material = new THREE.MeshPhongMaterial(t);
              let skirt = Shell(thickness, sd, sd, length, skirt_material);
              let skirt_flange_length = length / 4;
              let skirt_flange = Shell(thickness, sd + sd / 10, sd + sd / 10, skirt_flange_length, skirt_material);
              skirt.translateY(-length / 2);
              skirt_flange.translateY(-length - skirt_flange_length / 2);
              let group = new THREE.Group();
              group.add(skirt);
              group.add(skirt_flange);
              this.scene.add(group);
              group.name = this.props.component[i].componentID + "&" + this.props.component[i].component;
              this.shapes.push(group);
              let cg_skirt = -(length / 2 + 2);
              this.keepHeightRecord(this.props.component[i], -500, cg_skirt);
              this.lengths.push(-500);

            } else if (this.props.component[i].component === "Lifting Lug") {
              let position = 0;
              let last_cylinder = 0;
              let cyl_diameter = 0;
              for (let i = 0; i < this.props.component.length; i++) {
                if (this.props.component[i]) {
                  if (this.props.component[i].component === "Cylinder" || this.props.component[i].component === "Conical") {
                    try {
                      position = position + (this.props.component[i].length * 12 / this.scaler);
                      last_cylinder = this.props.component[i].componentID;
                      if (this.props.component[i].component === "Cylinder") {
                        cyl_diameter = this.props.component[last_cylinder].sd / (2 * this.scaler);
                      } else if (this.props.component[i].component === "Conical") {
                        cyl_diameter = this.props.component[last_cylinder].sd_l / (2 * this.scaler);
                      }
                    } catch (Exception) {
                      console.log(Exception);
                    }
                  }
                }
              }

              this.keepHeightRecord(this.props.component[i], -500, 0);
              let thickness = this.props.component[i].value.lug_thickness.req_value / this.scaler;
              let height = this.props.component[i].height_lug / this.scaler;
              let rad = this.props.component[i].length / this.scaler;
              let hole_diameter = this.props.component[i].hole_diameter / this.scaler;
              let angle = this.props.component[i].layout_angle;
              let lug1 = LiftingLug(height, thickness, rad, hole_diameter);

              lug1.name = this.props.component[i].componentID + "&" + this.props.component[i].component;
              this.shapes.push(lug1);
              let lug2 = null;
              if (this.props.component[i].number === '2') {
                lug2 = LiftingLug(height, thickness, rad, hole_diameter);

              }
              if (last_cylinder !== null && this.props.component[last_cylinder] !== null) {
                //let height_pos = this.heights_permanent[last_cylinder] + (this.props.component[last_cylinder].length * (12 / this.scaler)) / 2 - height / 2.2;
                let shell_rad = cyl_diameter + this.props.component[last_cylinder].value.thickness / this.scaler; //finding the diameter of last shell
                let x_displace = (shell_rad) * math.sin(math.pi * (angle / 180));
                let z_displace = (shell_rad) * math.cos(math.pi * (angle / 180));
                lug1.translateX(x_displace).translateZ(-z_displace).translateY(position).rotateY(-(angle / 180) * math.pi); //.translateY(height).translateZ(z_displace);
                if (this.props.component[i].number === '2') {
                  lug2.translateX(-x_displace).translateZ(z_displace).translateY(position).rotateY(-(angle / 180) * math.pi + math.pi);
                }
                this.scene.add(lug1);
                this.scene.add(lug2);
              }
            }
            this.start();
          }
        }
      }
      return ( < div > <div width = '100%'  
                             height = '100%'
                             ref = {
                            (mount) => {
                              this.mount = mount
                            }
                          }
                          id = "scener"/>
        <div> Vertical </div> </div>
      );
    } catch (err) {
      console.log(err);
    }
  }



  keepHeightRecord = (component, position, cg) => {
    const b_key = component.componentID.toString();
    if (!height_checker(component)) {
      if (!(component.componentID in this.heights)) {
        //this.heights[component.componentID] = position;
        //let height = Object.assign(this.heights,:{position}}, {'c': 3})

        this.heights = {
          ...this.heights,
          [b_key]: position,
        }
        if (!(b_key in this.heights_permanent)) {
          this.heights_permanent = {
            ...this.heights_permanent,
            [b_key]: position,
          }
        }
        this.weights[component.componentID] = [component.component, cg, component.value.weight];
      }
    }
  }
}





const mapStateToProps = state => {
  return {
    component: state.componentData.component,
    title: state.navigation.title

  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateSelectedComponentID: (id) => {
      dispatch(actions.updateSelectedComponentID(id));
    },
    onDataUpdate: (data, componentID, height) => {
      dispatch(actions.dataUpdate1(data, componentID, height))
    },
    treeUpdate: (value) => {
      dispatch(actions.displayComponentTree(value))
    },
    modelImport: (titleName, value) => {
      dispatch(actions.importModel(titleName, value))
    },
    returnComponentID: (id) => {
      dispatch(actions.returnComponentByID(id))
    },
    componentClicked: (value) => {
      dispatch(actions.componentClicked(value))
    },
    onupdateSelectedComponentID: (id) => {
      dispatch(id)
    }
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(Scene);