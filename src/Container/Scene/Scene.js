import React, {
  Component
} from 'react';
import * as THREE from 'three'
import * as TrackballControls from 'three-trackballcontrols';
import * as actions from '../../store/actions/index';
import Shell from '../../Components/Parts/Shell';
import Head from '../../Components/Parts/Head';
import Curve_nozzle from '../../Components/Parts/Curve_nozzle';
import Saddle from '../../Components/Parts/Saddle';
import Standard_nozzle from '../../Components/Parts/Standard_nozzle';
import comparator from './comparator';
import math from 'mathjs';
import height_checker from './height_checker';
import getClosest from 'get-closest'
import height_comparator from './height_comparator';
import returnKey from './returnKey';

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

    //ADD CAMERA
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000000
    );
    this.camera.position.z = 400;
    //ADD SCENE
    //   document.addEventListener( 'click', this.onDocumentMouseDown, false );
    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.mount.appendChild(this.renderer.domElement);
    this.group = new THREE.Group();

    //ADD CUBE

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
    var ambient = new THREE.AmbientLight(0xbbbbbb);
    this.scene.add(ambient);

    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 0, 1);
    this.scene.add(directionalLight);
    this.material = new THREE.MeshPhongMaterial({
      color: '#0b7dba',
      emissive: 0x072534,
      side: THREE.DoubleSide
    });
    this.first = 0;
    this.head_no = 0;

    this.radial_position = 0;
    // this.mesh= new THREE.Mesh();
    // this.mesh=Shell();
    // this.mesh.translateX(1.5);
    // this.scene.add(this.mesh);
    this.axesHelper = new THREE.AxesHelper(1000);
    this.scene.add(this.axesHelper);
    //this.scene.add(this.mesh2);
    this.shell_diameter = 0;
    this.length = 0;
    this.lengths = [];
    this.heights = {};
    this.cylinder_lengths = [];
    this.first_shell = true;
    this.heights_only = [];
    this.start();


  }
  onDocumentMouseDown = (event) => {
    var projector = new THREE.Projector();
    var tube;
    console.log("mouse pressed");
    var vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
    projector.unprojectVector(vector, this.camera);

    var raycaster = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());
    if (this.shapes.length >= 1) {
      console.log(this.shapes);

      var intersects = raycaster.intersectObjects(this.shapes);
      console.log("intersects", intersects);
      if (intersects.length > 0) {
        intersects[0].object.material.transparent = true;
        console.log("pressed cylinder");
        if (intersects[0].object.material.opacity === 0.5) {
          intersects[0].object.material.opacity = 1;
        } else {
          intersects[0].object.material.opacity = 0.5;
        }


        var points = [];
        points.push(new THREE.Vector3(this.camera.position.x, this.camera.position.y - 0.2, this.camera.position.z));
        points.push(intersects[0].point);

        var mat = new THREE.MeshBasicMaterial({
          color: 0xff0000,
          transparent: true,
          opacity: 0.6
        });
      }
    }
    this.controls.update();

  }

  componentWillReceiveProps(nextProps) {

  }




  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
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


  renderScene = () => {
    this.renderer.render(this.scene, this.camera);
  }
  render() {
    try {
      this.first_shell = true;
      this.height_position = 0;
      var scaler = 0;
      this.heights={};
      var cylinder_iterator = 0;
      this.cylinder_lengths = [];
      this.lengths=[];
      if (this.props.component.length >= 0) {
        var rad = 0;
        //console.log(this.props.component);
        for (let i = 0; i < this.props.component.length; i++) {
          console.log("height",this.heights);

          if (this.props.component[i].length && (this.props.component[i].component === "Cylinder" || this.props.component[i].component === "Conical")) {
            var diameter_bot = 0;
            var diameter_top = 0;
            if (this.props.component[i].component === "Cylinder") {
              diameter_bot = parseFloat(this.props.component[i].sd);
              diameter_top = diameter_bot;
            } else {
              diameter_bot = parseFloat(this.props.component[i].sd_l);
              diameter_top = parseFloat(this.props.component[i].sd_s);
            }
            this.shell_diameter = diameter_bot;
            this.length = parseFloat(this.props.component[i].length);
            this.cylinder_lengths.push(this.length);
            this.lengths.push(this.length);
            var number = parseFloat(this.props.component[i].number);
            var thickness = parseFloat(this.props.component[i].thickness);
            let shell = new THREE.Mesh();
            shell = Shell(thickness, diameter_bot, diameter_top, this.length);
            if (this.first_shell) {
              this.height_position = this.height_position + this.length / 2;
              if (!height_checker(this.props.component[i])) { //always returns false since the function for reducer is not dispatched, works even if not used
                {
                  if (!(this.props.component[i].componentID in this.heights)) {

                    this.heights[this.props.component[i].componentID] = this.height_position;
                  };
                  //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
                }
                //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
              }
              this.first_shell = false;
            } else if ((i - 1) >= 0) {
              //  if (this.props.component[i-1].component==="Cylinder" || !this.first_shell || this.props.component[i-1]==="Conical"){
              if (!this.first_shell && this.props.component.filter(comparator).length >= 2) {
                //var ringgeometry = new THREE.RingGeometry((parseFloat(this.props.component[i-1].sd)/2) , (parseFloat(this.props.component[i-1].sd)/2)+parseFloat(this.props.component[i-1].thickness)+3,400);
                var ringmaterial = new THREE.MeshBasicMaterial({
                  color: 0xffff00,
                  side: THREE.DoubleSide
                });
                let diameter = (parseFloat(this.props.component[i].sd) + parseFloat(this.props.component[i].thickness)) || (parseFloat(this.props.component[i].sd_s) + parseFloat(this.props.component[i].thickness));
                let ringgeometry = Shell(1, diameter, diameter, 1, ringmaterial);

                // var ringmesh = new THREE.Mesh( ringgeometry, ringmaterial );
                let lengths = this.props.component[i].length; //length of current cylinder
                this.height_position = this.height_position + this.cylinder_lengths[cylinder_iterator - 1] / 2 + lengths / 2; //update height position 
                if (!height_checker(this.props.component[i])) {
                  {
                    if (!(this.props.component[i].componentID in this.heights)) {

                      this.heights[this.props.component[i].componentID] = this.height_position;
                    };

                    //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
                  }

                  //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
                }
                //ringmesh.translateY(this.height_position-this.length/2).rotateX(math.pi/2);
                ringgeometry.translateY(this.height_position - this.length / 2);

                //this.scene.add( ringmesh );
                this.scene.add(ringgeometry);
              }
            }
            shell.translateY(this.height_position); //this.height_position);  
            //this.scene.add(shell);

            this.group.add(shell);
            // }    
            this.first = this.first + 2;
            this.scene.add(this.group);
            cylinder_iterator = cylinder_iterator + 1;
            //   this.start();
            // }
            //this.props.component[i].length=0;
            this.radial_position = diameter / 2 + thickness;
            //   if(this.camera)
            // {
            // this.camera.position.z=(this.length+rad)*1.8;
            // }
            this.shapes.push(shell);
          } else if (this.props.component[i] && this.props.component[i].component === "Ellipsoidal Head") {
            var diameter = parseFloat(this.props.component[i].sd) / 2;
            var head_thickness = parseFloat(this.props.component[i].thickness);
            this.shell_diameter = parseFloat(this.props.component[i].sd);
            var ratio = parseFloat(this.props.component[i].hr);
            var minor = diameter / ratio;
            var major = diameter + head_thickness;
            var srl = parseFloat(this.props.component[i].srl);
            
            // if (this.head_no==0  && this.first==0)
            if (this.props.component[i].position === '0') {
              this.lengths.push(-500);
              let inner_maj = major - head_thickness;
              var head1 = new SpheroidHeadBufferGeometry(major, minor, inner_maj, minor - minor / 3, 400);
              var material = new THREE.MeshPhongMaterial({
                color: '#0b7dba',
                emissive: 0x072534,
                side: THREE.DoubleSide
              });
              var flange = Shell(head_thickness, this.shell_diameter, this.shell_diameter, srl, this.material);
              var head = new THREE.Mesh(head1, material);
              var grouper = new THREE.Group();
              flange.translateY(-srl / 2);
              grouper.add(flange)
              head.translateY(-srl).rotateZ(3.14);
              grouper.add(head);
              this.scene.add(grouper);
              this.shapes.push(head);
              this.first = this.first + 1;

              this.head_no = 1;


              if (!height_checker(this.props.component[i])) {
                {
                  if (!(this.props.component[i].componentID in this.heights)) {

                    this.heights[this.props.component[i].componentID] = -500;
                  };

                  //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
                }

                //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
              }

            }
            //else if (this.first!=0)
            else {
              this.lengths.push(minor);
              var head1 = new SpheroidHeadBufferGeometry(major, minor, major - head_thickness, minor - head_thickness, 400);
              var material = new THREE.MeshPhongMaterial({
                color: '#0b7dba',
                emissive: 0x072534,
                side: THREE.DoubleSide
              });
              var head = new THREE.Mesh(head1, material);
              //this.height_position=this.height_position-r2+this.length/2;
              //head.translateY(this.height_position);
              this.height_position = this.height_position + this.length / 2 + srl / 2;
              if (!height_checker(this.props.component[i])) {
                {
                  if (!(this.props.component[i].componentID in this.heights)) {

                    this.heights[this.props.component[i].componentID] = this.height_position;
                  };

                  //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
                }

                //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
              }
              var grouper2 = new THREE.Group();
              var flange2 = Shell(head_thickness, this.shell_diameter, this.shell_diameter, srl, this.material);
              head.translateY(srl / 2);
              grouper2.add(flange2);
              grouper2.add(head);
              grouper2.translateY(this.height_position);
              this.scene.add(grouper2);
              if (!height_checker(this.props.component[i])) {
                {
                  if (!(this.props.component[i].componentID in this.heights)) {

                    this.heights[this.props.component[i].componentID] = this.height_position;
                  };

                  //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
                }

                //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
              }

              //head.translateY(this.height_position);
            }

            // this.radial_position=rad;

            if (this.camera) {
              // this.camera.position.z=(this.length+rad)*1.8;
            }
          } else if (this.props.component[i]) {
            if (this.props.component[i].component === "Nozzle" && this.props.component[i].type_name === "LWN") {
              var length = this.props.component[i].externalNozzleProjection;
              var orientation = this.props.component[i].orientation;
              var orientation_in_rad = (orientation / 180) * math.pi;
              this.lengths.push(-1000);
              var nozzle_height = this.props.component[i].height;
              this.heights_only=[];
              for (var key in this.heights) {
                let i = this.heights[key];
                this.heights_only.splice(key, 0, i); //retrieve height only ie values for respective key, here we cannot input nozzle heights , splice adds element to specific position with 0 replacement
              }

              console.log("height",this.heights);
              console.log("height only",this.heights_only);
              let closest_index = getClosest.number(nozzle_height, this.heights_only);
              let closest_value = this.heights[closest_index];
              let index_key = returnKey(this.heights, closest_value);
              var nozzle = new THREE.Mesh();
              var barrel_outer_diameter = this.props.component[i].value.barrel_outer_diameter;
              var bolt_circle_diameter = this.props.component[i].value.blot_circle_diameter;
              var bolt_hole_number = this.props.component[i].value.blot_hole_number;
              var bolt_hole_size = this.props.component[i].value.blot_hole_size;
              var bore = this.props.component[i].value.bore;
              var flange_outer_diameter = this.props.component[i].value.flange_outer_diameter;
              var flange_thickness = this.props.component[i].value.flange_thickness;
              var neck_thickness = this.props.component[i].value.neck_thickness;
              var nominal_pipe_size = this.props.component[i].value.nominal_pipe_size;
              var nut_stop_diameter = this.props.component[i].value.nut_stop_diameter;
              var raised_face_diameter = this.props.component[i].value.raised_face_diameter;
              var raised_face_thickness = this.props.component[i].value.raised_face_thickness;
              if(this.props.component[index_key].component==="Cylinder")
              {
              let shell_rad = this.props.component[index_key].sd / 2;
              let phi = math.asin((barrel_outer_diameter / 2 / shell_rad));
              let x_displace = (shell_rad) * math.cos(phi);
              nozzle = Standard_nozzle(length, 0, barrel_outer_diameter, bore, 0, flange_outer_diameter, raised_face_diameter, raised_face_thickness, flange_thickness, bolt_hole_number, bolt_circle_diameter, bolt_hole_size);
              nozzle.translateZ(-x_displace * math.cos(orientation_in_rad)).translateX(x_displace * math.sin(orientation_in_rad)).translateY(nozzle_height).rotateY(-orientation_in_rad);
              this.scene.add(nozzle);
            }
            else if(this.props.component[index_key].component==="Conical")
          {
            let rad_bot=this.props.component[index_key].sd_s/2;
            let rad_top=this.props.component[index_key].sd_l/2;
            let temp=this.props.component;
            let height_of_cone=this.props.component[index_key].length;
            let diff=rad_top-rad_bot;
            let pos_of_noz=0;
            let noz=0;
            if(index_key>=0)
            {
            noz=nozzle_height-(this.heights_only[index_key]-height_of_cone/2);
            }
            else
            {
              noz=nozzle_height;
            }
            if(diff>=0)
            {
              pos_of_noz=rad_bot+((noz/(height_of_cone))*diff);
            }
            else{
              pos_of_noz=rad_bot-(((noz/height_of_cone))*math.abs(diff));
            }
            //let shell_rad = this.props.component[index_key].sd / 2;
            let phi = math.asin((barrel_outer_diameter / 2 / pos_of_noz));
            let x_displace = (pos_of_noz) * math.cos(phi);
            nozzle = Standard_nozzle(length, 0, barrel_outer_diameter, bore, 0, flange_outer_diameter, raised_face_diameter, raised_face_thickness, flange_thickness, bolt_hole_number, bolt_circle_diameter, bolt_hole_size);
            nozzle.translateZ(-x_displace * math.cos(orientation_in_rad)).translateX(x_displace * math.sin(orientation_in_rad)).translateY(nozzle_height).rotateY(-orientation_in_rad);
            
            this.scene.add(nozzle);
         
          }
           
            {
              if (!(this.props.component[i].componentID in this.heights)) {
                this.heights[this.props.component[i].componentID] = -500;
              };

              //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
            }

            //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
          
          }
          
            if (this.props.component[i].component === "Nozzle" && this.props.component[i].type_name === "HB") {
              var length = this.props.component[i].length;
              var orientation = this.props.component[i].orientation;
              var orientation_in_rad = (orientation / 180) * math.pi;
              var nozzle_height = this.props.component[i].height;
              var nozzle = new THREE.Mesh();
              nozzle = Curve_nozzle(length, this.scaler);
              // nozzle.translateY(4);
              nozzle.translateZ(-this.radial_position * math.cos(orientation_in_rad)).translateX(this.radial_position * math.sin(orientation_in_rad)).translateY(nozzle_height).rotateY(-orientation_in_rad);
              this.scene.add(nozzle);

              if (!height_checker(this.props.component[i])) {
                {
                  if (!(this.props.component[i].componentID in this.heights)) {

                    this.heights[this.props.component[i].componentID] = this.height_position;
                  };

                  //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
                }

                //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
              }
            }
            // if(this.camera)
            // {
            //   this.camera.position.z=(this.length+rad)*1.8;
            //   }

          }
          if (this.props.component[i].component === "Skirt") {
            let length = parseFloat(this.props.component[i].length);
            let sd = parseFloat(this.props.component[i].sd);
            let thickness = parseFloat(this.props.component[i].thickness);
            let response = this.props.component[i].value.thicknessResponse;
            let skirt = Shell(thickness, sd, sd, length,new THREE.MeshPhongMaterial({
              color: '#CD5C5C',
              emissive: 0x072534,
              side: THREE.DoubleSide
            }));
            let skirt_flange = Shell(4, sd, sd + 2, 4,new THREE.MeshPhongMaterial({
              color: '#CD5C5C',
              emissive: 0x072534,
              side: THREE.DoubleSide
            }));
            skirt.translateY(-length / 2);
            skirt_flange.translateY(-length - 4 / 2);
            this.scene.add(skirt);
            this.scene.add(skirt_flange);
            if (!height_checker(this.props.component[i])) {
              {
                if (!(this.props.component[i].componentID in this.heights)) {

                  this.heights[this.props.component[i].componentID] = this.height_position;
                };

                //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
              }

              //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
            }
            this.lengths.push(-500);
          }
          this.start();
        }

      }
      //console.log(this.props.component);
      return ( < div style = {
          {
            width: '100%',
            height: '700px'
          }
        }
        ref = {
          (mount) => {
            this.mount = mount
          }
        }
        />
      );
    } catch (err) {
      console.log(err);
    }
  }
}

const mapStateToProps = state => {
  return {
    component: state.componentData.component,
    title: state.navigation.title
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

    onDataUpdateonDataUpdate: (data, componentID, height) => {
      dispatch(actions.dataUpdate1(data, componentID, height))
    }
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(Scene);