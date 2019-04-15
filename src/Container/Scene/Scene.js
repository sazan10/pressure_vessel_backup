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
    this.renderer.setPixelRatio( window.devicePixelRatio );  
    this.mount.appendChild(this.renderer.domElement);
    this.group = new THREE.Group();
    document.getElementById("scener").addEventListener( 'click', this.onDocumentMouseDown, false );
    window.addEventListener( 'resize', this.onWindowResize, false );

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
    let rect = document.getElementById("scener").getBoundingClientRect();

    let projector = new THREE.Projector();
    //console.log("mouse click",event.clientX,event.clientY,rect.right,"   dffd ",rect.bottom);

    let vector = new THREE.Vector3((event.clientX-rect.left) / window.innerWidth * 2 - 1, -((event.clientY-rect.top) / window.innerHeight) * 2 + 1, 0.5),INTERSECTED;
    projector.unprojectVector(vector, this.camera);
    let raycaster = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());
   
    if (this.shapes.length >= 1) {
     
     // console.log(this.shapes);
      let intersects = raycaster.intersectObjects(this.shapes,true);
      if (intersects.length > 0) {
       // console.log("intersect",intersects);
        intersects[0].object.material.transparent = true;
       try{
        const sh=[...this.shapes];
        sh.map((shape)=>{
        console.log("shapes are",shape);
        let sh_name=shape.name.split("&");
        if(sh_name[1]===("Cylinder"||"Ellipsoidal Head"))
        {
        shape.material.opacity=1;
        console.log("material",shape.name.split("&")[1]);
        }
        else{
          console.log("jdkfjdlf");
          shape.children.map((child)=>
          {
            console.log("children shapes",child);
            child.material.opacity=1;
            return 0;
          })
        }
        return 0;
        }
        );
      }
      catch(e)
      {
        console.log(e)
      }
        let name=null;
        if(intersects[0].object.parent.name)
        {
          name=intersects[0].object.parent.name;
        }
        else{            
          name=intersects[0].object.name;
        }
      
        let res=name.split("&");
        console.log("pressed object number",res[0],res[1]);
        this.props.treeUpdate(false);
       this.props.modelImport(res[1],1);
       this.props.returnComponentID(res[0]);
       this.props.componentClicked(true);
        if (intersects[0].object.material.opacity === 0.5) {
          intersects[0].object.material.opacity = 1;
        } else {
          intersects[0].object.material.opacity = 0.5;
        }
 
      }
    }
    this.controls.update();
  }
  onWindowResize=()=> {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
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
clearScene2=( ) =>{
  for (let i = this.scene.children.length - 1; i >= 0; i--) {
    const object = this.scene.children[i];
   if(object.type==="Mesh"){
     object.geometry.dispose();
     object.material.dispose();
     this.scene.remove(object);
    console.log("cleared",object);
   }
   else if (object.type==="Group")
   {
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
    console.log("length of children",object,object.children.length);
     }
     
   }
  }

  renderScene = () => {
    this.renderer.render(this.scene, this.camera);
  }
  render() {
    try {
      this.first_shell= true;
      this.height_position = 0;
      this.heights={};
      this.weights={};
      let cylinder_iterator = 0;
      this.cylinder_lengths = [];
      this.lengths=[];
      this.shapes=[];
      let last_cylinder=null;
      if(this.scene)
      {
        if(this.scene.children)
        {
          this.clearScene();
        }
      }
      if (this.props.component.length >= 0) {
       // console.log(this.props.component);
        for (let i = 0; i < this.props.component.length; i++) {
          if (this.props.component[i].component === "Cylinder" || this.props.component[i].component === "Conical") {
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
            this.length = parseFloat(this.props.component[i].length)*12;
            this.cylinder_lengths.push(this.length);
            this.lengths.push(this.length);
            let number = parseFloat(this.props.component[i].number);
            let thickness = parseFloat(this.props.component[i].thickness);
            let shell = new THREE.Mesh();
            let shell_material = new THREE.MeshPhongMaterial({ color: '#037d23', emissive: 0x072534, side: THREE.DoubleSide });
            shell = Shell(thickness, diameter_bot, diameter_top, this.length,shell_material);
            shell.name=this.props.component[i].componentID + "&"+this.props.component[i].component ;
            if (this.first_shell) {
              this.height_position = this.height_position + this.length / 2;
  
              if (!height_checker(this.props.component[i]))  //always returns false since the function for reducer is not dispatched, works even if not used
                {
                  if (!(this.props.component[i].componentID in this.heights)) {
                    this.heights[this.props.component[i].componentID] = this.height_position;
                    this.weights[this.props.component[i].componentID] =[this.props.component[i].component,this.height_position,this.props.component[i].value.weight];
                  };
                  //console.log("weights",this.weights);
                  //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
                }
                //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
              
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
                let lengths = this.props.component[i].length*12; //length of current cylinder
                this.height_position = this.height_position + this.cylinder_lengths[cylinder_iterator - 1] / 2 + lengths / 2; //update height position 

                if (!height_checker(this.props.component[i])) 
                  {
                    if (!(this.props.component[i].componentID in this.heights)) {

                      this.heights[this.props.component[i].componentID] = this.height_position;
                      this.weights[this.props.component[i].componentID] =[this.props.component[i].component,this.height_position,this.props.component[i].value.weight];
                    };

                    //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
                  }

                  //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
                
                //ringmesh.translateY(this.height_position-this.length/2).rotateX(math.pi/2);
                ringgeometry.translateY(this.height_position - this.length / 2);

                //this.scene.add( ringmesh );
                this.scene.add(ringgeometry);
              }
            }
            shell.translateY(this.height_position); //this.height_position);  
            //this.scene.add(shell);
            let cylinder_group=new THREE.Group();
            cylinder_group.add(shell);
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
          } else if ( this.props.component[i].component === "Ellipsoidal Head") {
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
              this.scene.add(grouper);
              head.name=this.props.component[i].componentID + "&"+ this.props.component[i].component;
              this.shapes.push(grouper);
              this.first = this.first + 1;
            //  console.log("height of head",minor+srl);
              this.head_no = 1;


              if (!height_checker(this.props.component[i])) 
                {
                  if (!(this.props.component[i].componentID in this.heights)) {

                    this.heights[this.props.component[i].componentID] = -500;
                    this.weights[this.props.component[i].componentID] =[this.props.component[i].component,-(4*minor)/(3*math.pi),this.props.component[i].value.weight];

                  };

                  //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
                }

                //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
              

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

                    height_for_top=height_for_top+parseFloat(this.props.component[i].length)*12;
                    //console.log("height of head",height_for_top,this.props.component[i].length)
                    }
                  }
                  if (!height_checker(this.props.component[i])) 
                    {
                      if (!(this.props.component[i].componentID in this.heights)) {
    
                        //this.heights[this.props.component[i].componentID] = height_for_top;
                        this.heights[this.props.component[i].componentID] = -500;
                        this.weights[this.props.component[i].componentID] =[this.props.component[i].component,height_for_top+(4*minor)/(3*math.pi),this.props.component[i].value.weight];
                      };
    
                      //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
                    }
    
                    //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
                  
              grouper2.translateY(height_for_top);
              this.scene.add(grouper2);
              head.name=this.props.component[i].componentID +  "&"+this.props.component[i].component;
              this.shapes.push(grouper2);


              //head.translateY(this.height_position);
            }

            // this.radial_position=rad;

            if (this.camera) {
              // this.camera.position.z=(this.length+rad)*1.8;
            }
          } else if (this.props.component[i].component === "Nozzle" && this.props.component[i].type_name === "LWN") {
              let length = this.props.component[i].externalNozzleProjection;
              let orientation = this.props.component[i].orientation;
              let nozzle_material =new THREE.MeshPhongMaterial({ color: '#0b7dba', emissive: 0x072534, side: THREE.DoubleSide });
              let orientation_in_rad = (orientation / 180) * math.pi;
              this.lengths.push(-1000);
              let nozzle_height = this.props.component[i].height;
              this.heights_only=[];
             // console.log("height",this.heights);
              for (let key in this.heights) {
                let i = this.heights[key];
                this.heights_only.splice(key, 0, i); //retrieve height only ie values for respective key, here we cannot input nozzle heights , splice adds element to specific position with 0 replacement
               // console.log("heights only", this.heights_only);
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
              let raised_face_diameter = this.props.component[i].value.raised_face_diameter;
              let raised_face_thickness = this.props.component[i].value.raised_face_thickness;
              if(this.props.component[index_key].component==="Cylinder")
              {
              let shell_rad = this.props.component[index_key].sd / 2;
              let phi = math.asin((barrel_outer_diameter / 2 / shell_rad));
              let x_displace = (shell_rad) * math.cos(phi);
              nozzle = Standard_nozzle(length, 0, barrel_outer_diameter, bore, 0, flange_outer_diameter, raised_face_diameter, raised_face_thickness, flange_thickness, bolt_hole_number, bolt_circle_diameter, bolt_hole_size,nozzle_material);
              nozzle.translateZ(-x_displace * math.cos(orientation_in_rad)).translateX(x_displace * math.sin(orientation_in_rad)).translateY(nozzle_height).rotateY(math.PI/2-orientation_in_rad);
              nozzle.name=this.props.component[i].componentID+ "&"+this.props.component[i].component;

            //  console.log("component id of nozzle",this.props.component[i].componentID,nozzle);
              this.scene.add(nozzle);
              this.shapes.push(nozzle);

            }
            else if(this.props.component[index_key].component==="Conical")
          {
            let rad_bot=this.props.component[index_key].sd_s/2;
            let rad_top=this.props.component[index_key].sd_l/2;
            let temp=this.props.component;
            let height_of_cone=this.props.component[index_key].length*12;
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
            
            nozzle.translateZ(-x_displace * math.cos(orientation_in_rad)).translateX(x_displace * math.sin(orientation_in_rad)).translateY(nozzle_height).rotateY(-orientation_in_rad);
      
            this.scene.add(nozzle);
            nozzle.name=this.props.component[i].componentID+ "&"+this.props.component[i].component;
            this.shapes.push(nozzle);

         
          }
           
            {
              if (!(this.props.component[i].componentID in this.heights)) {
                this.heights[this.props.component[i].componentID] = -500;
                this.weights[this.props.component[i].componentID] =[this.props.component[i].component,0,this.props.component[i].value.weight];

              };

              //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
            }
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
              nozzle.name=this.props.component[i].componentID+ "&"+this.props.component[i].component;
              this.shapes.push(nozzle);


              if (!height_checker(this.props.component[i])) 
                {
                  if (!(this.props.component[i].componentID in this.heights)) {

                    this.heights[this.props.component[i].componentID] = this.height_position;
                    this.weights[this.props.component[i].componentID] =[this.props.component[i].component,0,this.props.component[i].value.weight];

                  };

                  //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
                }

                //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
              
             
            }
            // if(this.camera)
            // {
            //   this.camera.position.z=(this.length+rad)*1.8;
            //   }

          
         else if (this.props.component[i].component === "Skirt") {
            let length = parseFloat(this.props.component[i].length);
            let sd = parseFloat(this.props.component[i].sd);
            let thickness = parseFloat(this.props.component[i].thickness);
            let skirt_material=new THREE.MeshPhongMaterial({
              color: '#CD5C5C',
              emissive: 0x072534,
              side: THREE.DoubleSide
            });
            let skirt = Shell(thickness, sd, sd, length,skirt_material);

            let skirt_flange = Shell(4, sd, sd + 2, 4,skirt_material);
            skirt.translateY(-length / 2);
            skirt_flange.translateY(-length - 4 / 2);
            let group = new THREE.Group();
            group.add(skirt);
            group.add(skirt_flange);
            this.scene.add(group);
            group.name=this.props.component[i].componentID+ "&"+this.props.component[i].component;
            this.shapes.push(group);

            console.log(skirt);
            if (!height_checker(this.props.component[i])) 
              {
                if (!(this.props.component[i].componentID in this.heights)) {

                  this.heights[this.props.component[i].componentID] = -500;
                  this.weights[this.props.component[i].componentID] =[this.props.component[i].component,-(length/2+2),this.props.component[i].value.weight];
                };

                //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
              }

              //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
            
            this.lengths.push(-500);
          }
          else if (this.props.component[i].component === "Lifting Lug")
          {
            if (!height_checker(this.props.component[i]))  //height parameter is used only for nozzle and we donts need to add height for nozzle so...
              {
                if (!(this.props.component[i].componentID in this.heights)) {

                  this.heights[this.props.component[i].componentID] = -500;
                  this.weights[this.props.component[i].componentID] = 0;//[this.props.component[i].component, 0, this.props.component[i].weight];

                };

                //this.props.onDataUpdate(this.props.component[i], this.props.component[i].componentID,this.height_position);
              }
            // let weightXCG=0;
            // let weightsum=0;
            //  for (let i = 0; i < this.props.component.length; i++)
            //  {
             
            //    weightsum+=this.weights[i][2];
            //    weightXCG+=this.weights[i][1]*this.weights[i][2];
            //    console.log("CG",this.weights[i][2],this.weights[i][1]);
            //  } 
            //  let overall_CG=weightXCG/weightsum;
            let thickness=this.props.component[i].value.lug_thickness.req_value;
            let height=this.props.component[i].height_lug;
           // console.log("height for lug",height);
            let rad=5//this.props.component[i].length;
            let hole_diameter=this.props.component[i].hole_diameter;
            let angle=this.props.component[i].layout_angle;
             let lug1=LiftingLug(height,thickness,rad,hole_diameter);
             this.scene.add(lug1);
             lug1.name=this.props.component[i].componentID+ "&"+this.props.component[i].component;
             this.shapes.push(lug1);

             let lug2=null;
             if(this.props.component[i].number==='2'){
               console.log("two lugs");
             lug2=LiftingLug(height,thickness,rad,hole_diameter);
             this.scene.add(lug2);
             }

            if(last_cylinder!==null)
            {
              let height_pos=this.heights[last_cylinder]+(this.props.component[last_cylinder].length*12)/2-height/2.2;
             let shell_rad = this.props.component[last_cylinder].sd/2+this.props.component[last_cylinder].value.thickness;//finding the diameter of last shell
             let x_displace = (shell_rad) * math.sin(math.pi*(angle/180));
             let z_displace=(shell_rad)*math.cos(math.pi*(angle/180));
             console.log("last_cylinder",last_cylinder,angle,x_displace);
             //let phi = math.asin((barrel_outer_diameter / 2 / shell_rad));
           
             lug1.translateX(x_displace).translateZ(-z_displace).translateY(height_pos).rotateY(-(angle/180)*math.pi);//.translateY(height).translateZ(z_displace);
             if(this.props.component[i].number==='2'){

             lug2.translateX(-x_displace).translateZ(z_displace).translateY(height_pos).rotateY(-(angle/180)*math.pi+math.pi);
            }
          }
           //  lug1.translateY(this.heights[last_cylinder]+this.props.component[last_cylinder].length/2);
          
             //this.scene.add(lug2); 
          }
         
          this.start();
        }
       
       // console.log("weights",this.weights);
      }
      console.log("shapes",this.shapes);
       

      
      return ( < div id="scener"
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

    onDataUpdate: (data, componentID, height) => {
      dispatch(actions.dataUpdate1(data, componentID, height))
    },
    treeUpdate: (value)=>
    {
      dispatch(actions.displayComponentTree(value))
    },
    modelImport:(titleName,value)=>{
      dispatch(actions.importModel(titleName,value))
    },
    returnComponentID:(id)=>{
      dispatch(actions.returnComponentByID(id))
    },
    componentClicked: (value) => {dispatch(actions.componentClicked(value))}

  };
};


export default connect(mapStateToProps, mapDispatchToProps)(Scene);