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
  import LiftingLug from '../../Components/Parts/LiftingLug';
  import Standard_nozzle from '../../Components/Parts/Standard_nozzle';
  import comparator from '../../Components/Scene/comparator';
  import math from 'mathjs';
  import height_checker from '../../Components/Scene/height_checker';
  import getClosest from 'get-closest'
  import height_comparator from '../../Components/Scene/height_comparator';
  import returnKey from '../../Components/Scene/returnKey';
  import getSum from '../../Components/Scene/getSum';
  import {
    connect
  } from 'react-redux';
  import {
    SpheroidHeadBufferGeometry
  } from '../../Components/Parts/SpheroidHead_v2';
  
  class Scene_horizontal extends Component {
  
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
      this.camera.position.y=15;
    
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
      let ambient = new THREE.AmbientLight(0xbbbbbb);
      this.scene.add(ambient);
  
      let directionalLight = new THREE.DirectionalLight(0xffffff);
      directionalLight.position.set(0, 0, 1);
      this.scene.add(directionalLight);
      this.material = new THREE.MeshPhongMaterial({
        color: '#0b7dba',
        emissive: 0x072534,
       // side: THREE.DoubleSide
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
      this.weights = {};
      this.cylinder_lengths = [];
     
      this.first_shell = true;
      this.heights_only = [];
      this.start();
  
  
    }
    onDocumentMouseDown = (event) => {
      let projector = new THREE.Projector();
      let tube;
      let vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
      projector.unprojectVector(vector, this.camera);
  
      let raycaster = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());
      if (this.shapes.length >= 1) {
        console.log(this.shapes);
  
        let intersects = raycaster.intersectObjects(this.shapes);
        console.log("intersects", intersects);
        if (intersects.length > 0) {
          intersects[0].object.material.transparent = true;
          console.log("pressed cylinder");
          if (intersects[0].object.material.opacity === 0.5) {
            intersects[0].object.material.opacity = 1;
          } else {
            intersects[0].object.material.opacity = 0.5;
          }
  
  
          let points = [];
          points.push(new THREE.Vector3(this.camera.position.x, this.camera.position.y - 0.2, this.camera.position.z));
          points.push(intersects[0].point);
  
          let mat = new THREE.MeshBasicMaterial({
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
  
  clearScene=( ) =>{
    for (let i = this.scene.children.length - 1; i >= 0; i--) {
      const object = this.scene.children[i];
     if(object.type==="Mesh"){
       object.geometry.dispose();
       object.material.dispose();
     }
     else if (object.type==="Group")
     {
      for (let h = object.children.length - 1; h >= 0; h--) {
        const object2 = object.children[h];
        if(object2.type==="Mesh"){
          object2.geometry.dispose();
          object2.material.dispose();
        }
        else if (object2.type==="Group")
        {
         for (let j = object2.children.length - 1; j >= 0; j--) {
           const object3 = object2.children[j];
           if(object3.type==="Mesh"){
             object3.geometry.dispose();
             object3.material.dispose();
             //this.scene.remove(object3);
           }
           else if (object3.type==="Group")
        {
         for (let k = object3.children.length - 1; k >= 0; k--) {
           const object4 = object3.children[j];
           if(object4.type==="Mesh"){
             object4.geometry.dispose();
             object4.material.dispose();
             //this.scene.remove(object3);
           }
          }
        }
          }
        }
  
      }
  
      }
      if (object.type === "Mesh" || object.type === "Group") {
        this.scene.remove(object);
        
      }
      //  while(object.type!=="Mesh")
      //  {
      //    childrens=return_children
      //    if(childrens.type==)
      //  }
      //   //  object.children[j].geometry.dispose();
      //   // object.children[j].material.dispose();
      //   this.scene.remove(object);
      //   children[i].geometry.dispose();
      //   children[i].
      //   console.log("cleared group",object);
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
  
    return_children=(object)=>
    {
      return object.children;
    }

  
    renderScene = () => {
      this.renderer.render(this.scene, this.camera);
    }
    render() {
      try {
        this.first_shell = true;
        this.height_position = 0;
        let scaler = 0;
        this.heights={};
        this.weights={};
        let cylinder_iterator = 0;
        this.cylinder_lengths = [];
        this.lengths=[];
        let last_cylinder=null;
        if(this.scene)
        {
          if(this.scene.children)
          {
            this.clearScene();
          }
        }
        if (this.props.component.length >= 0) {
          let rad = 0;
          console.log(this.props.component);
          for (let i = 0; i < this.props.component.length; i++) {
            if ( this.props.component[i].component === "Cylinder" || this.props.component[i].component === "Conical") {
              let diameter_bot = 0;
              let diameter_top = 0;
              let diameter=0;
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
              let number = parseFloat(this.props.component[i].number);
              let thickness = parseFloat(this.props.component[i].thickness);
              let shell = new THREE.Mesh();
              shell = Shell(thickness, diameter_bot, diameter_top, this.length);
              if (this.first_shell) {
                this.height_position = this.height_position + this.length / 2;
    
                if (!height_checker(this.props.component[i])) { //always returns false since the function for reducer is not dispatched, works even if not used
                  {
                    if (!(this.props.component[i].componentID in this.heights)) {
                      this.heights[this.props.component[i].componentID] = this.height_position;
                      this.weights[this.props.component[i].componentID] =[this.props.component[i].component,this.height_position,this.props.component[i].value.weight];
                    };
                    console.log("weights",this.weights);
                    //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
                  }
                  //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
                }
                this.first_shell = false;
              } else if ((i - 1) >= 0) {
                //  if (this.props.component[i-1].component==="Cylinder" || !this.first_shell || this.props.component[i-1]==="Conical"){
                if (!this.first_shell && this.props.component.filter(comparator).length >= 2) {
                  //let ringgeometry = new THREE.RingGeometry((parseFloat(this.props.component[i-1].sd)/2) , (parseFloat(this.props.component[i-1].sd)/2)+parseFloat(this.props.component[i-1].thickness)+3,400);
                  let ringmaterial = new THREE.MeshBasicMaterial({
                    color: 0xffff00,
                    side: THREE.DoubleSide
                  });
                  diameter = (parseFloat(this.props.component[i].sd) + parseFloat(this.props.component[i].thickness)) || (parseFloat(this.props.component[i].sd_s) + parseFloat(this.props.component[i].thickness));
                  let ringgeometry = Shell(1, diameter, diameter, 1, ringmaterial);
  
                  // let ringmesh = new THREE.Mesh( ringgeometry, ringmaterial );
                  let lengths = this.props.component[i].length; //length of current cylinder
                  this.height_position = this.height_position + this.cylinder_lengths[cylinder_iterator - 1] / 2 + lengths / 2; //update height position 
  
                  if (!height_checker(this.props.component[i])) {
                    {
                      if (!(this.props.component[i].componentID in this.heights)) {
  
                        this.heights[this.props.component[i].componentID] = this.height_position;
                        this.weights[this.props.component[i].componentID] =[this.props.component[i].component,this.height_position,this.props.component[i].value.weight];
                      };
  
                      //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
                    }
  
                    //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
                  }
                  //ringmesh.translateY(this.height_position-this.length/2).rotateX(math.pi/2);
                  ringgeometry.translateX(this.height_position - this.length / 2).rotateZ(-math.pi/2);
                
                  //this.scene.add( ringmesh );
                  this.scene.add(ringgeometry);
                }
              }
              shell.translateY(this.height_position); //this.height_position);  
              //this.scene.add(shell);
              let cylinder_group=new THREE.Group();
              cylinder_group.add(shell);
              cylinder_group.rotateZ(-math.pi/2);
              // }    
              this.first = this.first + 2;

              this.scene.add(cylinder_group);
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
              last_cylinder=i;
            } else if (this.props.component[i].component === "Ellipsoidal Head") {
              let diameter = parseFloat(this.props.component[i].sd) / 2;
              let head_thickness = parseFloat(this.props.component[i].thickness);
              this.shell_diameter = parseFloat(this.props.component[i].sd);
              let ratio = parseFloat(this.props.component[i].hr);
              let minor = diameter / ratio;
              let major = diameter + head_thickness;
              let srl = parseFloat(this.props.component[i].srl);
              
              // if (this.head_no==0  && this.first==0)
              if (this.props.component[i].position === '0') {
                this.lengths.push(-500);
                let inner_maj = major - head_thickness;
                let head1 = new SpheroidHeadBufferGeometry(major, minor, inner_maj, minor - minor / 3, 400);
                let material = new THREE.MeshPhongMaterial({
                  color: '#0b7dba',
                  emissive: 0x072534,
                 // side: THREE.DoubleSide
                });
                let flange = Shell(head_thickness, this.shell_diameter, this.shell_diameter, srl, this.material);
                let head = new THREE.Mesh(head1, material);
                let grouper = new THREE.Group();
                flange.translateY(-srl / 2);
                grouper.add(flange)
                head.translateY(-srl).rotateZ(3.14);
                grouper.add(head);
                grouper.rotateZ(-math.pi/2);
                this.scene.add(grouper);
                this.shapes.push(head);
                this.first = this.first + 1;
                console.log("height of head",minor+srl);
                this.head_no = 1;
  
  
                if (!height_checker(this.props.component[i])) {
                  {
                    if (!(this.props.component[i].componentID in this.heights)) {
  
                      this.heights[this.props.component[i].componentID] = -500;
                      this.weights[this.props.component[i].componentID] =[this.props.component[i].component,-(4*minor)/(3*math.pi),this.props.component[i].value.weight];
  
                    };
  
                    //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
                  }
  
                  //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
                }
  
              }
              //else if (this.first!=0)
              else {
                this.lengths.push(minor);
                let head1 = new SpheroidHeadBufferGeometry(major, minor, major - head_thickness, minor - head_thickness, 400);
                let material = new THREE.MeshPhongMaterial({
                  color: '#0b7dba',
                  emissive: 0x072534,
                  side: THREE.DoubleSide
                });
                let head = new THREE.Mesh(head1, material);
                //this.height_position=this.height_position-r2+this.length/2;
                //head.translateY(this.height_position);
               // this.height_position = this.height_position + this.length / 2 + srl / 2;
                //  let height_top=this.height_position + this.length / 2 + srl / 2;
                
                let grouper2 = new THREE.Group();
                let flange2 = Shell(head_thickness, this.shell_diameter, this.shell_diameter, srl, this.material);
                head.translateY(srl / 2);
                grouper2.add(flange2);
                grouper2.add(head);
                let height_for_top=0;
                for (let i = 0; i < this.props.component.length; i++)
                    {
                      if(this.props.component[i].length && (this.props.component[i].component === "Cylinder" || this.props.component[i].component === "Conical"))
                      {
  
                      height_for_top=height_for_top+this.props.component[i].length;
                      }
                    }
                    if (!height_checker(this.props.component[i])) {
                      {
                        if (!(this.props.component[i].componentID in this.heights)) {
      
                          //this.heights[this.props.component[i].componentID] = height_for_top;
                          this.heights[this.props.component[i].componentID] = -500;
                          this.weights[this.props.component[i].componentID] =[this.props.component[i].component,height_for_top+(4*minor)/(3*math.pi),this.props.component[i].value.weight];
                        };
      
                        //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
                      }
      
                      //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
                    }
                grouper2.translateX(height_for_top).rotateZ(-math.pi/2);
                this.scene.add(grouper2);
  
                //head.translateY(this.height_position);
              }
  
              // this.radial_position=rad;
  
            } else if  (this.props.component[i].component === "Nozzle" && this.props.component[i].type_name === "LWN") {
                let length = this.props.component[i].externalNozzleProjection;
                let orientation = this.props.component[i].orientation;
                let orientation_in_rad = (orientation / 180) * math.pi;
                this.lengths.push(-1000);
                let nozzle_height = this.props.component[i].height;
                this.heights_only=[];
                console.log("height",this.heights);
                for (let key in this.heights) {
                  let i = this.heights[key];
                  this.heights_only.splice(key, 0, i); //retrieve height only ie values for respective key, here we cannot input nozzle heights , splice adds element to specific position with 0 replacement
                  console.log("heights only", this.heights_only);
                }
  
                let closest_index = getClosest.number(nozzle_height, this.heights_only);
                let closest_value = this.heights[closest_index];
                let index_key = returnKey(this.heights, closest_value);
                let nozzle = new THREE.Mesh();
                let barrel_outer_diameter = this.props.component[i].value.barrel_outer_diameter;
                let bolt_circle_diameter = this.props.component[i].value.blot_circle_diameter;
                let bolt_hole_number = this.props.component[i].value.blot_hole_number;
                let bolt_hole_size = this.props.component[i].value.blot_hole_size;
                let bore = this.props.component[i].value.bore;
                let flange_outer_diameter = this.props.component[i].value.flange_outer_diameter;
                let flange_thickness = this.props.component[i].value.flange_thickness;
                let neck_thickness = this.props.component[i].value.neck_thickness;
                let nominal_pipe_size = this.props.component[i].value.nominal_pipe_size;
                let nut_stop_diameter = this.props.component[i].value.nut_stop_diameter;
                let raised_face_diameter = this.props.component[i].value.raised_face_diameter;
                let raised_face_thickness = this.props.component[i].value.raised_face_thickness;
                if(this.props.component[index_key].component==="Cylinder")
                {
                let shell_rad = this.props.component[index_key].sd / 2;
                let phi = math.asin((barrel_outer_diameter / 2 / shell_rad));
                let x_displace = (shell_rad) * math.cos(phi);
                nozzle = Standard_nozzle(length, 0, barrel_outer_diameter, bore, 0, flange_outer_diameter, raised_face_diameter, raised_face_thickness, flange_thickness, bolt_hole_number, bolt_circle_diameter, bolt_hole_size);
                nozzle.translateZ(-x_displace * math.cos(orientation_in_rad)).translateY(x_displace * math.sin(orientation_in_rad)).translateX(nozzle_height).rotateX(orientation_in_rad);
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
              if(index_key>=0) //checking if nozzle is required for the first cylinder or other, cause for first it will be equal to nozzle height, but for others the height is from the origin, but we need the height only from the corresponding cylinder 
              {
              noz=nozzle_height-(this.heights_only[index_key]-height_of_cone/2);
              }
              else
              {
                noz=nozzle_height;
              }
              if(diff>=0) //check if is positive to check position of nozzle below or above the height of corresponding cylinder
              {
                pos_of_noz=rad_bot+((noz/(height_of_cone))*diff);
              }
              else{
                pos_of_noz=rad_bot-(((noz/height_of_cone))*math.abs(diff));
              }
              //let shell_rad = this.props.component[index_key].sd / 2;
              let phi = math.asin((barrel_outer_diameter / 2 / pos_of_noz));//calculating angle wrt to centre
              let x_displace = (pos_of_noz) * math.cos(phi);
              nozzle = Standard_nozzle(length, 0, barrel_outer_diameter, bore, 0, flange_outer_diameter, raised_face_diameter, raised_face_thickness, flange_thickness, bolt_hole_number, bolt_circle_diameter, bolt_hole_size);
              nozzle.translateZ(-x_displace * math.cos(orientation_in_rad)).translateY(x_displace * math.sin(orientation_in_rad)).translateX(nozzle_height).rotateX(orientation_in_rad);
        
              this.scene.add(nozzle);
           
            }
             
              {
                if (!(this.props.component[i].componentID in this.heights)) {
                  this.heights[this.props.component[i].componentID] = -500;
                  this.weights[this.props.component[i].componentID] =[this.props.component[i].component,0,this.props.component[i].value.weight];
  
                };
  
                //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
              }
              
             // console.log(this.weights);
             let weightXCG=0;
             let weightsum=0;
         /*     for (let i = 0; i < this.props.component.length; i++)
              {
              
                weightsum+=this.weights[i][2];
                weightXCG+=this.weights[i][1]*this.weights[i][2];
                console.log("CG",this.weights[i][2],this.weights[i][1]);
              } 
              console.log("overall CG",weightXCG/weightsum);
              //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
            */
            }
            
              else if (this.props.component[i].component === "Nozzle" && this.props.component[i].type_name === "HB") {
  
                let length = this.props.component[i].length;
                let orientation = this.props.component[i].orientation;
                let orientation_in_rad = (orientation / 180) * math.pi;
                let nozzle_height = this.props.component[i].height;
                let nozzle = new THREE.Mesh();
                nozzle = Curve_nozzle(length, this.scaler);
                // nozzle.translateY(4);
                nozzle.translateZ(-this.radial_position * math.cos(orientation_in_rad)).translateX(this.radial_position * math.sin(orientation_in_rad)).translateY(nozzle_height).rotateY(-orientation_in_rad);
                this.scene.add(nozzle);
  
                if (!height_checker(this.props.component[i])) {
                  {
                    if (!(this.props.component[i].componentID in this.heights)) {
  
                      this.heights[this.props.component[i].componentID] = this.height_position;
                      this.weights[this.props.component[i].componentID] =[this.props.component[i].component,0,this.props.component[i].value.weight];
  
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
  
            
           else if (this.props.component[i].component === "Skirt") {
             /* let length = parseFloat(this.props.component[i].length);
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
              console.log(skirt);
              if (!height_checker(this.props.component[i])) {
                {
                  if (!(this.props.component[i].componentID in this.heights)) {
  
                    this.heights[this.props.component[i].componentID] = -500;
                    this.weights[this.props.component[i].componentID] =[this.props.component[i].component,-(length/2+2),this.props.component[i].value.weight];
                  };
  
                  //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
                }
  
                //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
              }
              this.lengths.push(-500);*/
            }
            else if (this.props.component[i].component === "Lifting Lug")
            {
                let weightXCG=0;
                let weightsum=0;
                for (let i = 0; i < this.props.component.length; i++)
                 {
                 
                   weightsum+=this.weights[i][2];
                   weightXCG+=this.weights[i][1]*this.weights[i][2];
                   console.log("CG",this.weights[i][2],this.weights[i][1]);
                 } 
                 let overall_CG=weightXCG/weightsum;
                 let lug1=LiftingLug();
                 let lug2=LiftingLug();
                 lug1.translateX(overall_CG+20).translateY(this.props.component[last_cylinder].sd);
                 lug2.translateX(overall_CG-20).translateY(this.props.component[last_cylinder].sd);
                 
                 console.log("overall CG",overall_CG);
  
            }
            else if (this.props.component[i].component === "Saddle")
            {
                let saddle = Saddle();

            }
            console.log("component name",this.props.component[i].component);
  
            this.start();
            
          }
          console.log("weights",this.weights);
  
        }
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
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(Scene_horizontal);